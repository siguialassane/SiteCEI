import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const GuideModal = ({ isOpen, onClose, data }) => {
    return (
        <AnimatePresence>
            {isOpen && data && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.5)',
                            zIndex: 40,
                            backdropFilter: 'blur(3px)'
                        }}
                    />
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        style={{
                            position: 'fixed',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'white',
                            borderTopLeftRadius: '24px',
                            borderTopRightRadius: '24px',
                            padding: '2rem',
                            zIndex: 50,
                            maxHeight: '85vh',
                            overflowY: 'auto',
                            boxShadow: '0 -10px 40px rgba(0,0,0,0.2)'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
                                {data.title}
                            </h3>
                            <button
                                onClick={onClose}
                                style={{ background: '#f5f5f5', padding: '0.5rem', borderRadius: '50%' }}
                            >
                                <X size={24} color="#666" />
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {data.sections.map((section, idx) => (
                                <div key={idx} style={{ background: '#F8F9FA', padding: '1rem', borderRadius: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.5rem', color: 'var(--color-orange)', fontWeight: 700 }}>
                                        {section.icon}
                                        <span>{section.title}</span>
                                    </div>
                                    <p style={{ fontSize: '0.95rem', lineHeight: '1.5', color: 'var(--color-text-muted)' }}>
                                        {section.content}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={onClose}
                            style={{
                                marginTop: '2rem',
                                width: '100%',
                                background: 'var(--color-text-main)',
                                color: 'white',
                                padding: '1rem',
                                borderRadius: '12px',
                                fontWeight: 600
                            }}
                        >
                            J'ai compris
                        </button>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default GuideModal;
