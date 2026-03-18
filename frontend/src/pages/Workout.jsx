import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api';

export default function Workout() {
  const userId = localStorage.getItem('userId');
  const [plans,   setPlans]   = useState([]);
  const [form,    setForm]    = useState({ title: '', description: '', daysPerWeek: 3 });
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  const load = async () => {
    try {
      const { data } = await api.get(`/api/workout/plans/${userId}`);
      setPlans(data);
    } catch (_) { setPlans([]); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const addPlan = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/api/workout/plans', { ...form, userId });
      setForm({ title: '', description: '', daysPerWeek: 3 });
      await load();
    } finally { setSaving(false); }
  };

  const deletePlan = async (id) => {
    await api.delete(`/api/workout/plans/${id}`);
    setPlans((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <>
      <Navbar />
      <div className="page">
        <h1 className="page-title">💪 Workout Plans</h1>
        <p className="page-subtitle">Build and manage your training schedule.</p>

        {/* Add form */}
        <div className="card" style={{ marginBottom: 28 }}>
          <div className="section-header"><h2>New Plan</h2></div>
          <form onSubmit={addPlan}>
            <div className="form-row">
              <div className="form-group" style={{ flex: 3 }}>
                <label className="form-label">Plan Title</label>
                <input className="input" placeholder="e.g. Upper Body Strength" value={form.title} onChange={set('title')} required />
              </div>
              <div className="form-group" style={{ flex: 1, minWidth: 100 }}>
                <label className="form-label">Days / Week</label>
                <input className="input" type="number" min="1" max="7" value={form.daysPerWeek} onChange={set('daysPerWeek')} />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button className="btn btn-primary" type="submit" disabled={saving}>
                  {saving ? '…' : '+ Add'}
                </button>
              </div>
            </div>
            <div className="form-group" style={{ marginTop: 12 }}>
              <label className="form-label">Description (optional)</label>
              <input className="input" placeholder="Brief description…" value={form.description} onChange={set('description')} />
            </div>
          </form>
        </div>

        {/* Plans list */}
        {loading ? (
          <div className="loading"><div className="spinner" /></div>
        ) : plans.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🏃</div>
            <p>No plans yet. Create your first workout plan above!</p>
          </div>
        ) : (
          plans.map((p) => (
            <div className="list-item" key={p._id}>
              <div className="list-item-left">
                <div className="list-item-icon icon-purple">🏋️</div>
                <div>
                  <div className="list-item-title">{p.title}</div>
                  {p.description && <div className="list-item-sub">{p.description}</div>}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="chip chip-accent">{p.daysPerWeek} days/wk</span>
                <button className="btn btn-danger btn-sm" onClick={() => deletePlan(p._id)}>✕ Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
