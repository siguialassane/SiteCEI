import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const FutureExplanationsPage = () => {
    const navigate = useNavigate();

    const steps = [
        "ÉTAPE 6 : Vérification des mains (contrôle anti-fraude)",
        "ÉTAPE 7 : Vérification sur la liste électorale",
        "ÉTAPE 8 : Recevoir le bulletin de vote",
        "ÉTAPE 9 : Aller dans l'isoloir",
        "ÉTAPE 10 : Sortir de l'isoloir et mettre le bulletin dans l'urne",
        "ÉTAPE 11 : Signer la liste d'émargement",
        "ÉTAPE 12 : Marquer le doigt à l'encre indélébile",
        "ÉTAPE 13 : Quitter le bureau de vote"
    ];

    return (
        <div className="page-transition" style={{ background: '#F8F9FA', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            
            {/* Header */}
            <div style={{ padding: '2rem 1.5rem 1rem', background: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <button onClick={() => navigate(-1)} style={{ background: 'transparent', padding: '0.5rem', marginLeft: '-0.5rem' }}>
                        <ArrowLeft size={24} color="var(--color-text-main)" />
                    </button>
                    <h2 style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: '1.2rem', color: 'var(--color-text-main)' }}>
                        Processus du vote
                    </h2>
                    <div style={{ width: '24px' }}></div>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginBottom: '2rem', textAlign: 'center' }}
                >
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>
                        Étapes du processus de vote
                    </h1>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>
                        Voici les étapes complètes du processus de vote
                    </p>
                </motion.div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            style={{
                                background: 'white',
                                padding: '1.5rem',
                                borderRadius: '20px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                borderLeft: '5px solid var(--color-orange)'
                            }}
                        >
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                                {step}
                            </h3>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '1.5rem', background: 'white', borderTop: '1px solid #f0f0f0' }}>
                <button
                    onClick={() => navigate('/home')}
                    style={{
                        width: '100%',
                        background: 'var(--color-text-main)',
                        color: 'white',
                        padding: '1rem',
                        borderRadius: '12px',
                        fontWeight: 600
                    }}
                >
                    Retour à l'accueil
                </button>
            </div>
        </div>
    );
};

export default FutureExplanationsPage;