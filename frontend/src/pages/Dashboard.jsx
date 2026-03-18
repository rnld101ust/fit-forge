import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    api.get(`/dashboard/${userId}`)
      .then(({ data }) => setData(data))
      .catch(console.error);
  }, [userId]);

  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  if (!data) return <p>Loading dashboard...</p>;

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>🏋️ FitForge Dashboard</h1>
        <button onClick={logout}>Logout</button>
      </div>
      <nav style={{ marginBottom: 24 }}>
        <Link to="/workout" style={{ marginRight: 16 }}>Workouts</Link>
        <Link to="/nutrition" style={{ marginRight: 16 }}>Nutrition</Link>
        <Link to="/progress">Progress</Link>
      </nav>

      <section>
        <h2>Profile</h2>
        {data.profile ? (
          <p>{data.profile.name} | Goal: {data.profile.fitnessGoal} | Weight: {data.profile.weightKg}kg</p>
        ) : <p>No profile yet. <Link to="/profile">Set up profile</Link></p>}
      </section>

      <section>
        <h2>Workout Plans ({data.workouts.length})</h2>
        {data.workouts.map((w) => <p key={w._id}>📋 {w.title} — {w.daysPerWeek} days/week</p>)}
      </section>

      <section>
        <h2>Recent Diet Entries ({data.diet.length})</h2>
        {data.diet.slice(0, 3).map((d) => (
          <p key={d._id}>🥗 {d.mealType} — {d.totalCalories} kcal ({new Date(d.date).toLocaleDateString()})</p>
        ))}
      </section>

      <section>
        <h2>Recent Progress ({data.progress.length})</h2>
        {data.progress.slice(0, 3).map((p) => (
          <p key={p._id}>📊 {new Date(p.date).toLocaleDateString()} — {p.weightKg}kg</p>
        ))}
      </section>
    </div>
  );
}
