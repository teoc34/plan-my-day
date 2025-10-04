import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Save, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function DailyReflections({ user }) {
  const [reflection, setReflection] = useState({
    date: new Date().toISOString().split('T')[0],
    mood_rating: 5,
    energy_level: 5,
    productivity_rating: 5,
    gratitude: '',
    accomplishments: '',
    challenges: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadTodayReflection();
  }, []);

  const loadTodayReflection = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('daily_reflections')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .maybeSingle();

    if (data) {
      setReflection({
        date: data.date,
        mood_rating: data.mood_rating || 5,
        energy_level: data.energy_level || 5,
        productivity_rating: data.productivity_rating || 5,
        gratitude: data.gratitude || '',
        accomplishments: data.accomplishments || '',
        challenges: data.challenges || '',
        notes: data.notes || '',
      });
      setSaved(true);
    }
  };

  const saveReflection = async () => {
    setLoading(true);
    setSaved(false);

    const { data: existing } = await supabase
      .from('daily_reflections')
      .select('id')
      .eq('user_id', user.id)
      .eq('date', reflection.date)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('daily_reflections')
        .update(reflection)
        .eq('id', existing.id);

      if (!error) setSaved(true);
    } else {
      const { error } = await supabase
        .from('daily_reflections')
        .insert([{ ...reflection, user_id: user.id }]);

      if (!error) setSaved(true);
    }

    setLoading(false);
  };

  const RatingSlider = ({ label, value, onChange, color }) => (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <label style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '500' }}>
          {label}
        </label>
        <span style={{
          fontSize: '18px',
          fontWeight: '700',
          color: color,
        }}>
          {value}/10
        </span>
      </div>
      <input
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        style={{
          width: '100%',
          cursor: 'pointer',
          accentColor: color,
        }}
      />
    </div>
  );

  return (
    <div style={{ padding: '32px', maxWidth: '900px', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <BookOpen size={32} color="#8b5cf6" />
          <h1 style={{ fontSize: '36px', fontWeight: '700' }}>Daily Reflection</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
          Take a moment to reflect on your day
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(30, 41, 59, 0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            padding: '32px',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <Calendar size={20} color="var(--text-secondary)" />
            <span style={{ fontSize: '18px', fontWeight: '600' }}>
              {new Date(reflection.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          <RatingSlider
            label="How is your mood today?"
            value={reflection.mood_rating}
            onChange={(val) => setReflection({ ...reflection, mood_rating: val })}
            color="#ec4899"
          />

          <RatingSlider
            label="What's your energy level?"
            value={reflection.energy_level}
            onChange={(val) => setReflection({ ...reflection, energy_level: val })}
            color="#f59e0b"
          />

          <RatingSlider
            label="How productive were you?"
            value={reflection.productivity_rating}
            onChange={(val) => setReflection({ ...reflection, productivity_rating: val })}
            color="#10b981"
          />

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: 'var(--text-secondary)',
              fontSize: '14px',
              fontWeight: '500',
            }}>
              What are you grateful for today?
            </label>
            <textarea
              value={reflection.gratitude}
              onChange={(e) => setReflection({ ...reflection, gratitude: e.target.value })}
              placeholder="List things you're thankful for..."
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
                lineHeight: '1.5',
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: 'var(--text-secondary)',
              fontSize: '14px',
              fontWeight: '500',
            }}>
              What did you accomplish today?
            </label>
            <textarea
              value={reflection.accomplishments}
              onChange={(e) => setReflection({ ...reflection, accomplishments: e.target.value })}
              placeholder="Celebrate your wins, big or small..."
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
                lineHeight: '1.5',
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: 'var(--text-secondary)',
              fontSize: '14px',
              fontWeight: '500',
            }}>
              What challenges did you face?
            </label>
            <textarea
              value={reflection.challenges}
              onChange={(e) => setReflection({ ...reflection, challenges: e.target.value })}
              placeholder="Acknowledge difficulties and lessons learned..."
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
                lineHeight: '1.5',
              }}
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: 'var(--text-secondary)',
              fontSize: '14px',
              fontWeight: '500',
            }}>
              Additional thoughts or notes
            </label>
            <textarea
              value={reflection.notes}
              onChange={(e) => setReflection({ ...reflection, notes: e.target.value })}
              placeholder="Any other reflections or insights..."
              rows={4}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '12px',
                color: 'var(--text-primary)',
                fontSize: '16px',
                resize: 'vertical',
                lineHeight: '1.5',
              }}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={saveReflection}
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              borderRadius: '12px',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              opacity: loading ? 0.7 : 1,
            }}
          >
            <Save size={20} />
            {loading ? 'Saving...' : saved ? 'Saved!' : 'Save Reflection'}
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2))',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center',
          }}
        >
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
            Daily reflection helps improve self-awareness, manage stress, and track personal growth over time.
            Take a few minutes each day to check in with yourself.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
