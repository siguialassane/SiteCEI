import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, BarChart2, Bell, Menu, ArrowRight, User } from 'lucide-react';

const HomePage = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        if (storedName) {
            setUserName(storedName);
        }
    }, []);

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
        <div className="page-transition" style={{ background: '#F8F9FA' }}>

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
                        backgroundImage: 'url(https://api.dicebear.com/7.x/avataaars/svg?seed=' + userName + ')',
                        backgroundSize: 'cover'
                    }}></div>
                    <div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Bonjour 👋</p>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{userName || 'Citoyen'}</h3>
                    </div>
                </div>
                <button style={{ background: 'white', padding: '0.8rem', borderRadius: '50%', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                    <Menu size={20} color="var(--color-text-main)" />
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
                        <p style={{ opacity: 0.9, marginBottom: '1rem', maxWidth: '70%' }}>
                            Préparez-vous pour le 27 Décembre. Chaque voix compte !
                        </p>
                        <button style={{
                            background: 'white',
                            color: 'var(--color-orange)',
                            padding: '0.6rem 1.2rem',
                            borderRadius: '12px',
                            fontWeight: 600,
                            fontSize: '0.9rem'
                        }}>
                            En savoir plus
                        </button>
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

                    {/* Menu 1: Comment Voter */}
                    <motion.div
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/guide')}
                        style={{
                            background: 'white',
                            padding: '1.5rem',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.5rem',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                            cursor: 'pointer',
                            borderLeft: '5px solid var(--color-green)'
                        }}
                    >
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '16px',
                            background: 'rgba(0, 154, 68, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--color-green)'
                        }}>
                            <BookOpen size={28} />
                        </div>
                        <div>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.2rem' }}>Comment voter</h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Guide étape par étape</p>
                        </div>
                        <div style={{ marginLeft: 'auto', color: '#ddd' }}>
                            <ArrowRight size={24} />
                        </div>
                    </motion.div>

                    {/* Menu 2: Participer au sondage */}
                    <motion.div
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/poll')}
                        style={{
                            background: 'white',
                            padding: '1.5rem',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.5rem',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                            cursor: 'pointer',
                            borderLeft: '5px solid var(--color-orange)'
                        }}
                    >
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '16px',
                            background: 'rgba(255, 130, 0, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--color-orange)'
                        }}>
                            <BarChart2 size={28} />
                        </div>
                        <div>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.2rem' }}>Participer au sondage</h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Donnez votre avis</p>
                        </div>
                        <div style={{ marginLeft: 'auto', color: '#ddd' }}>
                            <ArrowRight size={24} />
                        </div>
                    </motion.div>

                </div>

            </motion.div>

            {/* Bottom Navigation */}
            <div style={{
                background: 'white',
                padding: '1rem 2rem',
                display: 'flex',
                justifyContent: 'space-around',
                borderTop: '1px solid #f0f0f0'
            }}>
                <Bell size={24} color="#ccc" />
                <div style={{
                    width: '50px',
                    height: '50px',
                    background: 'var(--color-orange)',
                    borderRadius: '50%',
                    marginTop: '-35px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 20px rgba(255, 130, 0, 0.3)'
                }}>
                    <div style={{ width: '20px', height: '20px', background: 'white', borderRadius: '4px' }}></div>
                </div>
                <User size={24} color="#ccc" />
            </div>

        </div>
    );
};

export default HomePage;
