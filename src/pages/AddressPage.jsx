import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, ChevronLeft, Home, X } from 'lucide-react';

const AddressPage = () => {
    const navigate = useNavigate();
    const [selectedLocation, setSelectedLocation] = useState('');
    const [detail, setDetail] = useState('');

    const locations = [
        { id: 'commune_mbahiakro', label: "Commune M'bahiakro", placeholder: "Nom du quartier" },
        { id: 'kondossou', label: "Kondossou", placeholder: "Nom du village" },
        { id: 'bonguera', label: "Bonguera", placeholder: "Nom du village" },
        { id: 'sp_mbahiakro', label: "Sous Prefecture M'bahiakro", placeholder: "Nom du village" },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedLocation && detail.trim()) {
            localStorage.setItem('userLocation', selectedLocation);
            localStorage.setItem('userLocationDetail', detail.trim());
            navigate('/home');
        }
    };

    const isFormValid = selectedLocation && detail.trim();

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
                paddingTop: '5vh',
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
                        Votre lieu d'habitation
                    </h2>
                    <p style={{
                        fontSize: '1rem',
                        color: 'var(--color-text-muted)',
                        marginBottom: '2rem'
                    }}>
                        Sélectionnez votre localité et précisez.
                    </p>
                </motion.div>

                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '100px' }}>
                        <AnimatePresence mode="popLayout">
                            {locations.map(location => {
                                // If a location is selected and it's not this one, don't render it
                                if (selectedLocation && selectedLocation !== location.id) return null;

                                return (
                                    <motion.button
                                        layout
                                        type="button"
                                        key={location.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                        onClick={() => {
                                            if (selectedLocation === location.id) {
                                                setSelectedLocation('');
                                                setDetail('');
                                            } else {
                                                setSelectedLocation(location.id);
                                            }
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                        style={{
                                            background: 'white',
                                            padding: '1.2rem',
                                            borderRadius: '16px',
                                            border: selectedLocation === location.id ? `2px solid var(--color-orange)` : '1px solid #f0f0f0',
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                                            textAlign: 'left',
                                            fontWeight: 600,
                                            fontSize: '1rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            width: '100%'
                                        }}
                                    >
                                        <span>{location.label}</span>
                                        {selectedLocation === location.id && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                            >
                                                <X size={20} color="var(--color-text-muted)" />
                                            </motion.div>
                                        )}
                                    </motion.button>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    <AnimatePresence>
                        {selectedLocation && (
                            <motion.div
                                initial={{ opacity: 0, y: 20, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: 'auto' }}
                                exit={{ opacity: 0, y: 20, height: 0 }}
                                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                                style={{ position: 'relative', marginTop: '1rem', overflow: 'hidden' }}
                            >
                                <div style={{ paddingTop: '1.5rem' }}> {/* Spacer for visual separation */}
                                    <Home size={20} color="var(--color-orange)" style={{ position: 'absolute', top: 'calc(50% + 0.75rem)', transform: 'translateY(-50%)', left: '0' }} />
                                    <input
                                        type="text"
                                        value={detail}
                                        onChange={(e) => setDetail(e.target.value)}
                                        placeholder={locations.find(loc => loc.id === selectedLocation)?.placeholder}
                                        style={inputStyle}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                        autoFocus
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.button
                        type="submit"
                        disabled={!isFormValid}
                        whileHover={{ scale: isFormValid ? 1.02 : 1 }}
                        whileTap={{ scale: isFormValid ? 0.98 : 1 }}
                        style={{
                            width: '100%',
                            background: isFormValid ? 'var(--color-orange)' : '#ccc',
                            color: 'white',
                            padding: '1.2rem',
                            borderRadius: '16px',
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            cursor: isFormValid ? 'pointer' : 'not-allowed',
                            transition: 'background-color 0.3s',
                            boxShadow: isFormValid ? '0 10px 20px rgba(255, 130, 0, 0.2)' : 'none',
                            marginTop: '3rem'
                        }}
                    >
                        Terminer <ArrowRight size={20} />
                    </motion.button>
                </motion.form>

            </div>
        </div>
    );
};


const inputStyle = {
    width: '100%',
    padding: '1rem 1rem 1rem 2.5rem',
    fontSize: '1.1rem',
    border: 'none',
    borderBottom: '2px solid #ddd',
    background: 'transparent',
    fontFamily: 'Outfit, sans-serif',
    color: 'var(--color-text-main)',
    outline: 'none',
    transition: 'border-color 0.3s'
};

const handleFocus = (e) => e.target.style.borderColor = 'var(--color-orange)';
const handleBlur = (e) => e.target.style.borderColor = '#ddd';


export default AddressPage;
