import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft } from 'lucide-react';

const GenderSelectionPage = () => {
    const navigate = useNavigate();
    const [selectedGender, setSelectedGender] = useState('');

    const handleSubmit = () => {
        if (selectedGender) {
            localStorage.setItem('userGender', selectedGender);
            navigate('/address');
        }
    };

    return (
        <div className="page-transition" style={{ 
            background: 'var(--color-bg-off-white)', 
            height: '100dvh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Header */}
            <div style={{ padding: '1.5rem 1.5rem 1rem', flexShrink: 0 }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{ background: 'transparent', padding: '0.5rem', marginLeft: '-0.5rem' }}
                >
                    <ChevronLeft size={28} color="var(--color-text-main)" />
                </button>
            </div>

            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                padding: '0 2rem 2rem',
                justifyContent: 'flex-start',
                paddingTop: '10vh',
                overflowY: 'auto'
            }}>

                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 style={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        marginBottom: '0.5rem',
                        color: 'var(--color-text-main)'
                    }}>
                        Votre sexe
                    </h2>
                    <p style={{
                        fontSize: '1rem',
                        color: 'var(--color-text-muted)',
                        marginBottom: '3rem'
                    }}>
                        Cette information nous aide à personnaliser votre expérience
                    </p>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                    {/* Option Masculin */}
                    <button
                        onClick={() => setSelectedGender('M')}
                        style={{
                            padding: '1.5rem',
                            borderRadius: '16px',
                            background: selectedGender === 'M' ? 'rgba(255, 130, 0, 0.1)' : 'white',
                            border: selectedGender === 'M' ? '2px solid var(--color-orange)' : '2px solid #e0e0e0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            boxShadow: selectedGender === 'M' ? '0 4px 12px rgba(255, 130, 0, 0.2)' : 'none'
                        }}
                    >
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            background: selectedGender === 'M' ? 'var(--color-orange)' : '#f0f0f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem',
                            transition: 'all 0.3s'
                        }}>
                            👨
                        </div>
                        <div style={{ flex: 1, textAlign: 'left' }}>
                            <h3 style={{ 
                                fontSize: '1.3rem', 
                                fontWeight: 700,
                                color: selectedGender === 'M' ? 'var(--color-orange)' : 'var(--color-text-main)'
                            }}>
                                Masculin
                            </h3>
                        </div>
                        {selectedGender === 'M' && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    background: 'var(--color-orange)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: 'bold'
                                }}
                            >
                                ✓
                            </motion.div>
                        )}
                    </button>

                    {/* Option Féminin */}
                    <button
                        onClick={() => setSelectedGender('F')}
                        style={{
                            padding: '1.5rem',
                            borderRadius: '16px',
                            background: selectedGender === 'F' ? 'rgba(255, 130, 0, 0.1)' : 'white',
                            border: selectedGender === 'F' ? '2px solid var(--color-orange)' : '2px solid #e0e0e0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            boxShadow: selectedGender === 'F' ? '0 4px 12px rgba(255, 130, 0, 0.2)' : 'none'
                        }}
                    >
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            background: selectedGender === 'F' ? 'var(--color-orange)' : '#f0f0f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem',
                            transition: 'all 0.3s'
                        }}>
                            👩
                        </div>
                        <div style={{ flex: 1, textAlign: 'left' }}>
                            <h3 style={{ 
                                fontSize: '1.3rem', 
                                fontWeight: 700,
                                color: selectedGender === 'F' ? 'var(--color-orange)' : 'var(--color-text-main)'
                            }}>
                                Féminin
                            </h3>
                        </div>
                        {selectedGender === 'F' && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    background: 'var(--color-orange)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: 'bold'
                                }}
                            >
                                ✓
                            </motion.div>
                        )}
                    </button>

                    <motion.button
                        onClick={handleSubmit}
                        disabled={!selectedGender}
                        whileHover={{ scale: selectedGender ? 1.02 : 1 }}
                        whileTap={{ scale: selectedGender ? 0.98 : 1 }}
                        style={{
                            width: '100%',
                            background: selectedGender ? 'var(--color-orange)' : '#ccc',
                            color: 'white',
                            padding: '1.2rem',
                            borderRadius: '16px',
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            cursor: selectedGender ? 'pointer' : 'not-allowed',
                            transition: 'background-color 0.3s',
                            boxShadow: selectedGender ? '0 10px 20px rgba(255, 130, 0, 0.2)' : 'none',
                            marginTop: '2rem'
                        }}
                    >
                        Continuer <ArrowRight size={20} />
                    </motion.button>
                </motion.div>

            </div>
        </div>
    );
};

export default GenderSelectionPage;
