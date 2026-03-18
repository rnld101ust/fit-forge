import { useState } from 'react';
import api from '../api';

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const endpoint = isSignup ? '/auth/signup' : '/auth/login';
      const { data } = await api.post(endpoint, form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', fontFamily: 'sans-serif' }}>
      <h1>🏋️ FitForge</h1>
      <h2>{isSignup ? 'Create Account' : 'Login'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        {isSignup && (
          <input placeholder="Name" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={{ display: 'block', width: '100%', marginBottom: 8, padding: 8 }} />
        )}
        <input type="email" placeholder="Email" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={{ display: 'block', width: '100%', marginBottom: 8, padding: 8 }} />
        <input type="password" placeholder="Password" value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          style={{ display: 'block', width: '100%', marginBottom: 8, padding: 8 }} />
        <button type="submit" style={{ padding: '8px 16px' }}>
          {isSignup ? 'Sign Up' : 'Login'}
        </button>
      </form>
      <p>
        {isSignup ? 'Already have an account?' : "Don't have an account?"}
        <button onClick={() => setIsSignup(!isSignup)} style={{ marginLeft: 8 }}>
          {isSignup ? 'Login' : 'Sign Up'}
        </button>
      </p>
    </div>
  );
}
