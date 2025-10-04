import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Droplet,
  Target,
  Briefcase,
  Heart,
  Dumbbell,
  BookOpen,
  LogOut,
} from 'lucide-react';

export default function Sidebar({ activeSection, setActiveSection, onLogout }) {
  const sections = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'water', label: 'Water', icon: Droplet },
    { id: 'habits', label: 'Habits', icon: Target },
    { id: 'career', label: 'Career', icon: Briefcase },
    { id: 'health', label: 'Health', icon: Heart },
    { id: 'gym', label: 'Gym', icon: Dumbbell },
    { id: 'reflections', label: 'Reflections', icon: BookOpen },
  ];

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      style={{
        width: '280px',
        background: 'rgba(30, 41, 59, 0.6)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid var(--border)',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
      }}
    >
      <div style={{ marginBottom: '32px', paddingLeft: '12px' }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #0ea5e9, #10b981)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          LifeFlow
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
          Your life, organized
        </p>
      </div>

      <nav style={{ flex: 1 }}>
        {sections.map((section, index) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;

          return (
            <motion.button
              key={section.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 4 }}
              onClick={() => setActiveSection(section.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                marginBottom: '8px',
                background: isActive ? 'linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(16, 185, 129, 0.2))' : 'transparent',
                borderRadius: '12px',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontSize: '15px',
                fontWeight: isActive ? '600' : '400',
                transition: 'var(--transition)',
                border: isActive ? '1px solid rgba(14, 165, 233, 0.3)' : '1px solid transparent',
              }}
            >
              <Icon size={20} />
              <span>{section.label}</span>
            </motion.button>
          );
        })}
      </nav>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onLogout}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
          background: 'rgba(239, 68, 68, 0.1)',
          borderRadius: '12px',
          color: 'var(--error)',
          fontSize: '15px',
          fontWeight: '500',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          transition: 'var(--transition)',
        }}
      >
        <LogOut size={20} />
        <span>Logout</span>
      </motion.button>
    </motion.aside>
  );
}
