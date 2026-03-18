import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Progress() {
  const userId = localStorage.getItem('userId');
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState({ weightKg: '', notes: '' });

  const load = () =>
    api.get(`/dashboard/${userId}`).then(({ data }) => setLogs(data.progress));

  useEffect(() => { load(); }, []);

  const logProgress = async (e) => {
    e.preventDefault();
    await api.post('/progress/log', { ...form, userId, workoutCompleted: true });
    setForm({ weightKg: '', notes: '' });
    load();
  };

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <Link to="/">← Back</Link>
      <h1>📊 Progress Tracker</h1>
      <p style={{ color: '#666', fontSize: 13 }}>
        Each entry you log triggers a Redis event consumed by the Notification Service.
        Check Docker logs for [notification-service] output!
      </p>
      <form onSubmit={logProgress} style={{ marginBottom: 24 }}>
        <input type="number" step="0.1" placeholder="Weight (kg)" value={form.weightKg}
          onChange={(e) => setForm({ ...form, weightKg: e.target.value })}
          style={{ marginRight: 8, padding: 8, width: 140 }} required />
        <input placeholder="Notes (optional)" value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          style={{ marginRight: 8, padding: 8 }} />
        <button type="submit">Log Progress</button>
      </form>
      {logs.map((l) => (
        <div key={l._id} style={{ border: '1px solid #ccc', padding: 12, marginBottom: 8, borderRadius: 4 }}>
          <strong>{new Date(l.date).toLocaleDateString()}</strong> — {l.weightKg} kg
          {l.notes && <span style={{ marginLeft: 16, color: '#666' }}>{l.notes}</span>}
        </div>
      ))}
    </div>
  );
}
