import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import logoVote from '../assets/logo_vote.png';

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="page-transition" style={{ background: '#FFFFFF' }}>
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center'
      }}>

        {/* Logo / Illustration Area */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ marginBottom: '2rem', width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <img
            src={logoVote}
            alt="Vote Côte d'Ivoire"
            style={{
              width: '100%',
              maxWidth: '350px',
              height: 'auto',
              objectFit: 'contain'
            }}
          />
        </motion.div>

        {/* Text Content */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            color: 'var(--color-text-main)',
            marginBottom: '1rem',
            lineHeight: 1.2
          }}
        >
          Mon Vote <br />
          <span style={{ color: 'var(--color-orange)' }}>Ma Voix</span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{
            fontSize: '1.1rem',
            color: 'var(--color-text-muted)',
            marginBottom: '3rem',
            maxWidth: '300px'
          }}
        >
          Apprenez à voter correctement et participez à l'avenir de la Côte d'Ivoire.
        </motion.p>

        {/* Button */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/name')}
          style={{
            background: 'var(--color-orange)',
            color: 'white',
            padding: '1.2rem 3rem',
            borderRadius: '50px',
            fontSize: '1.2rem',
            fontWeight: 600,
            boxShadow: '0 10px 20px rgba(255, 130, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          Commencer <ArrowRight size={20} />
        </motion.button>

        {/* Footer Decoration */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '10px',
          display: 'flex'
        }}>
          <div style={{ flex: 1, background: 'var(--color-orange)' }}></div>
          <div style={{ flex: 1, background: 'var(--color-white)' }}></div>
          <div style={{ flex: 1, background: 'var(--color-green)' }}></div>
        </div>

      </div>
    </div>
  );
};

export default WelcomePage;
