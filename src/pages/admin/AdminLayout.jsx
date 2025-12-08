import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
    LayoutDashboard, BarChart3, Users, MapPin, TrendingUp,
    LogOut, Menu, X, ChevronRight, Shield
} from 'lucide-react';
import { supabase } from '../../supabaseClient';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                navigate('/admin');
                return;
            }
            setUser(session.user);
        };
        checkAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                navigate('/admin');
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin');
    };

    const menuItems = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Vue d\'ensemble' },
        { path: '/admin/results', icon: BarChart3, label: 'Résultats' },
        { path: '/admin/participants', icon: Users, label: 'Participants' },
        { path: '/admin/geography', icon: MapPin, label: 'Géographie' },
        { path: '/admin/demographics', icon: TrendingUp, label: 'Analyses' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
            {/* Sidebar Desktop */}
            <aside style={{
                width: '260px',
                background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
                display: 'none',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                zIndex: 50,
                '@media (min-width: 768px)': { display: 'flex' }
            }} className="sidebar-desktop">
                <SidebarContent
                    menuItems={menuItems}
                    isActive={isActive}
                    navigate={navigate}
                    handleLogout={handleLogout}
                    user={user}
                />
            </aside>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)}
                            style={{
                                position: 'fixed',
                                inset: 0,
                                background: 'rgba(0,0,0,0.5)',
                                zIndex: 40
                            }}
                            className="sidebar-mobile-overlay"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25 }}
                            style={{
                                width: '280px',
                                background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'fixed',
                                height: '100vh',
                                zIndex: 50
                            }}
                        >
                            <button
                                onClick={() => setSidebarOpen(false)}
                                style={{
                                    position: 'absolute',
                                    top: '1rem',
                                    right: '1rem',
                                    background: 'rgba(255,255,255,0.1)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '0.5rem',
                                    cursor: 'pointer'
                                }}
                            >
                                <X size={24} color="white" />
                            </button>
                            <SidebarContent
                                menuItems={menuItems}
                                isActive={isActive}
                                navigate={(path) => { navigate(path); setSidebarOpen(false); }}
                                handleLogout={handleLogout}
                                user={user}
                            />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main style={{
                flex: 1,
                marginLeft: '0',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column'
            }} className="main-content">
                {/* Top Bar */}
                <header style={{
                    background: 'white',
                    padding: '1rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 30
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button
                            onClick={() => setSidebarOpen(true)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '0.5rem'
                            }}
                            className="menu-button"
                        >
                            <Menu size={24} color="#374151" />
                        </button>
                        <h1 style={{
                            fontSize: '1.25rem',
                            fontWeight: 700,
                            color: '#1a1a2e'
                        }}>
                            {menuItems.find(item => isActive(item.path))?.label || 'Dashboard'}
                        </h1>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                    }}>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--color-orange), #ff6b35)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Shield size={18} color="white" />
                        </div>
                        <span style={{
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            color: '#374151',
                            display: 'none'
                        }} className="user-email">
                            {user?.email}
                        </span>
                    </div>
                </header>

                {/* Page Content */}
                <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
                    <Outlet />
                </div>
            </main>

            {/* CSS for responsive */}
            <style>{`
                @media (min-width: 768px) {
                    .sidebar-desktop { display: flex !important; }
                    .main-content { margin-left: 260px !important; }
                    .menu-button { display: none !important; }
                    .user-email { display: block !important; }
                }
            `}</style>
        </div>
    );
};

// Sidebar Content Component
const SidebarContent = ({ menuItems, isActive, navigate, handleLogout, user }) => (
    <>
        {/* Logo */}
        <div style={{
            padding: '1.5rem',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, var(--color-orange), #ff6b35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Shield size={22} color="white" />
                </div>
                <div>
                    <h2 style={{
                        color: 'white',
                        fontSize: '1.1rem',
                        fontWeight: 700
                    }}>CEI Admin</h2>
                    <p style={{
                        color: 'rgba(255,255,255,0.5)',
                        fontSize: '0.75rem'
                    }}>Tableau de bord</p>
                </div>
            </div>
        </div>

        {/* Menu */}
        <nav style={{ flex: 1, padding: '1rem 0.75rem' }}>
            {menuItems.map((item) => (
                <motion.button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.85rem 1rem',
                        marginBottom: '0.25rem',
                        borderRadius: '12px',
                        border: 'none',
                        cursor: 'pointer',
                        background: isActive(item.path)
                            ? 'linear-gradient(135deg, var(--color-orange), #ff6b35)'
                            : 'transparent',
                        color: isActive(item.path) ? 'white' : 'rgba(255,255,255,0.7)',
                        fontSize: '0.95rem',
                        fontWeight: isActive(item.path) ? 600 : 400,
                        textAlign: 'left',
                        transition: 'all 0.2s'
                    }}
                >
                    <item.icon size={20} />
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {isActive(item.path) && <ChevronRight size={16} />}
                </motion.button>
            ))}
        </nav>

        {/* User & Logout */}
        <div style={{
            padding: '1rem',
            borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
            <div style={{
                padding: '0.75rem',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
                marginBottom: '0.75rem'
            }}>
                <p style={{
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '0.75rem',
                    marginBottom: '0.25rem'
                }}>Connecté en tant que</p>
                <p style={{
                    color: 'white',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}>{user?.email || 'Admin'}</p>
            </div>
            <button
                onClick={handleLogout}
                style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'transparent',
                    color: 'rgba(255,255,255,0.7)',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s'
                }}
            >
                <LogOut size={18} />
                Déconnexion
            </button>
        </div>
    </>
);

export default AdminLayout;
