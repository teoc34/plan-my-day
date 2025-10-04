import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Plus, X, Clock, Flame } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function GymTracker({ user }) {
  const [workouts, setWorkouts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWorkout, setNewWorkout] = useState({
    name: '',
    workout_type: 'strength',
    duration_minutes: 30,
    calories_burned: 0,
    notes: '',
  });

  const workoutTypes = ['strength', 'cardio', 'flexibility', 'sports', 'other'];

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    const { data, error } = await supabase
      .from('gym_workouts')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .limit(20);

    if (!error && data) {
      setWorkouts(data);
    }
  };

  const addWorkout = async () => {
    if (!newWorkout.name) return;

    const { error } = await supabase
      .from('gym_workouts')
      .insert([{ ...newWorkout, user_id: user.id }]);

    if (!error) {
      setShowAddModal(false);
      setNewWorkout({
        name: '',
        workout_type: 'strength',
        duration_minutes: 30,
        calories_burned: 0,
        notes: '',
      });
      await fetchWorkouts();
    }
  };

  const deleteWorkout = async (id) => {
    const { error } = await supabase
      .from('gym_workouts')
      .delete()
      .eq('id', id);

    if (!error) await fetchWorkouts();
  };

  const totalWorkouts = workouts.length;
  const totalMinutes = workouts.reduce((sum, w) => sum + w.duration_minutes, 0);
  const totalCalories = workouts.reduce((sum, w) => sum + w.calories_burned, 0);

  const typeColors = {
    strength: '#ef4444',
    cardio: '#0ea5e9',
    flexibility: '#10b981',
    sports: '#f59e0b',
    other: '#8b5cf6',
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Dumbbell size={32} color="#ef4444" />
            <h1 style={{ fontSize: '36px', fontWeight: '700' }}>Gym & Fitness</h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #ef4444, #ec4899)',
              borderRadius: '12px',
              color: 'white',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Plus size={20} />
            Log Workout
          </motion.button>
        </div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
          Track your fitness journey
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(236, 72, 153, 0.2))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '20px',
              padding: '32px',
            }}
          >
            <Dumbbell size={24} color="#ef4444" style={{ marginBottom: '12px' }} />
            <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '4px' }}>
              {totalWorkouts}
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>Total Workouts</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(16, 185, 129, 0.2))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(14, 165, 233, 0.3)',
              borderRadius: '20px',
              padding: '32px',
            }}
          >
            <Clock size={24} color="#0ea5e9" style={{ marginBottom: '12px' }} />
            <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '4px' }}>
              {totalMinutes}
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>Total Minutes</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(239, 68, 68, 0.2))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '20px',
              padding: '32px',
            }}
          >
            <Flame size={24} color="#f59e0b" style={{ marginBottom: '12px' }} />
            <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '4px' }}>
              {totalCalories}
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>Calories Burned</div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            background: 'rgba(30, 41, 59, 0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            padding: '32px',
          }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>
            Workout History
          </h2>

          {workouts.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '32px' }}>
              No workouts logged yet. Start tracking your fitness!
            </p>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {workouts.map((workout, index) => (
                <motion.div
                  key={workout.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  style={{
                    background: 'rgba(15, 23, 42, 0.4)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: `1px solid ${typeColors[workout.workout_type]}40`,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '150px',
                    height: '150px',
                    background: `radial-gradient(circle, ${typeColors[workout.workout_type]}10, transparent)`,
                    borderRadius: '50%',
                  }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>
                        {workout.name}
                      </h3>

                      <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Clock size={16} color="var(--text-muted)" />
                          <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                            {workout.duration_minutes} min
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Flame size={16} color="var(--text-muted)" />
                          <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                            {workout.calories_burned} cal
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                        <span style={{
                          padding: '4px 12px',
                          background: `${typeColors[workout.workout_type]}20`,
                          color: typeColors[workout.workout_type],
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}>
                          {workout.workout_type}
                        </span>
                      </div>

                      {workout.notes && (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '8px' }}>
                          {workout.notes}
                        </p>
                      )}

                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '12px' }}>
                        {new Date(workout.completed_at).toLocaleString()}
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteWorkout(workout.id)}
                      style={{
                        padding: '8px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        borderRadius: '8px',
                        color: 'var(--error)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                      }}
                    >
                      <X size={18} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
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
                <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Log Workout</h2>
                <button onClick={() => setShowAddModal(false)} style={{ padding: '8px' }}>
                  <X size={24} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                    Workout Name *
                  </label>
                  <input
                    type="text"
                    value={newWorkout.name}
                    onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
                    placeholder="e.g., Morning Run, Chest Day"
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
                    Workout Type
                  </label>
                  <select
                    value={newWorkout.workout_type}
                    onChange={(e) => setNewWorkout({ ...newWorkout, workout_type: e.target.value })}
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
                    {workoutTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={newWorkout.duration_minutes}
                      onChange={(e) => setNewWorkout({ ...newWorkout, duration_minutes: parseInt(e.target.value) || 0 })}
                      min="1"
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
                      Calories Burned
                    </label>
                    <input
                      type="number"
                      value={newWorkout.calories_burned}
                      onChange={(e) => setNewWorkout({ ...newWorkout, calories_burned: parseInt(e.target.value) || 0 })}
                      min="0"
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
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                    Notes
                  </label>
                  <textarea
                    value={newWorkout.notes}
                    onChange={(e) => setNewWorkout({ ...newWorkout, notes: e.target.value })}
                    placeholder="How did it feel? Any achievements?"
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

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={addWorkout}
                  disabled={!newWorkout.name}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: newWorkout.name ? 'linear-gradient(135deg, #ef4444, #ec4899)' : 'rgba(148, 163, 184, 0.2)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600',
                    marginTop: '8px',
                  }}
                >
                  Log Workout
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
