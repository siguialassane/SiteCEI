import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Briefcase, Calendar, Vote } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const DemographicsPage = () => {
    const [ageData, setAgeData] = useState([]);
    const [professionData, setProfessionData] = useState([]);
    const [genderData, setGenderData] = useState({ M: 0, F: 0 });
    const [voterStatusData, setVoterStatusData] = useState([]);
    const [crossAnalysis, setCrossAnalysis] = useState({});
    const [totalParticipants, setTotalParticipants] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const parties = {
        'rhdp': { name: 'Bakary Ouattara (RHDP)', color: '#FF8200' },
        'pdci': { name: 'Tialy (PDCI)', color: '#009A44' },
        'indep_simon': { name: 'K. Kouakou Simon', color: '#3498db' },
        'indep_faustin': { name: 'Atchelo Faustin', color: '#9b59b6' },
        'indep_parfait': { name: 'T. Hamed Parfait', color: '#e74c3c' }
    };

    const professionColors = {
        'Commerçant(e) ou Entrepreneur': '#3b82f6',
        'Étudiant': '#10b981',
        'Secteur Privé': '#f59e0b',
        'Retraité': '#8b5cf6',
        'Sans emploi': '#ef4444',
        'Fonctionnaire': '#06b6d4',
        'Agriculteur': '#84cc16',
        'Artisan': '#ec4899'
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);

        const { data: participants } = await supabase
            .from('participants')
            .select('id, gender');

        const { data: pollData } = await supabase
            .from('poll_answers')
            .select('*');

        setTotalParticipants(participants?.length || 0);

        // Age distribution
        const ageCounts = {};
        pollData?.forEach(p => {
            ageCounts[p.age_range] = (ageCounts[p.age_range] || 0) + 1;
        });
        const ageChartData = Object.entries(ageCounts)
            .map(([name, value]) => ({
                name, 
                value,
                percent: pollData?.length > 0 ? Math.round((value / pollData.length) * 100) : 0
            }))
            .sort((a, b) => b.value - a.value);
        setAgeData(ageChartData);

        // Profession distribution
        const profCounts = {};
        pollData?.forEach(p => {
            profCounts[p.profession] = (profCounts[p.profession] || 0) + 1;
        });
        const profChartData = Object.entries(profCounts)
            .map(([name, value]) => ({
                name,
                value,
                percent: pollData?.length > 0 ? Math.round((value / pollData.length) * 100) : 0
            }))
            .sort((a, b) => b.value - a.value);
        setProfessionData(profChartData);

        // Gender distribution
        const genderCounts = { M: 0, F: 0 };
        participants?.forEach(p => {
            if (p.gender) genderCounts[p.gender]++;
        });
        setGenderData(genderCounts);

        // Voter status
        const voterCounts = {};
        pollData?.forEach(p => {
            voterCounts[p.voter_status] = (voterCounts[p.voter_status] || 0) + 1;
        });
        const voterChartData = Object.entries(voterCounts).map(([name, value]) => ({
            name,
            value,
            percent: pollData?.length > 0 ? Math.round((value / pollData.length) * 100) : 0
        }));
        setVoterStatusData(voterChartData);

        // Cross analysis: Gender vs Vote
        const genderVsVote = { M: {}, F: {} };
        pollData?.forEach(poll => {
            const participant = participants?.find(p => p.id === poll.participant_id);
            if (participant?.gender) {
                genderVsVote[participant.gender][poll.candidate] =
                    (genderVsVote[participant.gender][poll.candidate] || 0) + 1;
            }
        });

        setCrossAnalysis({ genderVsVote });
        setIsLoading(false);
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

    const totalGender = genderData.M + genderData.F;
    const menPercent = totalGender > 0 ? Math.round((genderData.M / totalGender) * 100) : 0;
    const womenPercent = totalGender > 0 ? Math.round((genderData.F / totalGender) * 100) : 0;

    return (
        <div>
            {/* Header */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
                gap: '1rem'
            }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>
                        Analyses Démographiques
                    </h2>
                    <p style={{ color: '#64748b' }}>
                        {totalParticipants} participant{totalParticipants > 1 ? 's' : ''} analysé{totalParticipants > 1 ? 's' : ''}
                    </p>
                </div>
                <button
                    onClick={fetchData}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.25rem',
                        background: 'var(--color-orange)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontWeight: 500
                    }}
                >
                    <RefreshCw size={18} />
                    Actualiser
                </button>
            </div>

            {/* Gender Stats - Big Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem'
            }}>
                {/* Hommes */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        color: 'white'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div style={{
                            width: '45px', height: '45px',
                            background: 'rgba(255,255,255,0.2)',
                            borderRadius: '12px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.5rem'
                        }}>
                            👨
                        </div>
                        <span style={{ fontSize: '1rem', fontWeight: 500 }}>Hommes</span>
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                        {genderData.M}
                    </div>
                    <div style={{ fontSize: '1rem', opacity: 0.9 }}>
                        {menPercent}% du total
                    </div>
                </motion.div>

                {/* Femmes */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    style={{
                        background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        color: 'white'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div style={{
                            width: '45px', height: '45px',
                            background: 'rgba(255,255,255,0.2)',
                            borderRadius: '12px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.5rem'
                        }}>
                            👩
                        </div>
                        <span style={{ fontSize: '1rem', fontWeight: 500 }}>Femmes</span>
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                        {genderData.F}
                    </div>
                    <div style={{ fontSize: '1rem', opacity: 0.9 }}>
                        {womenPercent}% du total
                    </div>
                </motion.div>

                {/* Électeurs inscrits */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        color: 'white'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div style={{
                            width: '45px', height: '45px',
                            background: 'rgba(255,255,255,0.2)',
                            borderRadius: '12px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.5rem'
                        }}>
                            🗳️
                        </div>
                        <span style={{ fontSize: '1rem', fontWeight: 500 }}>Carte Électeur</span>
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                        {voterStatusData.find(v => v.name === 'Oui')?.value || 0}
                    </div>
                    <div style={{ fontSize: '1rem', opacity: 0.9 }}>
                        {voterStatusData.find(v => v.name === 'Oui')?.percent || 0}% inscrits
                    </div>
                </motion.div>
            </div>

            {/* Age Distribution - Cards avec chiffres */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                    marginBottom: '1.5rem'
                }}
            >
                <h3 style={{ 
                    fontSize: '1.1rem', 
                    fontWeight: 600, 
                    marginBottom: '1.5rem', 
                    color: '#1e293b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <Calendar size={20} />
                    Tranches d'Âge
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {ageData.map((item, index) => (
                        <div key={item.name} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '0.75rem 1rem',
                            background: '#f8fafc',
                            borderRadius: '12px'
                        }}>
                            <div style={{
                                minWidth: '120px',
                                fontWeight: 500,
                                color: '#374151'
                            }}>
                                {item.name}
                            </div>
                            <div style={{
                                flex: 1,
                                height: '24px',
                                background: '#e2e8f0',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                position: 'relative'
                            }}>
                                <div style={{
                                    width: `${item.percent}%`,
                                    height: '100%',
                                    background: `hsl(${210 + index * 30}, 70%, 50%)`,
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end',
                                    paddingRight: '0.5rem',
                                    minWidth: item.value > 0 ? '45px' : '0'
                                }}>
                                    {item.value > 0 && (
                                        <span style={{ color: 'white', fontWeight: 600, fontSize: '0.85rem' }}>
                                            {item.value}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div style={{
                                minWidth: '50px',
                                textAlign: 'right',
                                fontWeight: 700,
                                color: '#1e293b'
                            }}>
                                {item.percent}%
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Professions - Cards avec chiffres */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                    marginBottom: '1.5rem'
                }}
            >
                <h3 style={{ 
                    fontSize: '1.1rem', 
                    fontWeight: 600, 
                    marginBottom: '1.5rem', 
                    color: '#1e293b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <Briefcase size={20} />
                    Professions
                </h3>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '0.75rem' 
                }}>
                    {professionData.map((item) => (
                        <div key={item.name} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '1rem',
                            background: '#f8fafc',
                            borderRadius: '12px',
                            borderLeft: `4px solid ${professionColors[item.name] || '#6b7280'}`
                        }}>
                            <span style={{ fontWeight: 500, color: '#374151' }}>{item.name}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <span style={{
                                    background: professionColors[item.name] || '#6b7280',
                                    color: 'white',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '20px',
                                    fontWeight: 700,
                                    fontSize: '0.9rem'
                                }}>
                                    {item.value}
                                </span>
                                <span style={{ color: '#64748b', fontWeight: 500 }}>
                                    ({item.percent}%)
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Cross Analysis - Votes par Sexe */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                }}
            >
                <h3 style={{ 
                    fontSize: '1.1rem', 
                    fontWeight: 600, 
                    marginBottom: '1.5rem', 
                    color: '#1e293b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <Vote size={20} />
                    Votes par Sexe
                </h3>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                    gap: '1.5rem' 
                }}>
                    {/* Hommes */}
                    <div style={{ 
                        padding: '1.25rem', 
                        background: '#eff6ff', 
                        borderRadius: '16px',
                        border: '2px solid #3b82f6'
                    }}>
                        <h4 style={{ 
                            fontSize: '1.1rem', 
                            fontWeight: 700, 
                            color: '#3b82f6', 
                            marginBottom: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            👨 Votes des Hommes
                            <span style={{
                                background: '#3b82f6',
                                color: 'white',
                                padding: '0.15rem 0.5rem',
                                borderRadius: '10px',
                                fontSize: '0.8rem',
                                marginLeft: 'auto'
                            }}>
                                {Object.values(crossAnalysis.genderVsVote?.M || {}).reduce((a, b) => a + b, 0)} votes
                            </span>
                        </h4>
                        {Object.entries(crossAnalysis.genderVsVote?.M || {})
                            .sort((a, b) => b[1] - a[1])
                            .map(([candidate, count]) => {
                                const total = Object.values(crossAnalysis.genderVsVote?.M || {}).reduce((a, b) => a + b, 0);
                                const percent = total > 0 ? Math.round((count / total) * 100) : 0;
                                return (
                                    <div key={candidate} style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        padding: '0.5rem 0',
                                        borderBottom: '1px solid #dbeafe'
                                    }}>
                                        <span style={{ color: '#374151', fontWeight: 500 }}>
                                            {parties[candidate]?.name || candidate}
                                        </span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{
                                                background: parties[candidate]?.color,
                                                color: 'white',
                                                padding: '0.2rem 0.6rem',
                                                borderRadius: '8px',
                                                fontWeight: 700,
                                                fontSize: '0.9rem'
                                            }}>
                                                {count}
                                            </span>
                                            <span style={{ 
                                                color: parties[candidate]?.color, 
                                                fontWeight: 600,
                                                minWidth: '40px',
                                                textAlign: 'right'
                                            }}>
                                                {percent}%
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        {Object.keys(crossAnalysis.genderVsVote?.M || {}).length === 0 && (
                            <p style={{ color: '#94a3b8', textAlign: 'center', padding: '1rem' }}>Aucun vote</p>
                        )}
                    </div>

                    {/* Femmes */}
                    <div style={{ 
                        padding: '1.25rem', 
                        background: '#fdf2f8', 
                        borderRadius: '16px',
                        border: '2px solid #ec4899'
                    }}>
                        <h4 style={{ 
                            fontSize: '1.1rem', 
                            fontWeight: 700, 
                            color: '#ec4899', 
                            marginBottom: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            👩 Votes des Femmes
                            <span style={{
                                background: '#ec4899',
                                color: 'white',
                                padding: '0.15rem 0.5rem',
                                borderRadius: '10px',
                                fontSize: '0.8rem',
                                marginLeft: 'auto'
                            }}>
                                {Object.values(crossAnalysis.genderVsVote?.F || {}).reduce((a, b) => a + b, 0)} votes
                            </span>
                        </h4>
                        {Object.entries(crossAnalysis.genderVsVote?.F || {})
                            .sort((a, b) => b[1] - a[1])
                            .map(([candidate, count]) => {
                                const total = Object.values(crossAnalysis.genderVsVote?.F || {}).reduce((a, b) => a + b, 0);
                                const percent = total > 0 ? Math.round((count / total) * 100) : 0;
                                return (
                                    <div key={candidate} style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        padding: '0.5rem 0',
                                        borderBottom: '1px solid #fce7f3'
                                    }}>
                                        <span style={{ color: '#374151', fontWeight: 500 }}>
                                            {parties[candidate]?.name || candidate}
                                        </span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{
                                                background: parties[candidate]?.color,
                                                color: 'white',
                                                padding: '0.2rem 0.6rem',
                                                borderRadius: '8px',
                                                fontWeight: 700,
                                                fontSize: '0.9rem'
                                            }}>
                                                {count}
                                            </span>
                                            <span style={{ 
                                                color: parties[candidate]?.color, 
                                                fontWeight: 600,
                                                minWidth: '40px',
                                                textAlign: 'right'
                                            }}>
                                                {percent}%
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        {Object.keys(crossAnalysis.genderVsVote?.F || {}).length === 0 && (
                            <p style={{ color: '#94a3b8', textAlign: 'center', padding: '1rem' }}>Aucun vote</p>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default DemographicsPage;
