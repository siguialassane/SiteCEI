import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, ArrowRight, ChevronLeft, Phone, Calendar } from 'lucide-react';
import { supabase } from '../supabaseClient';

const NameEntryPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        lastName: '',
        firstName: '',
        birthDate: '',
        phone: ''
    });
    const [phoneError, setPhoneError] = useState('');
    const [isChecking, setIsChecking] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'phone') {
            setPhoneError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;

        setIsChecking(true);
        const { data, error } = await supabase
            .from('participants')
            .select('*')
            .eq('phone', formData.phone.trim())
            .single();
        setIsChecking(false);

        if (error && error.code !== 'PGRST116') {
            console.error('Error checking phone number:', error);
            setPhoneError('Erreur lors de la vérification du numéro.');
            return;
        }

        if (data) {
            // Utilisateur existant - récupérer toutes ses infos
            localStorage.setItem('hasVoted', 'true');
            localStorage.setItem('userPhone', formData.phone.trim());
            localStorage.setItem('userName', `${data.first_name} ${data.last_name}`);
            localStorage.setItem('userFirstName', data.first_name);
            localStorage.setItem('userLastName', data.last_name);
            if (data.gender) localStorage.setItem('userGender', data.gender);
            if (data.birth_date) localStorage.setItem('userBirthDate', data.birth_date);
            if (data.location) localStorage.setItem('userLocation', data.location);
            if (data.location_detail) localStorage.setItem('userLocationDetail', data.location_detail);
            navigate('/already-voted');
            return;
        }

        // Nouvel utilisateur
        localStorage.setItem('userLastName', formData.lastName.trim());
        localStorage.setItem('userFirstName', formData.firstName.trim());
        localStorage.setItem('userName', `${formData.firstName.trim()} ${formData.lastName.trim()}`);
        if(formData.birthDate) localStorage.setItem('userBirthDate', formData.birthDate);
        localStorage.setItem('userPhone', formData.phone.trim());
        
        navigate('/gender');
    };

    const isFormValid = formData.lastName.trim() && formData.firstName.trim() && formData.phone.trim();

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
                        Faisons connaissance
                    </h2>
                    <p style={{
                        fontSize: '1rem',
                        color: 'var(--color-text-muted)',
                        marginBottom: '3rem'
                    }}>
                        Entrez vos informations personnelles.
                    </p>
                </motion.div>

                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Prénom */}
                        <div style={{ position: 'relative' }}>
                            <User size={20} color="var(--color-orange)" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '0' }} />
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Prénom" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} required />
                        </div>

                        {/* Nom */}
                        <div style={{ position: 'relative' }}>
                            <User size={20} color="var(--color-orange)" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '0' }} />
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Nom" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} required />
                        </div>

                        {/* Date de Naissance */}
                        <div style={{ position: 'relative' }}>
                            <Calendar size={20} color="var(--color-orange)" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '0' }} />
                            <input type="text" name="birthDate" value={formData.birthDate} onChange={handleChange} placeholder="Date de naissance (optionnel)" style={inputStyle} onFocus={(e) => { e.target.type = 'date'; handleFocus(e); }} onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; handleBlur(e); }} />
                        </div>

                        {/* Numéro de téléphone */}
                        <div style={{ position: 'relative' }}>
                            <Phone size={20} color="var(--color-orange)" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '0' }} />
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Numéro de téléphone (obligatoire)" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} required />
                            {phoneError && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.5rem' }}>{phoneError}</p>}
                        </div>
                    </div>

                    <motion.button
                        type="submit"
                        disabled={!isFormValid || isChecking}
                        whileHover={{ scale: isFormValid && !isChecking ? 1.02 : 1 }}
                        whileTap={{ scale: isFormValid && !isChecking ? 0.98 : 1 }}
                        style={{
                            width: '100%',
                            background: isFormValid && !isChecking ? 'var(--color-orange)' : '#ccc',
                            color: 'white',
                            padding: '1.2rem',
                            borderRadius: '16px',
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            cursor: isFormValid && !isChecking ? 'pointer' : 'not-allowed',
                            transition: 'background-color 0.3s',
                            boxShadow: isFormValid && !isChecking ? '0 10px 20px rgba(255, 130, 0, 0.2)' : 'none',
                            marginTop: '3rem'
                        }}
                    >
                        {isChecking ? 'Vérification...' : 'Continuer'} <ArrowRight size={20} />
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

export default NameEntryPage;
