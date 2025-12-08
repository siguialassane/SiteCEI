import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

const DemographicsPage = () => {
    const [ageData, setAgeData] = useState([]);
    const [professionData, setProfessionData] = useState([]);
    const [genderData, setGenderData] = useState([]);
    const [voterStatusData, setVoterStatusData] = useState([]);
    const [crossAnalysis, setCrossAnalysis] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const parties = {
        'rhdp': { name: 'RHDP', color: '#FF8200' },
        'pdci': { name: 'PDCI', color: '#009A44' },
        'indep_simon': { name: 'Simon', color: '#3498db' },
        'indep_faustin': { name: 'Faustin', color: '#9b59b6' },
        'indep_parfait': { name: 'Parfait', color: '#e74c3c' }
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

        // Age distribution
        const ageCounts = {};
        pollData?.forEach(p => {
            ageCounts[p.age_range] = (ageCounts[p.age_range] || 0) + 1;
        });
        const ageChartData = Object.entries(ageCounts).map(([name, value]) => ({
            name, value,
            percent: pollData?.length > 0 ? Math.round((value / pollData.length) * 100) : 0
        }));
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
        const genderChartData = [
            { name: 'Hommes', value: genderCounts.M, color: '#3b82f6' },
            { name: 'Femmes', value: genderCounts.F, color: '#ec4899' }
        ];
        setGenderData(genderChartData);

        // Voter status
        const voterCounts = {};
        pollData?.forEach(p => {
            voterCounts[p.voter_status] = (voterCounts[p.voter_status] || 0) + 1;
        });
        const voterChartData = Object.entries(voterCounts).map(([name, value]) => ({
            name,
            value,
            percent: pollData?.length > 0 ? Math.round((value / pollData.length) * 100) : 0,
            color: name === 'Oui' ? '#10b981' : name === 'Non' ? '#ef4444' : '#f59e0b'
        }));
        setVoterStatusData(voterChartData);

        // Cross analysis: Age vs Vote
        const ageVsVote = {};
        pollData?.forEach(p => {
            if (!ageVsVote[p.age_range]) {
                ageVsVote[p.age_range] = {};
            }
            ageVsVote[p.age_range][p.candidate] = (ageVsVote[p.age_range][p.candidate] || 0) + 1;
        });

        // Cross analysis: Gender vs Vote
        const genderVsVote = { M: {}, F: {} };
        pollData?.forEach(poll => {
            const participant = participants?.find(p => p.id === poll.participant_id);
            if (participant?.gender) {
                genderVsVote[participant.gender][poll.candidate] =
                    (genderVsVote[participant.gender][poll.candidate] || 0) + 1;
            }
        });

        setCrossAnalysis({ ageVsVote, genderVsVote });
        setIsLoading(false);
    };

    const professionColors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

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
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
            }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>
                        Analyses Démographiques
                    </h2>
                    <p style={{ color: '#64748b' }}>
                        Répartition par âge, sexe, profession et comportement électoral
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

            {/* Gender & Voter Status */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                {/* Gender */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                    }}
                >
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: '#1e293b' }}>
                        👥 Répartition par Sexe
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={genderData}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {genderData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1rem' }}>
                        {genderData.map(g => (
                            <div key={g.name} style={{ textAlign: 'center' }}>
                                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: g.color }}>{g.value}</p>
                                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{g.name}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Voter Status */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                    }}
                >
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: '#1e293b' }}>
                        🗳️ Statut Électeur
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={voterStatusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {voterStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* Age & Profession */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                {/* Age Distribution */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                    }}
                >
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: '#1e293b' }}>
                        📊 Tranches d'Âge
                    </h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={ageData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                            <YAxis />
                            <Tooltip formatter={(value, name, props) => [`${value} (${props.payload.percent}%)`, 'Participants']} />
                            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Profession Distribution */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                    }}
                >
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: '#1e293b' }}>
                        💼 Professions
                    </h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={professionData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} />
                            <Tooltip formatter={(value, name, props) => [`${value} (${props.payload.percent}%)`, 'Participants']} />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                {professionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={professionColors[index % professionColors.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* Cross Analysis */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                }}
            >
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem', color: '#1e293b' }}>
                    🔍 Analyse Croisée : Votes par Sexe
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {/* Men votes */}
                    <div style={{ padding: '1rem', background: '#eff6ff', borderRadius: '12px' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#3b82f6', marginBottom: '1rem' }}>
                            👨 Votes des Hommes
                        </h4>
                        {Object.entries(crossAnalysis.genderVsVote?.M || {})
                            .sort((a, b) => b[1] - a[1])
                            .map(([candidate, count]) => {
                                const total = Object.values(crossAnalysis.genderVsVote?.M || {}).reduce((a, b) => a + b, 0);
                                const percent = total > 0 ? Math.round((count / total) * 100) : 0;
                                return (
                                    <div key={candidate} style={{ marginBottom: '0.75rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.85rem' }}>
                                            <span>{parties[candidate]?.name || candidate}</span>
                                            <span style={{ fontWeight: 600, color: parties[candidate]?.color }}>{percent}%</span>
                                        </div>
                                        <div style={{ height: '6px', background: '#dbeafe', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{ width: `${percent}%`, height: '100%', background: parties[candidate]?.color || '#6b7280', borderRadius: '3px' }} />
                                        </div>
                                    </div>
                                );
                            })}
                    </div>

                    {/* Women votes */}
                    <div style={{ padding: '1rem', background: '#fdf2f8', borderRadius: '12px' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#ec4899', marginBottom: '1rem' }}>
                            👩 Votes des Femmes
                        </h4>
                        {Object.entries(crossAnalysis.genderVsVote?.F || {})
                            .sort((a, b) => b[1] - a[1])
                            .map(([candidate, count]) => {
                                const total = Object.values(crossAnalysis.genderVsVote?.F || {}).reduce((a, b) => a + b, 0);
                                const percent = total > 0 ? Math.round((count / total) * 100) : 0;
                                return (
                                    <div key={candidate} style={{ marginBottom: '0.75rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.85rem' }}>
                                            <span>{parties[candidate]?.name || candidate}</span>
                                            <span style={{ fontWeight: 600, color: parties[candidate]?.color }}>{percent}%</span>
                                        </div>
                                        <div style={{ height: '6px', background: '#fce7f3', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{ width: `${percent}%`, height: '100%', background: parties[candidate]?.color || '#6b7280', borderRadius: '3px' }} />
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default DemographicsPage;
