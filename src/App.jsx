import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import AuthForm from './components/AuthForm';
import Sidebar from './components/Sidebar';
import Background3D from './components/Background3D';
import Dashboard from './pages/Dashboard';
import WaterTracker from './pages/WaterTracker';
import HabitsTracker from './pages/HabitsTracker';
import CareerTracker from './pages/CareerTracker';
import HealthTracker from './pages/HealthTracker';
import GymTracker from './pages/GymTracker';
import DailyReflections from './pages/DailyReflections';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setUser(session?.user || null);
        setLoading(false);
      })();
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard user={user} />;
      case 'water':
        return <WaterTracker user={user} />;
      case 'habits':
        return <HabitsTracker user={user} />;
      case 'career':
        return <CareerTracker user={user} />;
      case 'health':
        return <HealthTracker user={user} />;
      case 'gym':
        return <GymTracker user={user} />;
      case 'reflections':
        return <DailyReflections user={user} />;
      default:
        return <Dashboard user={user} />;
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      }}>
        <div style={{
          fontSize: '24px',
          fontWeight: '600',
          color: 'var(--text-primary)',
        }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onAuthSuccess={checkUser} />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      <Background3D />
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onLogout={handleLogout}
      />
      <main style={{
        flex: 1,
        overflowY: 'auto',
        position: 'relative',
        zIndex: 1,
      }}>
        {renderSection()}
      </main>
    </div>
  );
}
