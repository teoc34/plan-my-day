import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Plus, X, Target, TrendingUp, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function CareerTracker({ user }) {
  const [goals, setGoals] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'general',
    status: 'not_started',
    priority: 'medium',
    target_date: '',
    progress_percentage: 0,
  });

  const categories = ['general', 'skills', 'promotion', 'project', 'networking', 'education'];
  const statuses = ['not_started', 'in_progress', 'completed', 'paused'];
  const priorities = ['low', 'medium', 'high', 'urgent'];

  const statusColors = {
    not_started: '#94a3b8',
    in_progress: '#0ea5e9',
    completed: '#10b981',
    paused: '#f59e0b',
  };

  const priorityColors = {
    low: '#10b981',
    medium: '#0ea5e9',
    high: '#f59e0b',
    urgent: '#ef4444',
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    const { data, error } = await supabase
      .from('career_goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setGoals(data);
    }
  };

  const addGoal = async () => {
    if (!newGoal.title) return;

    const { error } = await supabase
      .from('career_goals')
      .insert([{ ...newGoal, user_id: user.id }]);

    if (!error) {
      setShowAddModal(false);
      setNewGoal({
        title: '',
        description: '',
        category: 'general',
        status: 'not_started',
        priority: 'medium',
        target_date: '',
        progress_percentage: 0,
      });
      await fetchGoals();
    }
  };

  const updateProgress = async (goalId, progress) => {
    const status = progress === 100 ? 'completed' : progress > 0 ? 'in_progress' : 'not_started';

    const { error } = await supabase
      .from('career_goals')
      .update({ progress_percentage: progress, status, updated_at: new Date().toISOString() })
      .eq('id', goalId);

    if (!error) await fetchGoals();
  };

  const deleteGoal = async (goalId) => {
    const { error } = await supabase
      .from('career_goals')
      .delete()
      .eq('id', goalId);

    if (!error) await fetchGoals();
  };

  const activeGoals = goals.filter(g => g.status !== 'completed').length;
  const completedGoals = goals.filter(g => g.status === 'completed').length;

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Briefcase size={32} color="#f59e0b" />
            <h1 style={{ fontSize: '36px', fontWeight: '700' }}>Career Goals</h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
              borderRadius: '12px',
              color: 'white',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Plus size={20} />
            Add Goal
          </motion.button>
        </div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
          Track and achieve your career objectives
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '32px' }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(239, 68, 68, 0.2))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '20px',
              padding: '32px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <TrendingUp size={24} color="#f59e0b" />
              <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Active Goals</h2>
            </div>
            <div style={{ fontSize: '48px', fontWeight: '700' }}>{activeGoals}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(14, 165, 233, 0.2))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '20px',
              padding: '32px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <Target size={24} color="#10b981" />
              <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Completed</h2>
            </div>
            <div style={{ fontSize: '48px', fontWeight: '700' }}>{completedGoals}</div>
          </motion.div>
        </div>

        {goals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: 'rgba(30, 41, 59, 0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              padding: '64px 32px',
              textAlign: 'center',
            }}
          >
            <p style={{ color: 'var(--text-muted)', fontSize: '18px' }}>
              No career goals yet. Start by adding your first goal!
            </p>
          </motion.div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {goals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
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
                  top: 0,
                  right: 0,
                  width: '200px',
                  height: '200px',
                  background: `radial-gradient(circle, ${statusColors[goal.status]}10, transparent)`,
                  borderRadius: '50%',
                }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>
                      {goal.title}
                    </h3>
                    {goal.description && (
                      <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>
                        {goal.description}
                      </p>
                    )}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{
                        padding: '4px 12px',
                        background: `${statusColors[goal.status]}20`,
                        color: statusColors[goal.status],
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}>
                        {goal.status.replace('_', ' ')}
                      </span>
                      <span style={{
                        padding: '4px 12px',
                        background: `${priorityColors[goal.priority]}20`,
                        color: priorityColors[goal.priority],
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}>
                        {goal.priority}
                      </span>
                      <span style={{
                        padding: '4px 12px',
                        background: 'rgba(148, 163, 184, 0.2)',
                        color: 'var(--text-secondary)',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                      }}>
                        {goal.category}
                      </span>
                      {goal.target_date && (
                        <span style={{
                          padding: '4px 12px',
                          background: 'rgba(148, 163, 184, 0.2)',
                          color: 'var(--text-secondary)',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}>
                          <Clock size={12} />
                          {new Date(goal.target_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteGoal(goal.id)}
                    style={{
                      padding: '8px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      borderRadius: '8px',
                      color: 'var(--error)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      height: '40px',
                    }}
                  >
                    <X size={18} />
                  </motion.button>
                </div>

                <div style={{ marginTop: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                      Progress
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>
                      {goal.progress_percentage}%
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    background: 'rgba(15, 23, 42, 0.6)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    marginBottom: '8px',
                  }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${goal.progress_percentage}%` }}
                      transition={{ duration: 0.5 }}
                      style={{
                        height: '100%',
                        background: `linear-gradient(90deg, ${statusColors[goal.status]}, ${priorityColors[goal.priority]})`,
                        borderRadius: '4px',
                      }}
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={goal.progress_percentage}
                    onChange={(e) => updateProgress(goal.id, parseInt(e.target.value))}
                    style={{
                      width: '100%',
                      cursor: 'pointer',
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddModal(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px',
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'var(--bg-secondary)',
                borderRadius: '20px',
                padding: '32px',
                maxWidth: '500px',
                width: '100%',
                border: '1px solid var(--border)',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Add Career Goal</h2>
                <button onClick={() => setShowAddModal(false)} style={{ padding: '8px' }}>
                  <X size={24} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                    Goal Title *
                  </label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    placeholder="e.g., Learn React and become proficient"
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
                    Description
                  </label>
                  <textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    placeholder="Describe your goal..."
                    rows={3}
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                      Category
                    </label>
                    <select
                      value={newGoal.category}
                      onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
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
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                      Priority
                    </label>
                    <select
                      value={newGoal.priority}
                      onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value })}
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
                      {priorities.map(pri => (
                        <option key={pri} value={pri}>{pri}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={newGoal.target_date}
                    onChange={(e) => setNewGoal({ ...newGoal, target_date: e.target.value })}
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

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={addGoal}
                  disabled={!newGoal.title}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: newGoal.title ? 'linear-gradient(135deg, #f59e0b, #ef4444)' : 'rgba(148, 163, 184, 0.2)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600',
                    marginTop: '8px',
                  }}
                >
                  Create Goal
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
