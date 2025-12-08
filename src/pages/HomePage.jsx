import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, BarChart2, ArrowRight, LogOut } from 'lucide-react';
import { supabase } from '../supabaseClient';

const HomePage = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [userGender, setUserGender] = useState('');
    const [hasVoted, setHasVoted] = useState(false);

    useEffect(() => {
        const checkUserStatus = async () => {
            const hasVoted = localStorage.getItem('hasVoted');
            if (hasVoted === 'true') {
                setHasVoted(true);
            }

            const userPhone = localStorage.getItem('userPhone');
            if (userPhone) {
                // Récupérer les infos complètes depuis Supabase
                const { data, error } = await supabase
                    .from('participants')
                    .select('first_name, last_name, gender, phone')
                    .eq('phone', userPhone)
                    .single();

                if (error) {
                    console.error('Error fetching user data:', error);
                    // Fallback vers localStorage
                    const storedName = localStorage.getItem('userName');
                    const storedGender = localStorage.getItem('userGender');
                    if (storedName) setUserName(storedName);
                    if (storedGender) setUserGender(storedGender);
                } else if (data) {
                    // Utilisateur existant trouvé
                    const fullName = `${data.first_name} ${data.last_name}`;
                    setUserName(fullName);
                    setUserGender(data.gender || 'M');
                    setHasVoted(true);
                    localStorage.setItem('hasVoted', 'true');
                    localStorage.setItem('userName', fullName);
                    if (data.gender) localStorage.setItem('userGender', data.gender);
                }
            } else {
                // Pas de téléphone, utiliser localStorage
                const storedName = localStorage.getItem('userName');
                const storedGender = localStorage.getItem('userGender');
                if (storedName) setUserName(storedName);
                if (storedGender) setUserGender(storedGender);
            }
        };

        checkUserStatus();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userName');
        localStorage.removeItem('userFirstName');
        localStorage.removeItem('userLastName');
        localStorage.removeItem('userBirthDate');
        localStorage.removeItem('userPhone');
        localStorage.removeItem('userGender');
        localStorage.removeItem('userLocation');
        localStorage.removeItem('userLocationDetail');
        localStorage.removeItem('hasVoted');
        navigate('/');
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="page-transition" style={{ background: '#F8F9FA', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

            {/* Top Bar */}
            <div style={{
                padding: '2rem 1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: '#eee',
                        backgroundImage: userGender === 'F' 
                            ? `url(https://api.dicebear.com/9.x/avataaars/svg?seed=${userName}&style=avataaars&backgroundColor=b6e3f4)` 
                            : `url(https://api.dicebear.com/9.x/avataaars/svg?seed=${userName}&style=avataaars&backgroundColor=c0aede)`,
                        backgroundSize: 'cover'
                    }}></div>
                    <div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Bonjour 👋</p>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{userName || 'Citoyen'}</h3>
                    </div>
                </div>
                <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                    <LogOut size={24} color="var(--color-text-muted)" />
                </button>
            </div>

            {/* Main Content */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ padding: '0 1.5rem', flex: 1, overflowY: 'auto' }}
            >

                {/* Banner */}
                <motion.div
                    variants={itemVariants}
                    style={{
                        background: 'linear-gradient(135deg, var(--color-orange), var(--color-orange-light))',
                        borderRadius: '24px',
                        padding: '1.5rem',
                        color: 'white',
                        marginBottom: '2rem',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 15px 30px rgba(255, 130, 0, 0.25)'
                    }}
                >
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                            Élections 2025
                        </h2>
                        <p style={{ opacity: 0.9, marginBottom: '0.5rem', maxWidth: '80%' }}>
                            Préparez-vous pour le 27 Décembre. Chaque voix compte !
                        </p>
                        {/* 'En savoir plus' button removed */}
                    </div>
                    {/* Decorative Circle */}
                    <div style={{
                        position: 'absolute',
                        right: '-20px',
                        bottom: '-20px',
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.2)'
                    }}></div>
                </motion.div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Menu Principal</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* Menu 1: Comment Voter (Disabled) */}
                    <motion.div
                        variants={itemVariants}
                        style={{
                            background: '#f5f5f5',
                            padding: '1.5rem',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.5rem',
                            boxShadow: 'none',
                            cursor: 'not-allowed',
                            borderLeft: '5px solid #ccc',
                            opacity: 0.7,
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: '#999',
                            color: 'white',
                            fontSize: '0.7rem',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '10px',
                            fontWeight: 600
                        }}>
                            Bientôt disponible
                        </div>

                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '16px',
                            background: '#e0e0e0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#999'
                        }}>
                            <BookOpen size={28} />
                        </div>
                        <div>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.2rem', color: '#777' }}>Comment voter</h4>
                            <p style={{ fontSize: '0.9rem', color: '#999' }}>Guide étape par étape</p>
                        </div>
                    </motion.div>

                    {/* Menu 2: Participer au sondage / Consulter les résultats */}
                    <motion.div
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(hasVoted ? '/poll-results' : '/poll')}
                        style={{
                            background: 'white',
                            padding: '1.5rem',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.5rem',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                            cursor: 'pointer',
                            borderLeft: `5px solid ${hasVoted ? 'var(--color-green)' : 'var(--color-orange)'}`
                        }}
                    >
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '16px',
                            background: `rgba(${hasVoted ? '46, 204, 113, 0.1' : '255, 130, 0, 0.1'})`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: hasVoted ? 'var(--color-green)' : 'var(--color-orange)'
                        }}>
                            <BarChart2 size={28} />
                        </div>
                        <div>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                                {hasVoted ? 'Consulter les résultats' : 'Participer au sondage'}
                            </h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                {hasVoted ? 'Voir les tendances actuelles' : 'Donnez votre avis'}
                            </p>
                        </div>
                        <div style={{ marginLeft: 'auto', color: '#ddd' }}>
                            <ArrowRight size={24} />
                        </div>
                    </motion.div>

                </div>

            </motion.div>

            {/* Bottom Navigation Removed */}

        </div>
    );
};

export default HomePage;
