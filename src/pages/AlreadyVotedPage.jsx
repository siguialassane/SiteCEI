import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Home } from 'lucide-react';

const AlreadyVotedPage = () => {
    const navigate = useNavigate();

    return (
        <div className="page-transition" style={{
            background: 'var(--color-bg-off-white)',
            height: '100dvh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem',
            textAlign: 'center'
        }}>
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
            >
                <CheckCircle size={80} color="var(--color-green)" style={{ marginBottom: '2rem' }} />
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: 700,
                    marginBottom: '1rem',
                    color: 'var(--color-text-main)'
                }}>
                    Vous avez déjà participé !
                </h1>
                <p style={{
                    fontSize: '1.1rem',
                    color: 'var(--color-text-muted)',
                    marginBottom: '3rem',
                    lineHeight: 1.6
                }}>
                    Merci pour votre engagement. Les résultats sont mis à jour en temps réel. Vous pouvez les consulter à tout moment.
                </p>
                <motion.button
                    onClick={() => navigate('/poll-results')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                        background: 'var(--color-orange)',
                        color: 'white',
                        padding: '1.2rem 2rem',
                        borderRadius: '16px',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 10px 20px rgba(255, 130, 0, 0.2)',
                    }}
                >
                    Voir les résultats
                </motion.button>
                <motion.button
                    onClick={() => navigate('/home')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                        background: 'transparent',
                        color: 'var(--color-text-muted)',
                        marginTop: '1.5rem',
                        fontWeight: 600
                    }}
                >
                    <Home size={20} style={{ marginRight: '0.5rem' }} />
                    Retour à l'accueil
                </motion.button>
            </motion.div>
        </div>
    );
};

export default AlreadyVotedPage;
