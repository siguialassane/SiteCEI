import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

const GeographyPage = () => {
    const [locationStats, setLocationStats] = useState([]);
    const [locationVotes, setLocationVotes] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const locations = {
        'commune_mbahiakro': "Commune M'bahiakro",
        'kondossou': 'Kondossou',
        'bonguera': 'Bonguera',
        'sp_mbahiakro': "SP M'bahiakro"
    };

    const parties = {
        'rhdp': { name: 'RHDP', color: '#FF8200' },
        'pdci': { name: 'PDCI', color: '#009A44' },
        'indep_simon': { name: 'Simon', color: '#3498db' },
        'indep_faustin': { name: 'Faustin', color: '#9b59b6' },
        'indep_parfait': { name: 'Parfait', color: '#e74c3c' }
    };

    const locationColors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);

        // Fetch participants with location
        const { data: participants } = await supabase
            .from('participants')
            .select('id, location, gender');

        // Fetch poll answers
        const { data: pollData } = await supabase
            .from('poll_answers')
            .select('participant_id, candidate');

        // Count by location
        const locCounts = {};
        const genderByLoc = {};
        participants?.forEach(p => {
            locCounts[p.location] = (locCounts[p.location] || 0) + 1;
            if (!genderByLoc[p.location]) {
                genderByLoc[p.location] = { M: 0, F: 0 };
            }
            if (p.gender) {
                genderByLoc[p.location][p.gender]++;
            }
        });

        const totalParticipants = participants?.length || 0;
        const statsData = Object.entries(locCounts).map(([key, count], index) => ({
            id: key,
            name: locations[key] || key,
            count,
            percent: totalParticipants > 0 ? Math.round((count / totalParticipants) * 100) : 0,
            color: locationColors[index % locationColors.length],
            men: genderByLoc[key]?.M || 0,
            women: genderByLoc[key]?.F || 0
        })).sort((a, b) => b.count - a.count);

        setLocationStats(statsData);

        // Votes by location
        const votesByLoc = {};
        participants?.forEach(p => {
            const poll = pollData?.find(pd => pd.participant_id === p.id);
            if (poll) {
                if (!votesByLoc[p.location]) {
                    votesByLoc[p.location] = {};
                }
                votesByLoc[p.location][poll.candidate] = (votesByLoc[p.location][poll.candidate] || 0) + 1;
            }
        });

        setLocationVotes(votesByLoc);
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
                        Analyse Géographique
                    </h2>
                    <p style={{ color: '#64748b' }}>
                        Répartition des participants et votes par localité
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

            {/* Overview Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem'
            }}>
                {locationStats.map((loc, index) => (
                    <motion.div
                        key={loc.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        style={{
                            background: 'white',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                            borderLeft: `4px solid ${loc.color}`
                        }}
                    >
                        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                            {loc.name}
                        </p>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>
                            {loc.count}
                        </h3>
                        <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem' }}>
                            <span style={{ color: '#3b82f6' }}>👨 {loc.men}</span>
                            <span style={{ color: '#ec4899' }}>👩 {loc.women}</span>
                            <span style={{ color: '#94a3b8' }}>({loc.percent}%)</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                {/* Pie Chart */}
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
                        Répartition des Participants
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={locationStats}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={3}
                                dataKey="count"
                                label={({ name, percent }) => `${percent}%`}
                            >
                                {locationStats.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Bar Chart */}
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
                        Participants par Localité
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={locationStats}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                {locationStats.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* Votes by Location */}
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
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem', color: '#1e293b' }}>
                    🗳️ Votes par Localité
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {Object.entries(locationVotes).map(([locKey, votes]) => {
                        const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
                        return (
                            <div
                                key={locKey}
                                style={{
                                    padding: '1rem',
                                    background: '#f8fafc',
                                    borderRadius: '12px'
                                }}
                            >
                                <h4 style={{
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    marginBottom: '1rem',
                                    color: '#374151'
                                }}>
                                    📍 {locations[locKey] || locKey}
                                </h4>
                                {Object.entries(votes)
                                    .sort((a, b) => b[1] - a[1])
                                    .map(([candidate, count]) => {
                                        const percent = Math.round((count / totalVotes) * 100);
                                        return (
                                            <div key={candidate} style={{ marginBottom: '0.75rem' }}>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    marginBottom: '0.25rem',
                                                    fontSize: '0.85rem'
                                                }}>
                                                    <span style={{ color: '#374151' }}>
                                                        {parties[candidate]?.name || candidate}
                                                    </span>
                                                    <span style={{ color: parties[candidate]?.color, fontWeight: 600 }}>
                                                        {percent}%
                                                    </span>
                                                </div>
                                                <div style={{
                                                    height: '8px',
                                                    background: '#e2e8f0',
                                                    borderRadius: '4px',
                                                    overflow: 'hidden'
                                                }}>
                                                    <div style={{
                                                        width: `${percent}%`,
                                                        height: '100%',
                                                        background: parties[candidate]?.color || '#6b7280',
                                                        borderRadius: '4px'
                                                    }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
};

export default GeographyPage;
