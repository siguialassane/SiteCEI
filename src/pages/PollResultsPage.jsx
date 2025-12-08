import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import { supabase } from '../supabaseClient';

const PollResultsPage = () => {
    const navigate = useNavigate();
    const [realResults, setRealResults] = useState([]);
    const [realPriorityResults, setRealPriorityResults] = useState([]);

    // Data for Parties
    const parties = [
        { id: 'rhdp', name: 'Bakary Ouattara', img: '/RHDP.png', color: '#FF8200' },
        { id: 'pdci', name: 'Tialy', img: '/PDCI.png', color: '#009A44' },
        { id: 'indep_simon', name: 'Kouadio Kouakou Simon', img: null, color: '#607D8B', type: 'Indépendant' },
        { id: 'indep_faustin', name: 'Atchelo Faustin', img: null, color: '#607D8B', type: 'Indépendant' },
        { id: 'indep_parfait', name: 'Traore Hamed Parfait', img: null, color: '#607D8B', type: 'Indépendant' }
    ];

    // Data for Priorities
    const priorities = [
        { id: 'job', label: 'Emploi Jeunes' },
        { id: 'health', label: 'Santé' },
        { id: 'edu', label: 'Éducation' },
        { id: 'infra', label: 'Routes' },
        { id: 'security', label: 'Sécurité' },
    ];

    const getPollResults = async () => {
        const { data, error } = await supabase
            .from('poll_answers')
            .select('candidate');

        if (error) {
            console.error('Error fetching poll results:', error);
            return;
        }

        const totalVotes = data.length;
        const voteCounts = data.reduce((acc, { candidate }) => {
            acc[candidate] = (acc[candidate] || 0) + 1;
            return acc;
        }, {});

        const pollResults = parties.map(party => {
            const votes = voteCounts[party.id] || 0;
            return {
                name: party.name,
                percent: totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0,
                color: party.color,
            };
        });

        setRealResults(pollResults);
    };

    const getPriorityResults = async () => {
        const { data, error } = await supabase
            .from('poll_answers')
            .select('priorities');

        if (error) {
            console.error('Error fetching priority results:', error);
            return;
        }

        const allPriorities = data.flatMap(item => item.priorities);
        const totalPriorities = allPriorities.length;
        const priorityCounts = allPriorities.reduce((acc, priority) => {
            acc[priority] = (acc[priority] || 0) + 1;
            return acc;
        }, {});

        const priorityResults = priorities.map(p => {
            const votes = priorityCounts[p.id] || 0;
            return {
                name: p.label,
                percent: totalPriorities > 0 ? Math.round((votes / totalPriorities) * 100) : 0,
                color: '#3498DB', // You might want to assign different colors
            };
        });

        setRealPriorityResults(priorityResults);
    };

    useEffect(() => {
        getPollResults();
        getPriorityResults();
    }, []);

    return (
        <div className="page-transition" style={{ background: '#F8F9FA', padding: '1.5rem', minHeight: '100vh' }}>
            <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Tendances actuelles</h2>
                </div>

                {/* Vote Results */}
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
                    <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Intentions de vote</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                        {realResults.map((r, index) => (
                            <div key={index}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
                                    <span>{r.name}</span>
                                    <span>{r.percent}%</span>
                                </div>
                                <div style={{ width: '100%', height: '10px', background: '#f0f0f0', borderRadius: '10px', overflow: 'hidden' }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${r.percent}%` }}
                                        transition={{ duration: 1, delay: 0.2 }}
                                        style={{ height: '100%', background: r.color, borderRadius: '10px' }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Priority Results */}
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Priorités de la localité</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                        {realPriorityResults.map((r, index) => (
                            <div key={index}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
                                    <span>{r.name}</span>
                                    <span>{r.percent}%</span>
                                </div>
                                <div style={{ width: '100%', height: '10px', background: '#f0f0f0', borderRadius: '10px', overflow: 'hidden' }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${r.percent}%` }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                        style={{ height: '100%', background: r.color, borderRadius: '10px' }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>


                <button
                    onClick={() => navigate('/home')}
                    style={{
                        marginTop: '2rem',
                        background: 'transparent',
                        color: 'var(--color-text-muted)',
                        width: '100%',
                        padding: '1rem',
                        fontWeight: 600
                    }}
                >
                    <Home size={20} style={{ marginRight: '0.5rem' }} />
                    Retour à l'accueil
                </button>
            </motion.div>
        </div>
    );
};

export default PollResultsPage;
