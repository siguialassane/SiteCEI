import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, Shield } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const AdminLoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Vérifier si déjà connecté
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                navigate('/admin/dashboard');
            }
        };
        checkSession();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password: password,
            });

            if (authError) {
                if (authError.message.includes('Invalid login credentials')) {
                    setError('Email ou mot de passe incorrect');
                } else {
                    setError('Erreur de connexion. Veuillez réessayer.');
                }
                setIsLoading(false);
                return;
            }

            if (data.session) {
                navigate('/admin/dashboard');
            }
        } catch (err) {
            setError('Une erreur est survenue. Veuillez réessayer.');
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                    background: 'white',
                    borderRadius: '24px',
                    padding: '3rem',
                    width: '100%',
                    maxWidth: '420px',
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)'
                }}
            >
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '20px',
                            background: 'linear-gradient(135deg, var(--color-orange) 0%, #ff6b35 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem',
                            boxShadow: '0 10px 30px rgba(255, 130, 0, 0.3)'
                        }}
                    >
                        <Shield size={40} color="white" />
                    </motion.div>
                    <h1 style={{
                        fontSize: '1.8rem',
                        fontWeight: 800,
                        color: '#1a1a2e',
                        marginBottom: '0.5rem'
                    }}>
                        Administration CEI
                    </h1>
                    <p style={{
                        color: '#666',
                        fontSize: '0.95rem'
                    }}>
                        Connectez-vous pour accéder au tableau de bord
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            background: '#fee2e2',
                            border: '1px solid #fecaca',
                            color: '#dc2626',
                            padding: '1rem',
                            borderRadius: '12px',
                            marginBottom: '1.5rem',
                            fontSize: '0.9rem',
                            textAlign: 'center'
                        }}
                    >
                        {error}
                    </motion.div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {/* Email */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: '0.5rem'
                        }}>
                            Adresse email
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Mail
                                size={20}
                                color="#9ca3af"
                                style={{
                                    position: 'absolute',
                                    left: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)'
                                }}
                            />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@exemple.com"
                                required
                                style={{
                                    width: '100%',
                                    padding: '1rem 1rem 1rem 3rem',
                                    fontSize: '1rem',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '12px',
                                    outline: 'none',
                                    transition: 'border-color 0.3s',
                                    fontFamily: 'Outfit, sans-serif'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--color-orange)'}
                                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: '0.5rem'
                        }}>
                            Mot de passe
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Lock
                                size={20}
                                color="#9ca3af"
                                style={{
                                    position: 'absolute',
                                    left: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)'
                                }}
                            />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                style={{
                                    width: '100%',
                                    padding: '1rem 3rem 1rem 3rem',
                                    fontSize: '1rem',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '12px',
                                    outline: 'none',
                                    transition: 'border-color 0.3s',
                                    fontFamily: 'Outfit, sans-serif'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--color-orange)'}
                                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '0.25rem'
                                }}
                            >
                                {showPassword ? (
                                    <EyeOff size={20} color="#9ca3af" />
                                ) : (
                                    <Eye size={20} color="#9ca3af" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: isLoading ? 1 : 1.02 }}
                        whileTap={{ scale: isLoading ? 1 : 0.98 }}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            color: 'white',
                            background: isLoading
                                ? '#ccc'
                                : 'linear-gradient(135deg, var(--color-orange) 0%, #ff6b35 100%)',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            boxShadow: isLoading ? 'none' : '0 10px 30px rgba(255, 130, 0, 0.3)',
                            transition: 'all 0.3s',
                            fontFamily: 'Outfit, sans-serif'
                        }}
                    >
                        {isLoading ? 'Connexion en cours...' : 'Se connecter'}
                    </motion.button>
                </form>

                {/* Footer */}
                <div style={{
                    marginTop: '2rem',
                    textAlign: 'center',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid #e5e7eb'
                }}>
                    <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                        🔒 Accès réservé aux administrateurs
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLoginPage;
