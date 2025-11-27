import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Info, ArrowRight } from 'lucide-react';

const StepContent = ({ step, onShowMore, onNext, isLastStep }) => {
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
            <div style={{ marginBottom: '1rem' }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'rgba(0, 154, 68, 0.1)',
                    color: 'var(--color-green)',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '16px',
                    marginBottom: '0.75rem',
                    fontWeight: 600,
                    fontSize: '0.85rem'
                }}>
                    {step.icon}
                    <span>Étape actuelle</span>
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, lineHeight: 1.2, color: 'var(--color-text-main)' }}>
                    {step.title}
                </h2>
            </div>

            {/* Media Section */}
            <div style={{
                width: '100%',
                aspectRatio: '4/3',
                maxHeight: '35vh',
                background: '#000',
                borderRadius: '16px',
                overflow: 'hidden',
                marginBottom: '1rem',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                position: 'relative',
                flexShrink: 0
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
            <div style={{ background: 'white', padding: '1rem', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                <p style={{ fontSize: '1rem', color: 'var(--color-text-main)', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                    {step.description}
                </p>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1rem' }}>
                    {step.details.map((detail, idx) => (
                        <li key={idx} style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.6rem',
                            marginBottom: '0.5rem',
                            color: 'var(--color-text-muted)',
                            fontSize: '0.9rem'
                        }}>
                            <div style={{
                                width: '5px',
                                height: '5px',
                                background: 'var(--color-orange)',
                                borderRadius: '50%',
                                marginTop: '7px',
                                flexShrink: 0
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
                            padding: '0.8rem',
                            borderRadius: '10px',
                            fontSize: '0.95rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer'
                        }}
                    >
                        <Info size={18} />
                        Savoir plus
                    </button>
                )}

                {/* Bouton Suivant (Orange) */}
                <button
                    onClick={onNext}
                    style={{
                        width: '100%',
                        background: 'var(--color-orange)',
                        color: 'white',
                        padding: '1rem',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        marginTop: '0.75rem',
                        boxShadow: '0 8px 16px rgba(255, 130, 0, 0.2)',
                        cursor: 'pointer'
                    }}
                >
                    {isLastStep ? 'Explications futures' : 'Suivant'}
                    <ArrowRight size={18} />
                </button>
            </div>

        </motion.div>
    );
};

export default StepContent;
