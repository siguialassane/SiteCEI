import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Check, Briefcase, HeartPulse, GraduationCap, Truck, Shield, Home,
    User, Calendar, HelpCircle, Tv, Smartphone, FileText, Star
} from 'lucide-react';

const PollPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    // Steps:
    // 0: Intro
    // 1: Candidate (Party)
    // 2: Reason
    // 3: Incumbent Rating
    // 4: Priorities
    // 5: Info Source
    // 6: Voter Status
    // 7: Age
    // 8: Profession
    // 9: Results

    const [answers, setAnswers] = useState({
        party: '',
        priorities: [],
        choiceReason: '',
        incumbentRating: '',
        infoSource: '',
        voterStatus: '',
        age: '',
        profession: ''
    });

    // Data for Parties
    const parties = [
        { id: 'rhdp', name: 'Bakary Ouattara', img: '/RHDP.png', color: '#FF8200' },
        { id: 'pdci', name: 'Tialy', img: '/PDCI.png', color: '#009A44' },
        { id: 'indep_simon', name: 'Kouadio Kouakou Simon', img: null, color: '#607D8B', type: 'Indépendant' },
        { id: 'indep_faustin', name: 'Atchelo Faustin', img: null, color: '#607D8B', type: 'Indépendant' },
        { id: 'indep_parfait', name: 'Traore Hamed Parfait', img: null, color: '#607D8B', type: 'Indépendant' }
    ];

    // Data for Priorities
    const priorities = [
        { id: 'job', label: 'Emploi Jeunes', icon: <Briefcase size={24} /> },
        { id: 'health', label: 'Santé', icon: <HeartPulse size={24} /> },
        { id: 'edu', label: 'Éducation', icon: <GraduationCap size={24} /> },
        { id: 'infra', label: 'Routes', icon: <Truck size={24} /> },
        { id: 'security', label: 'Sécurité', icon: <Shield size={24} /> },
    ];

    // New Question Options
    const choiceReasons = [
        'Le programme du candidat',
        'Le parti politique',
        'La personnalité du candidat',
        'Le bilan du député sortant',
        'Les actions sociales (dons, aides)'
    ];

    const incumbentRatings = [
        'Très satisfaisant',
        'Moyen',
        'Décevant',
        'Je ne le connais pas'
    ];

    const infoSources = [
        'Facebook & Réseaux Sociaux',
        'Télévision (RTI, NCI...)',
        'Radio',
        'Bouche à oreille (Grin, quartier)',
        'Meetings et rassemblements'
    ];

    const voterStatuses = [
        'Oui',
        'Non',
        'Je ne sais pas encore'
    ];

    const ageRanges = [
        '18-25 ans',
        '26-35 ans',
        '36-50 ans',
        '50 ans et plus'
    ];

    const professions = [
        'Étudiant',
        'Secteur Privé',
        'Fonctionnaire',
        'Commerçant(e) ou Entrepreneur',
        'Sans emploi',
        'Retraité'
    ];

    const handlePartySelect = (partyId) => {
        setAnswers({ ...answers, party: partyId });
        setTimeout(() => setStep(2), 300);
    };

    const handleSingleSelect = (field, value) => {
        setAnswers({ ...answers, [field]: value });
        setTimeout(() => setStep(step + 1), 300);
    };

    const handlePrioritySelect = (priorityId) => {
        setAnswers(prev => {
            const newPriorities = [...prev.priorities];
            const index = newPriorities.indexOf(priorityId);

            if (index > -1) {
                newPriorities.splice(index, 1);
            } else {
                if (newPriorities.length < 3) {
                    newPriorities.push(priorityId);
                }
            }
            return { ...prev, priorities: newPriorities };
        });
    };

    // Mock Results Data
    const results = [
        { name: 'Bakary Ouattara', percent: 35, color: '#FF8200' },
        { name: 'Tialy', percent: 30, color: '#009A44' },
        { name: 'Kouadio K. Simon', percent: 15, color: '#607D8B' },
        { name: 'Atchelo Faustin', percent: 10, color: '#78909C' },
        { name: 'Traore H. Parfait', percent: 10, color: '#546E7A' },
    ];

    const priorityResults = [
        { name: 'Emploi Jeunes', percent: 45, color: '#3498DB' },
        { name: 'Santé', percent: 25, color: '#E74C3C' },
        { name: 'Éducation', percent: 15, color: '#9B59B6' },
        { name: 'Routes', percent: 10, color: '#F1C40F' },
        { name: 'Sécurité', percent: 5, color: '#2ECC71' },
    ];

    const totalSteps = 8; // Excluding intro and results

    const renderSingleChoiceStep = (title, options, field) => (
        <motion.div
            key={`step-${field}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
        >
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                {title}
            </h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
                {options.map((option) => (
                    <motion.button
                        key={option}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSingleSelect(field, option)}
                        style={{
                            background: 'white',
                            padding: '1.2rem',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            border: answers[field] === option ? '2px solid var(--color-orange)' : '1px solid #f0f0f0',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                            width: '100%',
                            textAlign: 'left',
                            fontSize: '1.05rem',
                            fontWeight: 500,
                            color: answers[field] === option ? 'var(--color-orange)' : 'var(--color-text-main)'
                        }}
                    >
                        {option}
                        {answers[field] === option && <Check size={20} />}
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );

    return (
        <div className="page-transition" style={{ background: '#F8F9FA', padding: '1.5rem', minHeight: '100vh' }}>

            {/* Header */}
            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center' }}>
                <button
                    onClick={() => step === 0 ? navigate('/home') : setStep(step - 1)}
                    style={{ background: 'white', padding: '0.8rem', borderRadius: '50%', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', zIndex: 10 }}
                >
                    {step === 9 ? <Home size={20} /> : <ArrowLeft size={20} />}
                </button>
                <div style={{ flex: 1, textAlign: 'center', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                    {step > 0 && step < 9 && `Question ${step}/${totalSteps}`}
                    {step === 9 && 'Résultats'}
                </div>
                <div style={{ width: '40px' }}></div>
            </div>

            <AnimatePresence mode="wait">

                {/* STEP 0: INTRO */}
                {step === 0 && (
                    <motion.div
                        key="intro"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        style={{ textAlign: 'center', marginTop: '2rem' }}
                    >
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🗳️</div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>
                            Votre avis compte
                        </h1>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: '3rem', lineHeight: '1.6' }}>
                            Participez à notre grand sondage anonyme sur les législatives 2025. Cela ne prend que quelques instants.
                        </p>
                        <button
                            onClick={() => setStep(1)}
                            style={{
                                background: 'var(--color-orange)',
                                color: 'white',
                                width: '100%',
                                padding: '1.2rem',
                                borderRadius: '16px',
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                boxShadow: '0 10px 20px rgba(255, 130, 0, 0.3)'
                            }}
                        >
                            Commencer le sondage
                        </button>
                    </motion.div>
                )}

                {/* STEP 1: PARTY VOTE */}
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                            Pour qui voteriez-vous aujourd'hui ?
                        </h2>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {parties.map((party) => (
                                <motion.button
                                    key={party.id}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handlePartySelect(party.id)}
                                    style={{
                                        background: 'white',
                                        padding: '1rem',
                                        borderRadius: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1.2rem',
                                        border: answers.party === party.id ? `2px solid ${party.color}` : '1px solid #f0f0f0',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                                        width: '100%',
                                        minHeight: '80px'
                                    }}
                                >
                                    <div style={{
                                        width: '70px',
                                        height: '60px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        {party.img ? (
                                            <img
                                                src={party.img}
                                                alt={party.name}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'contain',
                                                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                                                }}
                                            />
                                        ) : (
                                            <span style={{ fontWeight: 700, color: party.color, fontSize: '1.5rem' }}>{party.name[0]}</span>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
                                        <span style={{ fontSize: '1.1rem', fontWeight: 700, textAlign: 'left' }}>{party.name}</span>
                                        {party.type && (
                                            <span style={{ fontSize: '0.85rem', color: '#78909C', fontWeight: 500, marginTop: '0.2rem' }}>
                                                {party.type}
                                            </span>
                                        )}
                                    </div>
                                    {answers.party === party.id && (
                                        <div style={{ color: party.color }}>
                                            <Check size={28} />
                                        </div>
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* STEP 2: REASON */}
                {step === 2 && renderSingleChoiceStep("Qu'est-ce qui détermine le plus votre choix ?", choiceReasons, 'choiceReason')}

                {/* STEP 3: INCUMBENT RATING */}
                {step === 3 && renderSingleChoiceStep("Comment jugez-vous le travail du député sortant ?", incumbentRatings, 'incumbentRating')}

                {/* STEP 4: PRIORITIES */}
                {step === 4 && (
                    <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        style={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 4rem)' }}
                    >
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                            Quelle est la priorité pour votre localité ?
                        </h2>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>Sélectionnez jusqu'à 3 options.</p>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                {priorities.map((p) => (
                                    <motion.button
                                        key={p.id}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handlePrioritySelect(p.id)}
                                        style={{
                                            background: answers.priorities.includes(p.id) ? 'var(--color-orange)' : 'white',
                                            color: answers.priorities.includes(p.id) ? 'white' : 'var(--color-text-main)',
                                            padding: '1.5rem',
                                            borderRadius: '20px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.8rem',
                                            border: 'none',
                                            boxShadow: '0 4px 10px rgba(0,0,0,0.03)',
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        {p.icon}
                                        <span style={{ fontWeight: 600, textAlign: 'center' }}>{p.label}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                        <motion.button
                            onClick={() => setStep(5)}
                            disabled={answers.priorities.length === 0}
                            style={{
                                background: 'var(--color-green)',
                                color: 'white',
                                width: '100%',
                                padding: '1.2rem',
                                borderRadius: '16px',
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                boxShadow: '0 10px 20px rgba(46, 204, 113, 0.3)',
                                marginTop: '2rem',
                                opacity: answers.priorities.length === 0 ? 0.5 : 1
                            }}
                        >
                            Suivant
                        </motion.button>
                    </motion.div>
                )}

                {/* STEP 5: INFO SOURCE */}
                {step === 5 && renderSingleChoiceStep("Comment vous informez-vous sur la politique ?", infoSources, 'infoSource')}

                {/* STEP 6: VOTER STATUS */}
                {step === 6 && renderSingleChoiceStep("Avez-vous votre carte d'électeur ?", voterStatuses, 'voterStatus')}

                {/* STEP 7: AGE */}
                {step === 7 && renderSingleChoiceStep("Quelle est votre tranche d'âge ?", ageRanges, 'age')}

                {/* STEP 8: PROFESSION */}
                {step === 8 && renderSingleChoiceStep("Quelle est votre situation professionnelle ?", professions, 'profession')}


                {/* STEP 9: RESULTS */}
                {step === 9 && (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                background: '#E8F5E9',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1rem auto',
                                color: 'var(--color-green)'
                            }}>
                                <Check size={40} />
                            </div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Merci d'avoir participé !</h2>
                            <p style={{ color: 'var(--color-text-muted)' }}>Voici les tendances actuelles</p>
                        </div>

                        {/* Vote Results */}
                        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
                            <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Intentions de vote</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                {results.map((r, index) => (
                                    <div key={index}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
                                            <span>{r.name}</span>
                                            <span>{r.percent}%</span>
                                        </div>
                                        <div style={{ width: '100%', height: '10px', background: '#f0f0f0', borderRadius: '10px', overflow: 'hidden' }}>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${r.percent}%` }}
                                                transition={{ duration: 1, delay: 0.2 }}
                                                style={{ height: '100%', background: r.color, borderRadius: '10px' }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Priority Results */}
                        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Priorités de la localité</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                {priorityResults.map((r, index) => (
                                    <div key={index}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
                                            <span>{r.name}</span>
                                            <span>{r.percent}%</span>
                                        </div>
                                        <div style={{ width: '100%', height: '10px', background: '#f0f0f0', borderRadius: '10px', overflow: 'hidden' }}>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${r.percent}%` }}
                                                transition={{ duration: 1, delay: 0.5 }}
                                                style={{ height: '100%', background: r.color, borderRadius: '10px' }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>


                        <button
                            onClick={() => navigate('/home')}
                            style={{
                                marginTop: '2rem',
                                background: 'transparent',
                                color: 'var(--color-text-muted)',
                                width: '100%',
                                padding: '1rem',
                                fontWeight: 600
                            }}
                        >
                            Retour à l'accueil
                        </button>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
};

export default PollPage;
