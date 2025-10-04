import { motion } from 'framer-motion';
import { TrendingUp, Target, Droplet, Activity } from 'lucide-react';

export default function Dashboard({ user }) {
  const stats = [
    { label: 'Water Today', value: '0 L', icon: Droplet, color: '#0ea5e9' },
    { label: 'Habits Completed', value: '0/0', icon: Target, color: '#10b981' },
    { label: 'Active Goals', value: '0', icon: TrendingUp, color: '#f59e0b' },
    { label: 'Workouts', value: '0', icon: Activity, color: '#ef4444' },
  ];

  return (
    <div style={{ padding: '32px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '8px' }}>
          Welcome back! 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginBottom: '32px' }}>
          Here's your overview for today
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
          marginBottom: '32px',
        }}>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                style={{
                  background: 'rgba(30, 41, 59, 0.6)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '24px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: '100px',
                  height: '100px',
                  background: `radial-gradient(circle, ${stat.color}20, transparent)`,
                  borderRadius: '50%',
                }} />

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '16px',
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: `${stat.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Icon size={24} color={stat.color} />
                  </div>
                </div>

                <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '4px' }}>
                  {stat.value}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            background: 'rgba(30, 41, 59, 0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>
            Ready to get started?
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Track your water intake, build healthy habits, manage your career goals, and more.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Use the sidebar to navigate between sections
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
