import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api';

export default function Progress() {
  const userId = localStorage.getItem('userId');
  const [logs,    setLogs]    = useState([]);
  const [form,    setForm]    = useState({ weightKg: '', notes: '' });
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  const load = async () => {
    try {
      const { data } = await api.get(`/api/progress/summary/${userId}`);
      setLogs(data);
    } catch (_) { setLogs([]); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const logProgress = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/api/progress/log', { ...form, userId, workoutCompleted: true });
      setForm({ weightKg: '', notes: '' });
      await load();
    } finally { setSaving(false); }
  };

  const latestWeight = logs[0]?.weightKg;
  const firstWeight  = logs.length > 1 ? logs[logs.length - 1]?.weightKg : null;
  const weightDelta  = latestWeight && firstWeight
    ? (latestWeight - firstWeight).toFixed(1)
    : null;

  return (
    <>
      <Navbar />
      <div className="page">
        <h1 className="page-title">📊 Progress Tracker</h1>
        <p className="page-subtitle">Log your weight and see your journey over time.</p>

        {/* Stats */}
        <div className="card-grid" style={{ marginBottom: 28 }}>
          <div className="stat-card">
            <div className="stat-icon">⚖️</div>
            <div className="stat-label">Current Weight</div>
            <div className="stat-value">{latestWeight ?? '–'}<span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: 4 }}>kg</span></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">{weightDelta < 0 ? '📉' : weightDelta > 0 ? '📈' : '📊'}</div>
            <div className="stat-label">Total Change</div>
            <div className="stat-value" style={{ color: weightDelta < 0 ? 'var(--accent2)' : weightDelta > 0 ? 'var(--danger)' : undefined }}>
              {weightDelta !== null ? `${weightDelta > 0 ? '+' : ''}${weightDelta}` : '–'}
              {weightDelta !== null && <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: 4 }}>kg</span>}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-label">Entries Logged</div>
            <div className="stat-value">{logs.length}</div>
          </div>
        </div>

        {/* Log form */}
        <div className="card" style={{ marginBottom: 28 }}>
          <div className="section-header"><h2>Log Today's Progress</h2></div>
          <form onSubmit={logProgress}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Weight (kg)</label>
                <input className="input" type="number" step="0.1" placeholder="e.g. 74.5" value={form.weightKg} onChange={set('weightKg')} required />
              </div>
              <div className="form-group" style={{ flex: 3 }}>
                <label className="form-label">Notes (optional)</label>
                <input className="input" placeholder="e.g. Felt strong, slept 8h" value={form.notes} onChange={set('notes')} />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button className="btn btn-primary" type="submit" disabled={saving}>
                  {saving ? '…' : '+ Log'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Weight bar chart */}
        {logs.length > 1 && (
          <div className="card" style={{ marginBottom: 28 }}>
            <div className="section-header"><h2>Weight Trend</h2></div>
            <MiniChart logs={logs} />
          </div>
        )}

        {/* Entries list */}
        {loading ? (
          <div className="loading"><div className="spinner" /></div>
        ) : logs.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">📊</div>
            <p>No progress logged yet. Start tracking above!</p>
          </div>
        ) : (
          logs.map((l, i) => (
            <div className="list-item" key={l._id}>
              <div className="list-item-left">
                <div className="list-item-icon icon-orange">⚖️</div>
                <div>
                  <div className="list-item-title">{l.weightKg} kg</div>
                  {l.notes && <div className="list-item-sub">{l.notes}</div>}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {i === 0 && <span className="chip chip-green">Latest</span>}
                <span className="chip">{new Date(l.date).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

function MiniChart({ logs }) {
  const values  = [...logs].reverse().map((l) => l.weightKg);
  const min     = Math.min(...values);
  const max     = Math.max(...values);
  const range   = max - min || 1;

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80 }}>
      {values.map((v, i) => {
        const pct = ((v - min) / range) * 70 + 10;
        return (
          <div key={i} title={`${v} kg`} style={{ flex: 1, maxWidth: 40 }}>
            <div style={{
              height: `${pct}%`,
              minHeight: 6,
              background: `linear-gradient(180deg, var(--accent), var(--accent2))`,
              borderRadius: '4px 4px 0 0',
              transition: 'height 0.4s ease',
            }} />
          </div>
        );
      })}
    </div>
  );
}
