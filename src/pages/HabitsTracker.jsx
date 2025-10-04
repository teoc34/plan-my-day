import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, X, Check, CreditCard as Edit2, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function HabitsTracker({ user }) {
  const [habits, setHabits] = useState([]);
  const [habitLogs, setHabitLogs] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    category: 'general',
    target_frequency: 'daily',
    color: '#0ea5e9',
  });

  const categories = ['general', 'health', 'productivity', 'wellness', 'fitness', 'learning'];
  const frequencies = ['daily', 'weekly', 'monthly'];
  const colors = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  useEffect(() => {
    fetchHabits();
    fetchTodayLogs();
  }, []);

  const fetchHabits = async () => {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setHabits(data);
    }
  };

  const fetchTodayLogs = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('habit_logs')
      .select('*')
      .eq('user_id', user.id)
      .eq('logged_date', today);

    if (!error && data) {
      const logsMap = {};
      data.forEach(log => {
        logsMap[log.habit_id] = log;
      });
      setHabitLogs(logsMap);
    }
  };

  const addHabit = async () => {
    if (!newHabit.name) return;

    const { error } = await supabase
      .from('habits')
      .insert([{ ...newHabit, user_id: user.id }]);

    if (!error) {
      setShowAddModal(false);
      setNewHabit({
        name: '',
        description: '',
        category: 'general',
        target_frequency: 'daily',
        color: '#0ea5e9',
      });
      await fetchHabits();
    }
  };

  const toggleHabit = async (habitId) => {
    const today = new Date().toISOString().split('T')[0];
    const existingLog = habitLogs[habitId];

    if (existingLog) {
      const { error } = await supabase
        .from('habit_logs')
        .update({ completed: !existingLog.completed })
        .eq('id', existingLog.id);

      if (!error) await fetchTodayLogs();
    } else {
      const { error } = await supabase
        .from('habit_logs')
        .insert([{
          habit_id: habitId,
          user_id: user.id,
          completed: true,
          logged_date: today,
        }]);

      if (!error) await fetchTodayLogs();
    }
  };

  const deleteHabit = async (habitId) => {
    const { error } = await supabase
      .from('habits')
      .update({ is_active: false })
      .eq('id', habitId);

    if (!error) await fetchHabits();
  };

  const completedToday = Object.values(habitLogs).filter(log => log.completed).length;
  const totalHabits = habits.length;

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Target size={32} color="#10b981" />
            <h1 style={{ fontSize: '36px', fontWeight: '700' }}>Habits</h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #0ea5e9, #10b981)',
              borderRadius: '12px',
              color: 'white',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Plus size={20} />
            Add Habit
          </motion.button>
        </div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
          Build consistency with daily tracking
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(14, 165, 233, 0.2))',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '20px',
            padding: '32px',
            marginBottom: '32px',
          }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
            Today's Progress
          </h2>
          <div style={{ fontSize: '48px', fontWeight: '700', marginBottom: '16px' }}>
            {completedToday} / {totalHabits}
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
              animate={{ width: totalHabits > 0 ? `${(completedToday / totalHabits) * 100}%` : '0%' }}
              transition={{ duration: 0.5 }}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #10b981, #0ea5e9)',
                borderRadius: '6px',
              }}
            />
          </div>
        </motion.div>

        {habits.length === 0 ? (
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
              No habits yet. Click "Add Habit" to start building your routine!
            </p>
          </motion.div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {habits.map((habit, index) => {
              const isCompleted = habitLogs[habit.id]?.completed;

              return (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  style={{
                    background: 'rgba(30, 41, 59, 0.6)',
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${isCompleted ? habit.color + '40' : 'var(--border)'}`,
                    borderRadius: '16px',
                    padding: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {isCompleted && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `linear-gradient(135deg, ${habit.color}10, transparent)`,
                      pointerEvents: 'none',
                    }} />
                  )}

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleHabit(habit.id)}
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '12px',
                      background: isCompleted ? habit.color : 'rgba(15, 23, 42, 0.6)',
                      border: `2px solid ${habit.color}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'var(--transition)',
                      flexShrink: 0,
                    }}
                  >
                    {isCompleted && <Check size={28} color="white" />}
                  </motion.button>

                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      marginBottom: '4px',
                      textDecoration: isCompleted ? 'line-through' : 'none',
                      opacity: isCompleted ? 0.7 : 1,
                    }}>
                      {habit.name}
                    </h3>
                    {habit.description && (
                      <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: '14px',
                        marginBottom: '8px',
                      }}>
                        {habit.description}
                      </p>
                    )}
                    <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
                      <span style={{
                        padding: '4px 12px',
                        background: `${habit.color}20`,
                        color: habit.color,
                        borderRadius: '6px',
                        fontWeight: '500',
                      }}>
                        {habit.category}
                      </span>
                      <span style={{
                        padding: '4px 12px',
                        background: 'rgba(148, 163, 184, 0.2)',
                        color: 'var(--text-secondary)',
                        borderRadius: '6px',
                        fontWeight: '500',
                      }}>
                        {habit.target_frequency}
                      </span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteHabit(habit.id)}
                    style={{
                      padding: '10px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      borderRadius: '8px',
                      color: 'var(--error)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                    }}
                  >
                    <Trash2 size={18} />
                  </motion.button>
                </motion.div>
              );
            })}
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
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Add New Habit</h2>
                <button onClick={() => setShowAddModal(false)} style={{ padding: '8px' }}>
                  <X size={24} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                    Habit Name *
                  </label>
                  <input
                    type="text"
                    value={newHabit.name}
                    onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                    placeholder="e.g., Drink 8 glasses of water"
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
                    value={newHabit.description}
                    onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                    placeholder="Optional description..."
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

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                    Category
                  </label>
                  <select
                    value={newHabit.category}
                    onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value })}
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
                    Frequency
                  </label>
                  <select
                    value={newHabit.target_frequency}
                    onChange={(e) => setNewHabit({ ...newHabit, target_frequency: e.target.value })}
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
                    {frequencies.map(freq => (
                      <option key={freq} value={freq}>{freq}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                    Color
                  </label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {colors.map(color => (
                      <motion.button
                        key={color}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setNewHabit({ ...newHabit, color })}
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          background: color,
                          border: newHabit.color === color ? '3px solid white' : '1px solid rgba(148, 163, 184, 0.2)',
                          transition: 'var(--transition)',
                        }}
                      />
                    ))}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={addHabit}
                  disabled={!newHabit.name}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: newHabit.name ? 'linear-gradient(135deg, #0ea5e9, #10b981)' : 'rgba(148, 163, 184, 0.2)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600',
                    marginTop: '8px',
                  }}
                >
                  Create Habit
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
