import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api';

export default function Dashboard() {
  const userId = localStorage.getItem('userId');
  const [profile,  setProfile]  = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [diet,     setDiet]     = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const load = async () => {
      const [p, w, d, pr] = await Promise.allSettled([
        api.get(`/api/users/${userId}`),
        api.get(`/api/workout/plans/${userId}`),
        api.get(`/api/nutrition/diet/${userId}`),
        api.get(`/api/progress/summary/${userId}`),
      ]);
      if (p.status  === 'fulfilled') setProfile(p.value.data);
      if (w.status  === 'fulfilled') setWorkouts(w.value.data);
      if (d.status  === 'fulfilled') setDiet(d.value.data);
      if (pr.status === 'fulfilled') setProgress(pr.value.data);
      setLoading(false);
    };
    load();
  }, [userId]);

  if (loading) return (
    <>
      <Navbar />
      <div className="loading">
        <div className="spinner" />
        <span>Loading your dashboard…</span>
      </div>
    </>
  );

  const latestWeight = progress[0]?.weightKg ?? '–';
  const totalCalories = diet.slice(0, 1).reduce((s, d) => s + (d.totalCalories || 0), 0);

  return (
    <>
      <Navbar />
      <div className="page">
        {/* Greeting */}
        <h1 className="page-title">
          Good {getGreeting()}, {profile?.name?.split(' ')[0] ?? 'Athlete'} 👋
        </h1>
        <p className="page-subtitle">Here's your fitness overview for today.</p>

        {/* Stats row */}
        <div className="card-grid" style={{ marginBottom: 36 }}>
          <div className="stat-card">
            <div className="stat-icon">💪</div>
            <div className="stat-label">Workout Plans</div>
            <div className="stat-value">{workouts.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🥗</div>
            <div className="stat-label">Today's Calories</div>
            <div className="stat-value">{totalCalories > 0 ? `${totalCalories}` : '–'}<span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: 4 }}>kcal</span></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚖️</div>
            <div className="stat-label">Latest Weight</div>
            <div className="stat-value">{latestWeight}<span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: 4 }}>kg</span></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-label">Progress Logs</div>
            <div className="stat-value">{progress.length}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Workout Plans */}
          <div className="card">
            <div className="section-header">
              <h2>💪 Workout Plans</h2>
              <span className="badge">{workouts.length}</span>
            </div>
            {workouts.length === 0
              ? <EmptyState icon="🏃" text="No workout plans yet. Add one!" />
              : workouts.slice(0, 4).map((w) => (
                  <div className="list-item" key={w._id}>
                    <div className="list-item-left">
                      <div className="list-item-icon icon-purple">🏋️</div>
                      <div>
                        <div className="list-item-title">{w.title}</div>
                        <div className="list-item-sub">{w.daysPerWeek} days / week</div>
                      </div>
                    </div>
                    <span className="chip chip-accent">{w.daysPerWeek}×</span>
                  </div>
                ))
            }
          </div>

          {/* Recent Nutrition */}
          <div className="card">
            <div className="section-header">
              <h2>🥗 Recent Meals</h2>
              <span className="badge">{diet.length}</span>
            </div>
            {diet.length === 0
              ? <EmptyState icon="🍽️" text="No meals logged yet." />
              : diet.slice(0, 4).map((d) => (
                  <div className="list-item" key={d._id}>
                    <div className="list-item-left">
                      <div className="list-item-icon icon-green">{mealIcon(d.mealType)}</div>
                      <div>
                        <div className="list-item-title" style={{ textTransform: 'capitalize' }}>{d.mealType}</div>
                        <div className="list-item-sub">{new Date(d.date).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <span className="chip chip-green">{d.totalCalories} kcal</span>
                  </div>
                ))
            }
          </div>
        </div>

        {/* Profile banner */}
        {profile && (
          <div className="card" style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,var(--accent),var(--accent2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
              {profile.name?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div>
              <div style={{ fontWeight: 700 }}>{profile.name}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Goal: <span style={{ color: 'var(--accent2)' }}>{profile.fitnessGoal ?? 'Not set'}</span>
                {profile.weightKg && <> &nbsp;·&nbsp; Weight: <strong>{profile.weightKg} kg</strong></>}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function EmptyState({ icon, text }) {
  return (
    <div className="empty">
      <div className="empty-icon">{icon}</div>
      <p>{text}</p>
    </div>
  );
}

function mealIcon(type) {
  return { breakfast: '☀️', lunch: '🌞', dinner: '🌙', snack: '🍎' }[type] ?? '🍽️';
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
