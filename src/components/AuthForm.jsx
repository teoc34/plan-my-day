import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

export default function AuthForm({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data.user) onAuthSuccess();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;

        if (data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: data.user.id,
                email: data.user.email,
                full_name: fullName,
              },
            ]);

          if (profileError) throw profileError;
          onAuthSuccess();
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: '20px',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'rgba(30, 41, 59, 0.8)',
          backdropFilter: 'blur(20px)',
          padding: '40px',
          borderRadius: '24px',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          maxWidth: '440px',
          width: '100%',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        }}
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{
            fontSize: '32px',
            fontWeight: '700',
            marginBottom: '8px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #0ea5e9, #10b981)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          LifeFlow
        </motion.h1>
        <p style={{
          textAlign: 'center',
          color: 'var(--text-secondary)',
          marginBottom: '32px',
        }}>
          Organize your life with clarity
        </p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: 'var(--text-secondary)',
                fontSize: '14px',
              }}>
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required={!isLogin}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '12px',
                  color: 'var(--text-primary)',
                  fontSize: '16px',
                  transition: 'var(--transition)',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)'}
              />
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: 'var(--text-secondary)',
              fontSize: '14px',
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '12px',
                color: 'var(--text-primary)',
                fontSize: '16px',
                transition: 'var(--transition)',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)'}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: 'var(--text-secondary)',
              fontSize: '14px',
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '12px',
                color: 'var(--text-primary)',
                fontSize: '16px',
                transition: 'var(--transition)',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)'}
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: '12px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                color: 'var(--error)',
                marginBottom: '16px',
                fontSize: '14px',
              }}
            >
              {error}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #0ea5e9, #10b981)',
              borderRadius: '12px',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'var(--transition)',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
          </motion.button>
        </form>

        <div style={{
          marginTop: '24px',
          textAlign: 'center',
        }}>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            style={{
              color: 'var(--primary)',
              fontSize: '14px',
              transition: 'var(--transition)',
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--primary-dark)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--primary)'}
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
