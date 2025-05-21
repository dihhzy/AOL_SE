import React, { useState } from 'react';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok) {
        alert('Login sukses!');
        console.log('User login:', data.user);
        // Redirect atau set session di sini
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error('Login gagal:', err);
      alert('Terjadi kesalahan saat login.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container animate-fade-in-up">
        <h1 className="login-title">Welcome Back<span className="highlight">.</span></h1>
        <p className="login-subtitle">Please sign in to your account</p>
        <form className="login-form" onSubmit={handleLogin}>
          <label htmlFor="email" className="login-label">Email</label>
          <input type="email" id="email" className="login-input" placeholder="you@example.com" required
            value={email} onChange={(e) => setEmail(e.target.value)} />

          <label htmlFor="password" className="login-label">Password</label>
          <input type="password" id="password" className="login-input" placeholder="••••••••" required
            value={password} onChange={(e) => setPassword(e.target.value)} />

          <button type="submit" className="button login-button">Sign In</button>
        </form>
        <p className="login-footer">
          Don't have an account? <a href="/RegisterPage" className="login-link">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
