import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Vote, TrendingUp, Clock, MapPin, Calendar } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

const DashboardPage = () => {
    const [stats, setStats] = useState({
        totalParticipants: 0,
        totalVotes: 0,
        lastUpdate: null,
        participationRate: 0
    });
    const [candidateData, setCandidateData] = useState([]);
    const [locationData, setLocationData] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const parties = [
        { id: 'rhdp', name: 'Bakary Ouattara', color: '#FF8200' },
        { id: 'pdci', name: 'Tialy', color: '#009A44' },
        { id: 'indep_simon', name: 'K. Kouakou Simon', color: '#3498db' },
        { id: 'indep_faustin', name: 'Atchelo Faustin', color: '#9b59b6' },
        { id: 'indep_parfait', name: 'T. Hamed Parfait', color: '#e74c3c' }
    ];

    const locations = {
        'commune_mbahiakro': "Commune M'bahiakro",
        'kondossou': 'Kondossou',
        'bonguera': 'Bonguera',
        'sp_mbahiakro': "SP M'bahiakro"
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setIsLoading(true);

        // Fetch participants count
        const { count: participantsCount } = await supabase
            .from('participants')
            .select('*', { count: 'exact', head: true });

        // Fetch poll answers count
        const { count: votesCount } = await supabase
            .from('poll_answers')
            .select('*', { count: 'exact', head: true });

        // Fetch candidate votes
        const { data: voteData } = await supabase
            .from('poll_answers')
            .select('candidate');

        const voteCounts = {};
        voteData?.forEach(({ candidate }) => {
            voteCounts[candidate] = (voteCounts[candidate] || 0) + 1;
        });

        const candidateChartData = parties.map(party => ({
            name: party.name,
            votes: voteCounts[party.id] || 0,
            color: party.color
        }));
        setCandidateData(candidateChartData);

        // Fetch location data
        const { data: locData } = await supabase
            .from('participants')
            .select('location');

        const locCounts = {};
        locData?.forEach(({ location }) => {
            locCounts[location] = (locCounts[location] || 0) + 1;
        });

        const locationChartData = Object.entries(locCounts).map(([key, value]) => ({
            name: locations[key] || key,
            value: value,
            color: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
        }));
        setLocationData(locationChartData);

        // Fetch recent activity
        const { data: recentData } = await supabase
            .from('participants')
            .select('first_name, last_name, location, created_at')
            .order('created_at', { ascending: false })
            .limit(5);

        setRecentActivity(recentData || []);

        // Set stats
        const lastParticipant = recentData?.[0];
        setStats({
            totalParticipants: participantsCount || 0,
            totalVotes: votesCount || 0,
            lastUpdate: lastParticipant?.created_at,
            participationRate: participantsCount > 0 ? Math.round((votesCount / participantsCount) * 100) : 0
        });

        setIsLoading(false);
    };

    const StatCard = ({ icon: Icon, label, value, color, subtext }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
                background: 'white',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem'
            }}
        >
            <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: `${color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Icon size={24} color={color} />
            </div>
            <div>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{label}</p>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b' }}>{value}</h3>
                {subtext && <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.25rem' }}>{subtext}</p>}
            </div>
        </motion.div>
    );

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '50vh'
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    border: '4px solid #f3f4f6',
                    borderTopColor: 'var(--color-orange)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div>
            {/* Stats Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem'
            }}>
                <StatCard
                    icon={Users}
                    label="Total Participants"
                    value={stats.totalParticipants}
                    color="#3b82f6"
                    subtext="Inscrits"
                />
                <StatCard
                    icon={Vote}
                    label="Votes Enregistrés"
                    value={stats.totalVotes}
                    color="#10b981"
                    subtext="Sondages complétés"
                />
                <StatCard
                    icon={TrendingUp}
                    label="Taux de Participation"
                    value={`${stats.participationRate}%`}
                    color="#f59e0b"
                    subtext="Complétion"
                />
                <StatCard
                    icon={Clock}
                    label="Dernière Activité"
                    value={stats.lastUpdate
                        ? format(new Date(stats.lastUpdate), 'HH:mm', { locale: fr })
                        : '-'}
                    color="#8b5cf6"
                    subtext={stats.lastUpdate
                        ? format(new Date(stats.lastUpdate), 'dd MMM yyyy', { locale: fr })
                        : 'Aucune activité'}
                />
            </div>

            {/* Charts Row */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                {/* Candidate Votes Chart */}
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
                    <h3 style={{
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        marginBottom: '1rem',
                        color: '#1e293b'
                    }}>
                        Votes par Candidat
                    </h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={candidateData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{
                                    background: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}
                            />
                            <Bar dataKey="votes" radius={[0, 4, 4, 0]}>
                                {candidateData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Location Pie Chart */}
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
                    <h3 style={{
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        marginBottom: '1rem',
                        color: '#1e293b'
                    }}>
                        Répartition par Localité
                    </h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie
                                data={locationData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {locationData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][index % 4]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* Recent Activity */}
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
                <h3 style={{
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    marginBottom: '1rem',
                    color: '#1e293b'
                }}>
                    Activité Récente
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {recentActivity.map((activity, index) => (
                        <div
                            key={index}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '0.75rem',
                                background: '#f8fafc',
                                borderRadius: '12px'
                            }}
                        >
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--color-orange), #ff6b35)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 600,
                                fontSize: '0.9rem'
                            }}>
                                {activity.first_name?.[0]}{activity.last_name?.[0]}
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: 500, color: '#1e293b' }}>
                                    {activity.first_name} {activity.last_name}
                                </p>
                                <p style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <MapPin size={14} />
                                    {locations[activity.location] || activity.location}
                                </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <Calendar size={14} />
                                    {format(new Date(activity.created_at), 'dd/MM HH:mm', { locale: fr })}
                                </p>
                            </div>
                        </div>
                    ))}
                    {recentActivity.length === 0 && (
                        <p style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
                            Aucune activité récente
                        </p>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default DashboardPage;
