import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Plus, Activity, Moon, Smile } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function HealthTracker({ user }) {
  const [metrics, setMetrics] = useState([]);
  const [metricType, setMetricType] = useState('weight');
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState('kg');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const metricTypes = [
    { id: 'weight', label: 'Weight', icon: Activity, unit: 'kg', color: '#0ea5e9' },
    { id: 'sleep', label: 'Sleep Hours', icon: Moon, unit: 'hours', color: '#8b5cf6' },
    { id: 'mood', label: 'Mood', icon: Smile, unit: '1-10', color: '#f59e0b' },
    { id: 'energy', label: 'Energy Level', icon: Activity, unit: '1-10', color: '#10b981' },
  ];

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    const { data, error } = await supabase
      .from('health_metrics')
      .select('*')
      .eq('user_id', user.id)
      .order('recorded_at', { ascending: false })
      .limit(50);

    if (!error && data) {
      setMetrics(data);
    }
  };

  const addMetric = async () => {
    if (!value) return;

    setLoading(true);
    const { error } = await supabase
      .from('health_metrics')
      .insert([{
        user_id: user.id,
        metric_type: metricType,
        value: parseFloat(value),
        unit,
        notes,
      }]);

    if (!error) {
      setValue('');
      setNotes('');
      await fetchMetrics();
    }
    setLoading(false);
  };

  const getMetricsByType = (type) => {
    return metrics.filter(m => m.metric_type === type);
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Heart size={32} color="#ef4444" />
          <h1 style={{ fontSize: '36px', fontWeight: '700' }}>Health Metrics</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
          Monitor your health and wellness
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          {metricTypes.map((metric, index) => {
            const Icon = metric.icon;
            const recentMetrics = getMetricsByType(metric.id);
            const latestValue = recentMetrics[0]?.value || 0;

            return (
              <motion.div
                key={metric.id}
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
                  background: `radial-gradient(circle, ${metric.color}20, transparent)`,
                  borderRadius: '50%',
                }} />

                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: `${metric.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}>
                  <Icon size={24} color={metric.color} />
                </div>

                <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '4px' }}>
                  {latestValue} {metric.unit}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                  {metric.label}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '8px' }}>
                  {recentMetrics.length} entries
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
            borderRadius: '20px',
            padding: '32px',
            marginBottom: '32px',
          }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>
            Add New Metric
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                Metric Type
              </label>
              <select
                value={metricType}
                onChange={(e) => {
                  setMetricType(e.target.value);
                  const selectedMetric = metricTypes.find(m => m.id === e.target.value);
                  setUnit(selectedMetric.unit);
                }}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '12px',
                  color: 'var(--text-primary)',
                  fontSize: '16px',
                }}
              >
                {metricTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                Value
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter value"
                step="0.1"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '12px',
                  color: 'var(--text-primary)',
                  fontSize: '16px',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                Unit
              </label>
              <input
                type="text"
                value={unit}
                readOnly
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(15, 23, 42, 0.4)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '12px',
                  color: 'var(--text-muted)',
                  fontSize: '16px',
                }}
              />
            </div>
          </div>

          <div style={{ marginTop: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes..."
              rows={2}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '12px',
                color: 'var(--text-primary)',
                fontSize: '16px',
                resize: 'vertical',
              }}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={addMetric}
            disabled={loading || !value}
            style={{
              marginTop: '16px',
              padding: '12px 24px',
              background: value ? 'linear-gradient(135deg, #ef4444, #ec4899)' : 'rgba(148, 163, 184, 0.2)',
              borderRadius: '12px',
              color: 'white',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Plus size={20} />
            Add Metric
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            background: 'rgba(30, 41, 59, 0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            padding: '32px',
          }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>
            Recent Entries
          </h2>

          {metrics.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '32px' }}>
              No metrics recorded yet. Start tracking your health!
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {metrics.slice(0, 10).map((metric, index) => {
                const metricInfo = metricTypes.find(m => m.id === metric.metric_type);
                const Icon = metricInfo?.icon || Activity;

                return (
                  <motion.div
                    key={metric.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: `${metricInfo?.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Icon size={20} color={metricInfo?.color} />
                      </div>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '2px' }}>
                          {metricInfo?.label}
                        </div>
                        <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                          {new Date(metric.recorded_at).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '24px', fontWeight: '700' }}>
                        {metric.value}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {metric.unit}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
