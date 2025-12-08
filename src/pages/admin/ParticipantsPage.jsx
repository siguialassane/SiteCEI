import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Search, FileText, X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ParticipantsPage = () => {
    const [participants, setParticipants] = useState([]);
    const [pollAnswers, setPollAnswers] = useState([]);
    const [filteredParticipants, setFilteredParticipants] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedParticipant, setSelectedParticipant] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const locations = {
        'commune_mbahiakro': "Commune M'bahiakro",
        'kondossou': 'Kondossou',
        'bonguera': 'Bonguera',
        'sp_mbahiakro': "SP M'bahiakro"
    };

    const candidates = {
        'rhdp': 'Bakary Ouattara (RHDP)',
        'pdci': 'Tialy (PDCI)',
        'indep_simon': 'K. Kouakou Simon',
        'indep_faustin': 'Atchelo Faustin',
        'indep_parfait': 'T. Hamed Parfait'
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        filterParticipants();
    }, [searchTerm, locationFilter, participants]);

    const fetchData = async () => {
        setIsLoading(true);
        
        const { data: participantsData, error: participantsError } = await supabase
            .from('participants')
            .select('*')
            .order('created_at', { ascending: false });

        if (participantsError) {
            console.error('Erreur lors du chargement des participants:', participantsError);
        }

        const { data: pollData } = await supabase
            .from('poll_answers')
            .select('*');

        setParticipants(participantsData || []);
        setPollAnswers(pollData || []);
        setIsLoading(false);
    };

    const filterParticipants = () => {
        let filtered = [...participants];

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(p =>
                p.first_name?.toLowerCase().includes(term) ||
                p.last_name?.toLowerCase().includes(term) ||
                p.phone?.includes(term)
            );
        }

        if (locationFilter !== 'all') {
            filtered = filtered.filter(p => p.location === locationFilter);
        }

        setFilteredParticipants(filtered);
        setCurrentPage(1);
    };

    const getPollAnswer = (participantId) => {
        return pollAnswers.find(p => p.participant_id === participantId);
    };

    const totalPages = Math.ceil(filteredParticipants.length / itemsPerPage);
    const paginatedParticipants = filteredParticipants.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const generatePDF = () => {
        try {
            const doc = new jsPDF();
            
            // En-tête
            doc.setFontSize(20);
            doc.setTextColor(255, 130, 0);
            doc.text('CEI Admin - Liste des Participants', 14, 22);
            
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Généré le ${format(new Date(), 'dd/MM/yyyy à HH:mm', { locale: fr })}`, 14, 30);
            doc.text(`Total: ${filteredParticipants.length} participants`, 14, 36);

            // Tableau
            const tableData = filteredParticipants.map(p => {
                const poll = getPollAnswer(p.id);
                const fullName = `${p.first_name || ''} ${p.last_name || ''}`.trim() || '-';
                return [
                    fullName,
                    p.phone || '-',
                    p.gender === 'M' ? 'Homme' : p.gender === 'F' ? 'Femme' : '-',
                    locations[p.location] || p.location || '-',
                    candidates[poll?.candidate] || '-',
                    format(new Date(p.created_at), 'dd/MM/yy', { locale: fr })
                ];
            });

            autoTable(doc, {
                startY: 42,
                head: [['Nom', 'Téléphone', 'Sexe', 'Localité', 'Vote', 'Date']],
                body: tableData,
                styles: { fontSize: 8, cellPadding: 2 },
                headStyles: { 
                    fillColor: [255, 130, 0], 
                    textColor: 255,
                    fontStyle: 'bold'
                },
                alternateRowStyles: { fillColor: [248, 250, 252] },
                columnStyles: {
                    0: { cellWidth: 35 },
                    1: { cellWidth: 28 },
                    2: { cellWidth: 18 },
                    3: { cellWidth: 35 },
                    4: { cellWidth: 45 },
                    5: { cellWidth: 20 }
                }
            });

            // Pied de page
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(150);
                doc.text(`Page ${i} / ${pageCount}`, doc.internal.pageSize.width - 25, doc.internal.pageSize.height - 10);
            }

            doc.save(`participants_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
        } catch (error) {
            console.error('Erreur lors de la génération du PDF:', error);
            alert('Erreur lors de la génération du PDF. Veuillez réessayer.');
        }
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
                <div style={{
                    width: '40px', height: '40px',
                    border: '4px solid #f3f4f6', borderTopColor: 'var(--color-orange)',
                    borderRadius: '50%', animation: 'spin 1s linear infinite'
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>
                    Liste des Participants
                </h2>
                <p style={{ color: '#64748b' }}>
                    {filteredParticipants.length} participant{filteredParticipants.length > 1 ? 's' : ''}
                </p>
            </div>

            {/* Actions */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '1.5rem',
                alignItems: 'center'
            }}>
                {/* Search */}
                <div style={{
                    flex: '1 1 250px',
                    position: 'relative'
                }}>
                    <Search size={18} style={{ 
                        position: 'absolute', 
                        left: '12px', 
                        top: '50%', 
                        transform: 'translateY(-50%)',
                        color: '#94a3b8'
                    }} />
                    <input
                        type="text"
                        placeholder="Rechercher par nom ou téléphone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem 0.75rem 2.5rem',
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px',
                            fontSize: '0.95rem',
                            outline: 'none'
                        }}
                    />
                </div>

                {/* Filter */}
                <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    style={{
                        padding: '0.75rem 1rem',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '0.95rem',
                        background: 'white',
                        cursor: 'pointer'
                    }}
                >
                    <option value="all">Toutes les localités</option>
                    {Object.entries(locations).map(([key, name]) => (
                        <option key={key} value={key}>{name}</option>
                    ))}
                </select>

                {/* Buttons */}
                <button
                    onClick={fetchData}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1rem',
                        background: '#f1f5f9',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        color: '#475569'
                    }}
                >
                    <RefreshCw size={18} />
                </button>

                <button
                    onClick={generatePDF}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.25rem',
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontWeight: 500
                    }}
                >
                    <FileText size={18} />
                    Export PDF
                </button>
            </div>

            {/* Table - Scrollable on mobile */}
            <div style={{
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch'
            }}>
                <table style={{
                    width: '100%',
                    minWidth: '700px',
                    borderCollapse: 'collapse'
                }}>
                    <thead>
                        <tr style={{ background: '#f8fafc' }}>
                            <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: 500, fontSize: '0.85rem' }}>Participant</th>
                            <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: 500, fontSize: '0.85rem' }}>Téléphone</th>
                            <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: 500, fontSize: '0.85rem' }}>Sexe</th>
                            <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: 500, fontSize: '0.85rem' }}>Localité</th>
                            <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: 500, fontSize: '0.85rem' }}>Vote</th>
                            <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: 500, fontSize: '0.85rem' }}>Date</th>
                            <th style={{ padding: '1rem', textAlign: 'center', color: '#64748b', fontWeight: 500, fontSize: '0.85rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedParticipants.map((p, index) => {
                            const poll = getPollAnswer(p.id);
                            return (
                                <tr 
                                    key={p.id}
                                    style={{ 
                                        borderTop: '1px solid #f1f5f9',
                                        background: index % 2 === 0 ? 'white' : '#fafbfc'
                                    }}
                                >
                                    <td style={{ padding: '0.875rem 1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{
                                                width: '36px',
                                                height: '36px',
                                                borderRadius: '50%',
                                                background: p.gender === 'F' ? '#ec4899' : '#3b82f6',
                                                color: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 600,
                                                fontSize: '0.8rem'
                                            }}>
                                                {getInitials(`${p.first_name || ''} ${p.last_name || ''}`)}
                                            </div>
                                            <span style={{ fontWeight: 500, color: '#1e293b' }}>
                                                {`${p.first_name || ''} ${p.last_name || ''}`.trim() || '-'}
                                            </span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '0.875rem 1rem', color: '#64748b' }}>{p.phone}</td>
                                    <td style={{ padding: '0.875rem 1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            fontWeight: 500,
                                            background: p.gender === 'F' ? '#fdf2f8' : '#eff6ff',
                                            color: p.gender === 'F' ? '#ec4899' : '#3b82f6'
                                        }}>
                                            {p.gender === 'M' ? '👨 Homme' : p.gender === 'F' ? '👩 Femme' : '-'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '0.875rem 1rem', color: '#64748b', fontSize: '0.9rem' }}>
                                        {locations[p.location] || p.location}
                                    </td>
                                    <td style={{ padding: '0.875rem 1rem' }}>
                                        {poll ? (
                                            <span style={{
                                                color: poll.candidate === 'rhdp' ? '#FF8200' : 
                                                       poll.candidate === 'pdci' ? '#009A44' : '#6b7280',
                                                fontWeight: 500,
                                                fontSize: '0.9rem'
                                            }}>
                                                {candidates[poll.candidate] || poll.candidate}
                                            </span>
                                        ) : (
                                            <span style={{ color: '#94a3b8' }}>-</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '0.875rem 1rem', color: '#64748b', fontSize: '0.9rem' }}>
                                        {format(new Date(p.created_at), 'dd/MM/yy', { locale: fr })}
                                    </td>
                                    <td style={{ padding: '0.875rem 1rem', textAlign: 'center' }}>
                                        <button
                                            onClick={() => setSelectedParticipant(p)}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.35rem',
                                                padding: '0.5rem 0.75rem',
                                                background: '#f1f5f9',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                color: '#475569',
                                                fontSize: '0.85rem'
                                            }}
                                        >
                                            <Eye size={14} />
                                            Détails
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginTop: '1.5rem'
                }}>
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        style={{
                            padding: '0.5rem',
                            background: currentPage === 1 ? '#f1f5f9' : 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                            opacity: currentPage === 1 ? 0.5 : 1
                        }}
                    >
                        <ChevronLeft size={18} />
                    </button>
                    
                    <span style={{ padding: '0 1rem', color: '#64748b' }}>
                        Page {currentPage} / {totalPages}
                    </span>
                    
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        style={{
                            padding: '0.5rem',
                            background: currentPage === totalPages ? '#f1f5f9' : 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                            opacity: currentPage === totalPages ? 0.5 : 1
                        }}
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            )}

            {/* Modal Détails */}
            <AnimatePresence>
                {selectedParticipant && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedParticipant(null)}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '1rem',
                            zIndex: 1000
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                background: 'white',
                                borderRadius: '20px',
                                padding: '2rem',
                                width: '100%',
                                maxWidth: '450px',
                                maxHeight: '90vh',
                                overflowY: 'auto'
                            }}
                        >
                            {/* Modal Header */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '1.5rem'
                            }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>
                                    Détails du Participant
                                </h3>
                                <button
                                    onClick={() => setSelectedParticipant(null)}
                                    style={{
                                        background: '#f1f5f9',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '36px',
                                        height: '36px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Avatar et Nom - Centré */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                marginBottom: '1.5rem',
                                padding: '1.5rem',
                                background: '#f8fafc',
                                borderRadius: '16px'
                            }}>
                                <div style={{
                                    width: '70px',
                                    height: '70px',
                                    borderRadius: '50%',
                                    background: selectedParticipant.gender === 'F' ? '#ec4899' : '#3b82f6',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 700,
                                    fontSize: '1.5rem',
                                    marginBottom: '0.75rem'
                                }}>
                                    {getInitials(`${selectedParticipant.first_name || ''} ${selectedParticipant.last_name || ''}`)}
                                </div>
                                <h4 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1e293b', textAlign: 'center' }}>
                                    {`${selectedParticipant.first_name || ''} ${selectedParticipant.last_name || ''}`.trim()}
                                </h4>
                                <span style={{
                                    marginTop: '0.5rem',
                                    padding: '0.25rem 1rem',
                                    borderRadius: '20px',
                                    fontSize: '0.85rem',
                                    fontWeight: 500,
                                    background: selectedParticipant.gender === 'F' ? '#fdf2f8' : '#eff6ff',
                                    color: selectedParticipant.gender === 'F' ? '#ec4899' : '#3b82f6'
                                }}>
                                    {selectedParticipant.gender === 'M' ? '👨 Homme' : selectedParticipant.gender === 'F' ? '👩 Femme' : 'Non renseigné'}
                                </span>
                            </div>

                            {/* Infos Grid */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '1rem',
                                marginBottom: '1.5rem'
                            }}>
                                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px' }}>
                                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>📞 Téléphone</p>
                                    <p style={{ fontWeight: 600, color: '#1e293b' }}>{selectedParticipant.phone}</p>
                                </div>
                                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px' }}>
                                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>📅 Inscription</p>
                                    <p style={{ fontWeight: 600, color: '#1e293b' }}>
                                        {format(new Date(selectedParticipant.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                                    </p>
                                </div>
                                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px' }}>
                                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>📍 Localité</p>
                                    <p style={{ fontWeight: 600, color: '#1e293b' }}>{locations[selectedParticipant.location] || selectedParticipant.location}</p>
                                </div>
                                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px' }}>
                                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>🏠 Détail</p>
                                    <p style={{ fontWeight: 600, color: '#1e293b' }}>{selectedParticipant.location_detail || '-'}</p>
                                </div>
                            </div>

                            {/* Réponses au sondage */}
                            {(() => {
                                const poll = getPollAnswer(selectedParticipant.id);
                                if (!poll) return (
                                    <div style={{
                                        padding: '1rem',
                                        background: '#fef3c7',
                                        borderRadius: '12px',
                                        textAlign: 'center',
                                        color: '#92400e'
                                    }}>
                                        ⚠️ Ce participant n'a pas encore voté
                                    </div>
                                );

                                return (
                                    <div>
                                        <h4 style={{ 
                                            fontSize: '1rem', 
                                            fontWeight: 600, 
                                            marginBottom: '1rem',
                                            color: '#1e293b',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}>
                                            🗳️ Réponses au Sondage
                                        </h4>
                                        
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '0.75rem'
                                        }}>
                                            <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '12px' }}>
                                                <p style={{ fontSize: '0.75rem', color: '#15803d', marginBottom: '0.25rem' }}>Vote pour</p>
                                                <p style={{ fontWeight: 700, color: '#166534', fontSize: '1.1rem' }}>
                                                    {candidates[poll.candidate] || poll.candidate}
                                                </p>
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '10px' }}>
                                                    <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Tranche d'âge</p>
                                                    <p style={{ fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>{poll.age_range}</p>
                                                </div>
                                                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '10px' }}>
                                                    <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Profession</p>
                                                    <p style={{ fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>{poll.profession}</p>
                                                </div>
                                                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '10px' }}>
                                                    <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Carte électeur</p>
                                                    <p style={{ fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>{poll.voter_status}</p>
                                                </div>
                                                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '10px' }}>
                                                    <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Note satisfaction</p>
                                                    <p style={{ fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>{poll.satisfaction_rating}/5 ⭐</p>
                                                </div>
                                            </div>

                                            {poll.vote_reason && (
                                                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '10px' }}>
                                                    <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Raison du vote</p>
                                                    <p style={{ fontWeight: 500, color: '#374151', fontSize: '0.9rem' }}>{poll.vote_reason}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })()}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ParticipantsPage;
