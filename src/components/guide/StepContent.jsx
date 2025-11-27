import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

const StepContent = ({ step, onShowMore }) => {
    const videoRef = useRef(null);

    return (
        <motion.div
            key={step.title}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        >

            {/* Title Section */}
            <div style={{ marginBottom: '1.5rem' }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'rgba(0, 154, 68, 0.1)',
                    color: 'var(--color-green)',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    marginBottom: '1rem',
                    fontWeight: 600,
                    fontSize: '0.9rem'
                }}>
                    {step.icon}
                    <span>Étape actuelle</span>
                </div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, lineHeight: 1.2, color: 'var(--color-text-main)' }}>
                    {step.title}
                </h2>
            </div>

            {/* Media Section */}
            <div style={{
                width: '100%',
                aspectRatio: '16/9',
                background: '#000',
                borderRadius: '20px',
                overflow: 'hidden',
                marginBottom: '1.5rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                position: 'relative'
            }}>
                {step.type === 'video' ? (
                    <video
                        ref={videoRef}
                        src={step.media}
                        controls
                        autoPlay
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                ) : (
                    step.media.includes('placeholder') ? (
                        <div style={{
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#999',
                            flexDirection: 'column',
                            gap: '1rem'
                        }}>
                            <div style={{ fontSize: '3rem' }}>🖼️</div>
                            <p style={{ fontWeight: 500 }}>Illustration à venir</p>
                        </div>
                    ) : (
                        <img
                            src={step.media}
                            alt={step.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    )
                )}
            </div>

            {/* Description Section */}
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <p style={{ fontSize: '1.1rem', color: 'var(--color-text-main)', marginBottom: '1rem', lineHeight: '1.6' }}>
                    {step.description}
                </p>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem' }}>
                    {step.details.map((detail, idx) => (
                        <li key={idx} style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.8rem',
                            marginBottom: '0.8rem',
                            color: 'var(--color-text-muted)',
                            fontSize: '0.95rem'
                        }}>
                            <div style={{
                                width: '6px',
                                height: '6px',
                                background: 'var(--color-orange)',
                                borderRadius: '50%',
                                marginTop: '8px'
                            }}></div>
                            {detail}
                        </li>
                    ))}
                </ul>

                {/* Bouton Savoir Plus (Vert) */}
                {step.moreInfo && (
                    <button
                        onClick={onShowMore}
                        style={{
                            width: '100%',
                            background: '#E8F5E9',
                            color: 'var(--color-green)',
                            border: '1px solid var(--color-green)',
                            padding: '1rem',
                            borderRadius: '12px',
                            fontSize: '1rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer'
                        }}
                    >
                        <Info size={20} />
                        Savoir plus
                    </button>
                )}
            </div>

        </motion.div>
    );
};

export default StepContent;
