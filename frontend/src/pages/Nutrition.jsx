import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Nutrition() {
  const userId = localStorage.getItem('userId');
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ mealType: 'breakfast', totalCalories: '', notes: '' });

  const load = () =>
    api.get(`/dashboard/${userId}`).then(({ data }) => setEntries(data.diet));

  useEffect(() => { load(); }, []);

  const addEntry = async (e) => {
    e.preventDefault();
    await api.post('/nutrition/diet', { ...form, userId, foodItems: [] });
    setForm({ mealType: 'breakfast', totalCalories: '', notes: '' });
    load();
  };

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <Link to="/">← Back</Link>
      <h1>🥗 Nutrition Log</h1>
      <form onSubmit={addEntry} style={{ marginBottom: 24 }}>
        <select value={form.mealType} onChange={(e) => setForm({ ...form, mealType: e.target.value })}
          style={{ marginRight: 8, padding: 8 }}>
          {['breakfast', 'lunch', 'dinner', 'snack'].map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <input type="number" placeholder="Total calories" value={form.totalCalories}
          onChange={(e) => setForm({ ...form, totalCalories: e.target.value })}
          style={{ marginRight: 8, padding: 8, width: 140 }} required />
        <button type="submit">Log Meal</button>
      </form>
      {entries.map((e) => (
        <div key={e._id} style={{ border: '1px solid #ccc', padding: 12, marginBottom: 8, borderRadius: 4 }}>
          <strong>{e.mealType}</strong> — {e.totalCalories} kcal
          <span style={{ marginLeft: 16, color: '#666', fontSize: 12 }}>
            {new Date(e.date).toLocaleDateString()}
          </span>
        </div>
      ))}
    </div>
  );
}
