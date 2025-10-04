import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplet, Plus, Trash2, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function WaterTracker({ user }) {
  const [waterLogs, setWaterLogs] = useState([]);
  const [amount, setAmount] = useState(250);
  const [loading, setLoading] = useState(false);
  const [totalToday, setTotalToday] = useState(0);

  const quickAmounts = [250, 500, 750, 1000];

  useEffect(() => {
    fetchWaterLogs();
  }, []);

  const fetchWaterLogs = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('water_intake')
      .select('*')
      .eq('user_id', user.id)
      .gte('logged_at', `${today}T00:00:00`)
      .order('logged_at', { ascending: false });

    if (!error && data) {
      setWaterLogs(data);
      const total = data.reduce((sum, log) => sum + log.amount_ml, 0);
      setTotalToday(total);
    }
  };

  const addWaterLog = async (ml) => {
    setLoading(true);
    const { error } = await supabase
      .from('water_intake')
      .insert([{ user_id: user.id, amount_ml: ml }]);

    if (!error) {
      await fetchWaterLogs();
    }
    setLoading(false);
  };

  const deleteWaterLog = async (id) => {
    const { error } = await supabase
      .from('water_intake')
      .delete()
      .eq('id', id);

    if (!error) {
      await fetchWaterLogs();
    }
  };

  const goalAmount = 2500;
  const progressPercent = Math.min((totalToday / goalAmount) * 100, 100);

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Droplet size={32} color="#0ea5e9" />
          <h1 style={{ fontSize: '36px', fontWeight: '700' }}>Water Tracker</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
          Stay hydrated throughout the day
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(16, 185, 129, 0.2))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(14, 165, 233, 0.3)',
              borderRadius: '20px',
              padding: '32px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
              Today's Progress
            </h2>

            <div style={{ fontSize: '48px', fontWeight: '700', marginBottom: '8px' }}>
              {(totalToday / 1000).toFixed(2)} L
            </div>
            <div style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Goal: {goalAmount / 1000} L
            </div>

            <div style={{
              width: '100%',
              height: '12px',
              background: 'rgba(15, 23, 42, 0.6)',
              borderRadius: '6px',
              overflow: 'hidden',
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5 }}
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #0ea5e9, #10b981)',
                  borderRadius: '6px',
                }}
              />
            </div>

            <div style={{
              marginTop: '8px',
              fontSize: '14px',
              color: 'var(--text-secondary)',
            }}>
              {progressPercent.toFixed(0)}% Complete
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              background: 'rgba(30, 41, 59, 0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              padding: '32px',
            }}
          >
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>
              Quick Add
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
            }}>
              {quickAmounts.map((ml, index) => (
                <motion.button
                  key={ml}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addWaterLog(ml)}
                  disabled={loading}
                  style={{
                    padding: '20px',
                    background: 'rgba(14, 165, 233, 0.1)',
                    border: '1px solid rgba(14, 165, 233, 0.3)',
                    borderRadius: '12px',
                    fontSize: '24px',
                    fontWeight: '600',
                    color: '#0ea5e9',
                    transition: 'var(--transition)',
                  }}
                >
                  {ml} ml
                </motion.button>
              ))}
            </div>

            <div style={{ marginTop: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: 'var(--text-secondary)',
                fontSize: '14px',
              }}>
                Custom Amount (ml)
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                  min="1"
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '12px',
                    color: 'var(--text-primary)',
                    fontSize: '16px',
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addWaterLog(amount)}
                  disabled={loading}
                  style={{
                    padding: '12px 20px',
                    background: 'linear-gradient(135deg, #0ea5e9, #10b981)',
                    borderRadius: '12px',
                    color: 'white',
                    fontWeight: '600',
                  }}
                >
                  <Plus size={20} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'rgba(30, 41, 59, 0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            padding: '32px',
          }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>
            Today's Log
          </h2>

          {waterLogs.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '32px' }}>
              No water logged yet today. Start tracking!
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <AnimatePresence>
                {waterLogs.map((log, index) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px 20px',
                      background: 'rgba(15, 23, 42, 0.4)',
                      borderRadius: '12px',
                      border: '1px solid rgba(148, 163, 184, 0.1)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'rgba(14, 165, 233, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Droplet size={20} color="#0ea5e9" />
                      </div>
                      <div>
                        <div style={{ fontSize: '18px', fontWeight: '600' }}>
                          {log.amount_ml} ml
                        </div>
                        <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                          {new Date(log.logged_at).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteWaterLog(log.id)}
                      style={{
                        padding: '8px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        borderRadius: '8px',
                        color: 'var(--error)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                      }}
                    >
                      <Trash2 size={18} />
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
