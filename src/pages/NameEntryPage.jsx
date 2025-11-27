import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, ArrowRight, ChevronLeft } from 'lucide-react';

const NameEntryPage = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            localStorage.setItem('userName', name.trim());
            navigate('/home');
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
                        Faisons connaissance
                    </h2>
                    <p style={{
                        fontSize: '1rem',
                        color: 'var(--color-text-muted)',
                        marginBottom: '3rem'
                    }}>
                        Comment devons-nous vous appeler ?
                    </p>
                </motion.div>

                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <div style={{ position: 'relative', marginBottom: '2rem' }}>
                        <User
                            size={24}
                            color="var(--color-orange)"
                            style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '0' }}
                        />
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Votre nom complet"
                            style={{
                                width: '100%',
                                padding: '1rem 1rem 1rem 2.5rem',
                                fontSize: '1.2rem',
                                border: 'none',
                                borderBottom: '2px solid #ddd',
                                background: 'transparent',
                                fontFamily: 'Outfit, sans-serif',
                                color: 'var(--color-text-main)',
                                outline: 'none',
                                transition: 'border-color 0.3s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--color-orange)'}
                            onBlur={(e) => e.target.style.borderColor = '#ddd'}
                        />
                    </div>

                    <motion.button
                        type="submit"
                        disabled={!name.trim()}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                            width: '100%',
                            background: name.trim() ? 'var(--color-orange)' : '#ccc',
                            color: 'white',
                            padding: '1.2rem',
                            borderRadius: '16px',
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            cursor: name.trim() ? 'pointer' : 'not-allowed',
                            transition: 'background-color 0.3s',
                            boxShadow: name.trim() ? '0 10px 20px rgba(255, 130, 0, 0.2)' : 'none'
                        }}
                    >
                        Continuer <ArrowRight size={20} />
                    </motion.button>
                </motion.form>

            </div>
        </div>
    );
};

export default NameEntryPage;
