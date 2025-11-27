import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { guideSteps } from '../data/guideData';
import StepContent from '../components/guide/StepContent';
import GuideModal from '../components/guide/GuideModal';

const GuidePage = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [showModal, setShowModal] = useState(false);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    const nextStep = () => {
        if (currentStep < guideSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            // On the last step, navigate to the future explanations page
            navigate('/future-explanations');
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        } else {
            navigate('/home');
        }
    };

    return (
        <div className="page-transition" style={{ background: '#F8F9FA', height: '100dvh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>

            {/* Header with Progress */}
            <div style={{ padding: '1rem 1.5rem', background: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', zIndex: 10, flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <button onClick={prevStep} style={{ background: 'transparent', padding: '0.5rem', marginLeft: '-0.5rem' }}>
                        <ArrowLeft size={24} color="var(--color-text-main)" />
                    </button>
                    <span style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: '1rem' }}>
                        Étape {currentStep + 1} sur {guideSteps.length}
                    </span>
                    <div style={{ width: '24px' }}></div>
                </div>

                {/* Progress Bar */}
                <div style={{ width: '100%', height: '5px', background: '#f0f0f0', borderRadius: '3px', overflow: 'hidden' }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentStep + 1) / guideSteps.length) * 100}%` }}
                        style={{ height: '100%', background: 'var(--color-green)' }}
                    />
                </div>
            </div>

            {/* Main Content Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                <AnimatePresence mode="wait">
                    <StepContent
                        step={guideSteps[currentStep]}
                        onShowMore={() => setShowModal(true)}
                        onNext={nextStep}
                        isLastStep={currentStep === guideSteps.length - 1}
                    />
                </AnimatePresence>
            </div>

            {/* Modal */}
            <GuideModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                data={guideSteps[currentStep].moreInfo}
            />


        </div>
    );
};

export default GuidePage;