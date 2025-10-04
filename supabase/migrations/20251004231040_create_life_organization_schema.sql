/*
  # LifeFlow - Complete Life Organization System

  ## Overview
  Creates a comprehensive database schema for tracking all aspects of life organization
  designed specifically for ADHD users. This migration sets up tables for water tracking,
  habits, career goals, health metrics, gym activities, and more.

  ## 1. New Tables

  ### `profiles`
  - `id` (uuid, primary key) - Links to auth.users
  - `email` (text) - User email
  - `full_name` (text) - User's full name
  - `created_at` (timestamptz) - Account creation time
  - `updated_at` (timestamptz) - Last profile update

  ### `water_intake`
  - `id` (uuid, primary key) - Unique record ID
  - `user_id` (uuid, foreign key) - Links to profiles
  - `amount_ml` (integer) - Amount of water in milliliters
  - `logged_at` (timestamptz) - When water was consumed
  - `created_at` (timestamptz) - Record creation time

  ### `habits`
  - `id` (uuid, primary key) - Unique habit ID
  - `user_id` (uuid, foreign key) - Links to profiles
  - `name` (text) - Habit name
  - `description` (text) - Habit description
  - `category` (text) - Category (health, productivity, wellness, etc.)
  - `target_frequency` (text) - How often (daily, weekly, monthly)
  - `color` (text) - Visual color code for the habit
  - `icon` (text) - Icon identifier
  - `is_active` (boolean) - Whether habit is currently tracked
  - `created_at` (timestamptz) - Habit creation time

  ### `habit_logs`
  - `id` (uuid, primary key) - Unique log ID
  - `habit_id` (uuid, foreign key) - Links to habits
  - `user_id` (uuid, foreign key) - Links to profiles
  - `completed` (boolean) - Whether habit was completed
  - `notes` (text) - Optional notes about the habit completion
  - `logged_date` (date) - Date of the habit log
  - `created_at` (timestamptz) - Log creation time

  ### `career_goals`
  - `id` (uuid, primary key) - Unique goal ID
  - `user_id` (uuid, foreign key) - Links to profiles
  - `title` (text) - Goal title
  - `description` (text) - Detailed goal description
  - `category` (text) - Goal category (skills, promotion, project, etc.)
  - `status` (text) - Current status (not_started, in_progress, completed, paused)
  - `priority` (text) - Priority level (low, medium, high, urgent)
  - `target_date` (date) - Target completion date
  - `progress_percentage` (integer) - Progress from 0-100
  - `created_at` (timestamptz) - Goal creation time
  - `updated_at` (timestamptz) - Last update time

  ### `career_milestones`
  - `id` (uuid, primary key) - Unique milestone ID
  - `goal_id` (uuid, foreign key) - Links to career_goals
  - `user_id` (uuid, foreign key) - Links to profiles
  - `title` (text) - Milestone title
  - `description` (text) - Milestone description
  - `completed` (boolean) - Whether milestone is completed
  - `completed_at` (timestamptz) - When milestone was completed
  - `created_at` (timestamptz) - Milestone creation time

  ### `health_metrics`
  - `id` (uuid, primary key) - Unique metric ID
  - `user_id` (uuid, foreign key) - Links to profiles
  - `metric_type` (text) - Type of metric (weight, sleep, mood, energy, etc.)
  - `value` (numeric) - Numeric value of the metric
  - `unit` (text) - Unit of measurement
  - `notes` (text) - Additional notes
  - `recorded_at` (timestamptz) - When metric was recorded
  - `created_at` (timestamptz) - Record creation time

  ### `gym_workouts`
  - `id` (uuid, primary key) - Unique workout ID
  - `user_id` (uuid, foreign key) - Links to profiles
  - `name` (text) - Workout name
  - `workout_type` (text) - Type (strength, cardio, flexibility, sports)
  - `duration_minutes` (integer) - Workout duration
  - `calories_burned` (integer) - Estimated calories
  - `notes` (text) - Workout notes
  - `completed_at` (timestamptz) - When workout was completed
  - `created_at` (timestamptz) - Record creation time

  ### `gym_exercises`
  - `id` (uuid, primary key) - Unique exercise ID
  - `workout_id` (uuid, foreign key) - Links to gym_workouts
  - `user_id` (uuid, foreign key) - Links to profiles
  - `exercise_name` (text) - Name of exercise
  - `sets` (integer) - Number of sets
  - `reps` (integer) - Number of repetitions
  - `weight_kg` (numeric) - Weight used
  - `notes` (text) - Exercise notes
  - `created_at` (timestamptz) - Record creation time

  ### `daily_reflections`
  - `id` (uuid, primary key) - Unique reflection ID
  - `user_id` (uuid, foreign key) - Links to profiles
  - `date` (date) - Reflection date
  - `mood_rating` (integer) - Mood rating (1-10)
  - `energy_level` (integer) - Energy level (1-10)
  - `productivity_rating` (integer) - Productivity rating (1-10)
  - `gratitude` (text) - Things user is grateful for
  - `accomplishments` (text) - Daily accomplishments
  - `challenges` (text) - Challenges faced
  - `notes` (text) - Additional notes
  - `created_at` (timestamptz) - Reflection creation time

  ## 2. Security
  - Enable Row Level Security (RLS) on all tables
  - Add policies for authenticated users to manage their own data only
  - Each table has SELECT, INSERT, UPDATE, and DELETE policies

  ## 3. Indexes
  - Add indexes on foreign keys for better query performance
  - Add indexes on date/timestamp columns for time-based queries
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create water_intake table
CREATE TABLE IF NOT EXISTS water_intake (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount_ml integer NOT NULL DEFAULT 250,
  logged_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE water_intake ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own water intake"
  ON water_intake FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own water intake"
  ON water_intake FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own water intake"
  ON water_intake FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own water intake"
  ON water_intake FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_water_intake_user_id ON water_intake(user_id);
CREATE INDEX IF NOT EXISTS idx_water_intake_logged_at ON water_intake(logged_at);

-- Create habits table
CREATE TABLE IF NOT EXISTS habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  category text DEFAULT 'general',
  target_frequency text DEFAULT 'daily',
  color text DEFAULT '#6366f1',
  icon text DEFAULT 'target',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE habits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own habits"
  ON habits FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own habits"
  ON habits FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habits"
  ON habits FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own habits"
  ON habits FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);

-- Create habit_logs table
CREATE TABLE IF NOT EXISTS habit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id uuid NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  notes text,
  logged_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own habit logs"
  ON habit_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own habit logs"
  ON habit_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habit logs"
  ON habit_logs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own habit logs"
  ON habit_logs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_habit_logs_user_id ON habit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_habit_id ON habit_logs(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_logged_date ON habit_logs(logged_date);

-- Create career_goals table
CREATE TABLE IF NOT EXISTS career_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  category text DEFAULT 'general',
  status text DEFAULT 'not_started',
  priority text DEFAULT 'medium',
  target_date date,
  progress_percentage integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE career_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own career goals"
  ON career_goals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own career goals"
  ON career_goals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own career goals"
  ON career_goals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own career goals"
  ON career_goals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_career_goals_user_id ON career_goals(user_id);

-- Create career_milestones table
CREATE TABLE IF NOT EXISTS career_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid NOT NULL REFERENCES career_goals(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE career_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own career milestones"
  ON career_milestones FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own career milestones"
  ON career_milestones FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own career milestones"
  ON career_milestones FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own career milestones"
  ON career_milestones FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_career_milestones_user_id ON career_milestones(user_id);
CREATE INDEX IF NOT EXISTS idx_career_milestones_goal_id ON career_milestones(goal_id);

-- Create health_metrics table
CREATE TABLE IF NOT EXISTS health_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  metric_type text NOT NULL,
  value numeric NOT NULL,
  unit text,
  notes text,
  recorded_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE health_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own health metrics"
  ON health_metrics FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health metrics"
  ON health_metrics FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own health metrics"
  ON health_metrics FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own health metrics"
  ON health_metrics FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_health_metrics_user_id ON health_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_health_metrics_recorded_at ON health_metrics(recorded_at);

-- Create gym_workouts table
CREATE TABLE IF NOT EXISTS gym_workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  workout_type text DEFAULT 'general',
  duration_minutes integer DEFAULT 0,
  calories_burned integer DEFAULT 0,
  notes text,
  completed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gym_workouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own gym workouts"
  ON gym_workouts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own gym workouts"
  ON gym_workouts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own gym workouts"
  ON gym_workouts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own gym workouts"
  ON gym_workouts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_gym_workouts_user_id ON gym_workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_gym_workouts_completed_at ON gym_workouts(completed_at);

-- Create gym_exercises table
CREATE TABLE IF NOT EXISTS gym_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id uuid NOT NULL REFERENCES gym_workouts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  exercise_name text NOT NULL,
  sets integer DEFAULT 0,
  reps integer DEFAULT 0,
  weight_kg numeric DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gym_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own gym exercises"
  ON gym_exercises FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own gym exercises"
  ON gym_exercises FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own gym exercises"
  ON gym_exercises FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own gym exercises"
  ON gym_exercises FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_gym_exercises_user_id ON gym_exercises(user_id);
CREATE INDEX IF NOT EXISTS idx_gym_exercises_workout_id ON gym_exercises(workout_id);

-- Create daily_reflections table
CREATE TABLE IF NOT EXISTS daily_reflections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date date DEFAULT CURRENT_DATE,
  mood_rating integer,
  energy_level integer,
  productivity_rating integer,
  gratitude text,
  accomplishments text,
  challenges text,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE daily_reflections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own daily reflections"
  ON daily_reflections FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily reflections"
  ON daily_reflections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily reflections"
  ON daily_reflections FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own daily reflections"
  ON daily_reflections FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_daily_reflections_user_id ON daily_reflections(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_reflections_date ON daily_reflections(date);