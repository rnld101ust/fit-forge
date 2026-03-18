import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];
const MEAL_ICONS = { breakfast: '☀️', lunch: '🌞', dinner: '🌙', snack: '🍎' };

export default function Nutrition() {
  const userId = localStorage.getItem('userId');
  const [entries, setEntries] = useState([]);
  const [form,    setForm]    = useState({ mealType: 'breakfast', totalCalories: '', notes: '' });
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  const load = async () => {
    try {
      const { data } = await api.get(`/api/nutrition/diet/${userId}`);
      setEntries(data);
    } catch (_) { setEntries([]); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const addEntry = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/api/nutrition/diet', { ...form, userId, foodItems: [] });
      setForm({ mealType: 'breakfast', totalCalories: '', notes: '' });
      await load();
    } finally { setSaving(false); }
  };

  const totalToday = entries
    .filter((e) => isToday(e.date))
    .reduce((s, e) => s + (Number(e.totalCalories) || 0), 0);

  return (
    <>
      <Navbar />
      <div className="page">
        <h1 className="page-title">🥗 Nutrition Log</h1>
        <p className="page-subtitle">Track your meals and calorie intake.</p>

        {/* Today's summary */}
        <div className="card-grid" style={{ marginBottom: 28 }}>
          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-label">Today's Total</div>
            <div className="stat-value">{totalToday}<span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: 4 }}>kcal</span></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-label">Total Entries</div>
            <div className="stat-value">{entries.length}</div>
          </div>
        </div>

        {/* Log meal form */}
        <div className="card" style={{ marginBottom: 28 }}>
          <div className="section-header"><h2>Log a Meal</h2></div>
          <form onSubmit={addEntry}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Meal Type</label>
                <select className="select" value={form.mealType} onChange={set('mealType')}>
                  {MEAL_TYPES.map((t) => (
                    <option key={t} value={t}>{MEAL_ICONS[t]} {t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Calories (kcal)</label>
                <input className="input" type="number" placeholder="e.g. 650" value={form.totalCalories} onChange={set('totalCalories')} required />
              </div>
              <div className="form-group" style={{ flex: 2 }}>
                <label className="form-label">Notes (optional)</label>
                <input className="input" placeholder="e.g. Grilled chicken salad" value={form.notes} onChange={set('notes')} />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button className="btn btn-primary" type="submit" disabled={saving}>
                  {saving ? '…' : '+ Log'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Entries list */}
        {loading ? (
          <div className="loading"><div className="spinner" /></div>
        ) : entries.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🍽️</div>
            <p>No meals logged yet. Start tracking your nutrition above!</p>
          </div>
        ) : (
          entries.map((e) => (
            <div className="list-item" key={e._id}>
              <div className="list-item-left">
                <div className="list-item-icon icon-green">{MEAL_ICONS[e.mealType] ?? '🍽️'}</div>
                <div>
                  <div className="list-item-title" style={{ textTransform: 'capitalize' }}>{e.mealType}</div>
                  {e.notes && <div className="list-item-sub">{e.notes}</div>}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="chip chip-green">{e.totalCalories} kcal</span>
                <span className="chip">{new Date(e.date).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

function isToday(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getDate() === now.getDate() &&
         d.getMonth() === now.getMonth() &&
         d.getFullYear() === now.getFullYear();
}
