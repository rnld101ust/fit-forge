import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Workout() {
  const userId = localStorage.getItem('userId');
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', daysPerWeek: 3 });

  const load = () =>
    api.get(`/dashboard/${userId}`).then(({ data }) => setPlans(data.workouts));

  useEffect(() => { load(); }, []);

  const addPlan = async (e) => {
    e.preventDefault();
    await api.post('/workout/plans', { ...form, userId });
    setForm({ title: '', description: '', daysPerWeek: 3 });
    load();
  };

  const deletePlan = async (id) => {
    await api.delete(`/workout/plans/${id}`);
    load();
  };

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <Link to="/">← Back</Link>
      <h1>💪 Workout Plans</h1>
      <form onSubmit={addPlan} style={{ marginBottom: 24 }}>
        <input placeholder="Plan title" value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          style={{ marginRight: 8, padding: 8 }} required />
        <input type="number" placeholder="Days/week" value={form.daysPerWeek}
          onChange={(e) => setForm({ ...form, daysPerWeek: e.target.value })}
          style={{ width: 100, marginRight: 8, padding: 8 }} />
        <button type="submit">Add Plan</button>
      </form>
      {plans.map((p) => (
        <div key={p._id} style={{ border: '1px solid #ccc', padding: 12, marginBottom: 8, borderRadius: 4 }}>
          <strong>{p.title}</strong> — {p.daysPerWeek} days/week
          <button onClick={() => deletePlan(p._id)} style={{ marginLeft: 16, color: 'red' }}>Delete</button>
        </div>
      ))}
    </div>
  );
}
