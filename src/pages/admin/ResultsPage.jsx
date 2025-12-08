import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const ResultsPage = () => {
    const [candidateResults, setCandidateResults] = useState([]);
    const [priorityResults, setPriorityResults] = useState([]);
    const [reasonResults, setReasonResults] = useState([]);
    const [ratingResults, setRatingResults] = useState([]);
    const [sourceResults, setSourceResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalVotes, setTotalVotes] = useState(0);

    const parties = [
        { id: 'rhdp', name: 'Bakary Ouattara (RHDP)', color: '#FF8200' },
        { id: 'pdci', name: 'Tialy (PDCI)', color: '#009A44' },
        { id: 'indep_simon', name: 'K. Kouakou Simon', color: '#3498db' },
        { id: 'indep_faustin', name: 'Atchelo Faustin', color: '#9b59b6' },
        { id: 'indep_parfait', name: 'T. Hamed Parfait', color: '#e74c3c' }
    ];

    const priorities = [
        { id: 'job', label: 'Emploi Jeunes', color: '#3b82f6' },
        { id: 'health', label: 'Santé', color: '#10b981' },
        { id: 'edu', label: 'Éducation', color: '#f59e0b' },
        { id: 'infra', label: 'Routes', color: '#8b5cf6' },
        { id: 'security', label: 'Sécurité', color: '#ef4444' },
    ];

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        setIsLoading(true);

        // Fetch all poll answers
        const { data: pollData, error } = await supabase
            .from('poll_answers')
            .select('*');

        if (error) {
            console.error('Error fetching results:', error);
            setIsLoading(false);
            return;
        }

        setTotalVotes(pollData?.length || 0);

        // Process candidate votes
        const candidateCounts = {};
        pollData?.forEach(({ candidate }) => {
            candidateCounts[candidate] = (candidateCounts[candidate] || 0) + 1;
        });

        const candidateData = parties.map(party => ({
            name: party.name,
            votes: candidateCounts[party.id] || 0,
            percent: pollData?.length > 0
                ? Math.round(((candidateCounts[party.id] || 0) / pollData.length) * 100)
                : 0,
            color: party.color
        })).sort((a, b) => b.votes - a.votes);
        setCandidateResults(candidateData);

        // Process priorities
        const allPriorities = pollData?.flatMap(item => item.priorities) || [];
        const priorityCounts = {};
        allPriorities.forEach(p => {
            priorityCounts[p] = (priorityCounts[p] || 0) + 1;
        });

        const priorityData = priorities.map(p => ({
            name: p.label,
            value: priorityCounts[p.id] || 0,
            percent: allPriorities.length > 0
                ? Math.round(((priorityCounts[p.id] || 0) / allPriorities.length) * 100)
                : 0,
            color: p.color,
            fullMark: 100
        }));
        setPriorityResults(priorityData);

        // Process choice reasons
        const reasonCounts = {};
        pollData?.forEach(({ choice_reason }) => {
            reasonCounts[choice_reason] = (reasonCounts[choice_reason] || 0) + 1;
        });

        const reasonData = Object.entries(reasonCounts).map(([name, value]) => ({
            name: name.length > 25 ? name.substring(0, 25) + '...' : name,
            fullName: name,
            value,
            percent: pollData?.length > 0 ? Math.round((value / pollData.length) * 100) : 0
        })).sort((a, b) => b.value - a.value);
        setReasonResults(reasonData);

        // Process incumbent ratings
        const ratingCounts = {};
        pollData?.forEach(({ incumbent_rating }) => {
            ratingCounts[incumbent_rating] = (ratingCounts[incumbent_rating] || 0) + 1;
        });

        const ratingColors = {
            'Très satisfaisant': '#10b981',
            'Moyen': '#f59e0b',
            'Décevant': '#ef4444',
            'Je ne le connais pas': '#6b7280'
        };

        const ratingData = Object.entries(ratingCounts).map(([name, value]) => ({
            name,
            value,
            percent: pollData?.length > 0 ? Math.round((value / pollData.length) * 100) : 0,
            color: ratingColors[name] || '#6b7280'
        }));
        setRatingResults(ratingData);

        // Process info sources
        const sourceCounts = {};
        pollData?.forEach(({ info_source }) => {
            sourceCounts[info_source] = (sourceCounts[info_source] || 0) + 1;
        });

        const sourceData = Object.entries(sourceCounts).map(([name, value]) => ({
            name: name.length > 20 ? name.substring(0, 20) + '...' : name,
            fullName: name,
            value,
            percent: pollData?.length > 0 ? Math.round((value / pollData.length) * 100) : 0
        })).sort((a, b) => b.value - a.value);
        setSourceResults(sourceData);

        setIsLoading(false);
    };

    const ChartCard = ({ title, children }) => (
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
            <h3 style={{
                fontSize: '1.1rem',
                fontWeight: 600,
                marginBottom: '1rem',
                color: '#1e293b'
            }}>
                {title}
            </h3>
            {children}
        </motion.div>
    );

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
                        Résultats du Sondage
                    </h2>
                    <p style={{ color: '#64748b' }}>
                        {totalVotes} vote{totalVotes > 1 ? 's' : ''} enregistré{totalVotes > 1 ? 's' : ''}
                    </p>
                </div>
                <button
                    onClick={fetchResults}
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

            {/* Main Candidate Results */}
            <ChartCard title="🗳️ Intentions de Vote par Candidat">
                <div style={{ marginBottom: '1rem' }}>
                    {candidateResults.map((candidate, index) => (
                        <div key={index} style={{ marginBottom: '1rem' }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '0.5rem'
                            }}>
                                <span style={{ fontWeight: 500, color: '#374151' }}>
                                    {index === 0 && '🥇 '}
                                    {index === 1 && '🥈 '}
                                    {index === 2 && '🥉 '}
                                    {candidate.name}
                                </span>
                                <span style={{ fontWeight: 600, color: candidate.color }}>
                                    {candidate.percent}% ({candidate.votes} votes)
                                </span>
                            </div>
                            <div style={{
                                height: '12px',
                                background: '#f1f5f9',
                                borderRadius: '6px',
                                overflow: 'hidden'
                            }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${candidate.percent}%` }}
                                    transition={{ duration: 1, delay: index * 0.1 }}
                                    style={{
                                        height: '100%',
                                        background: candidate.color,
                                        borderRadius: '6px'
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </ChartCard>

            {/* Two Column Charts */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '1.5rem',
                marginTop: '1.5rem'
            }}>
                {/* Priorities Radar */}
                <ChartCard title="📌 Priorités des Électeurs">
                    <ResponsiveContainer width="100%" height={300}>
                        <RadarChart data={priorityResults}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} />
                            <Radar
                                name="Priorités"
                                dataKey="percent"
                                stroke="var(--color-orange)"
                                fill="var(--color-orange)"
                                fillOpacity={0.5}
                            />
                            <Tooltip formatter={(value) => `${value}%`} />
                        </RadarChart>
                    </ResponsiveContainer>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                        {priorityResults.map((p, i) => (
                            <span key={i} style={{
                                padding: '0.25rem 0.75rem',
                                background: `${p.color}15`,
                                color: p.color,
                                borderRadius: '20px',
                                fontSize: '0.85rem',
                                fontWeight: 500
                            }}>
                                {p.name}: {p.percent}%
                            </span>
                        ))}
                    </div>
                </ChartCard>

                {/* Incumbent Rating Pie */}
                <ChartCard title="⭐ Évaluation du Député Sortant">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={ratingResults}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={3}
                                dataKey="value"
                                label={({ name, percent }) => `${percent}%`}
                            >
                                {ratingResults.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value, name) => [value, name]} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Choice Reasons */}
                <ChartCard title="💭 Raisons du Choix">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={reasonResults} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 11 }} />
                            <Tooltip
                                formatter={(value, name, props) => [
                                    `${value} (${props.payload.percent}%)`,
                                    props.payload.fullName
                                ]}
                            />
                            <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Info Sources */}
                <ChartCard title="📱 Sources d'Information">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={sourceResults} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={130} tick={{ fontSize: 11 }} />
                            <Tooltip
                                formatter={(value, name, props) => [
                                    `${value} (${props.payload.percent}%)`,
                                    props.payload.fullName
                                ]}
                            />
                            <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
        </div>
    );
};

export default ResultsPage;
