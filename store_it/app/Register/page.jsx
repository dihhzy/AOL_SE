'use client';
import React, { useState } from 'react';
import './RegisterPage.css';
import '../global.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (res.ok) {
      alert('Registration successful!');
      window.location.href = '/Login';
    } else {
      alert(`Error: ${data.message}`);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container animate-fade-in-up">
        <h1 className="register-title">Create Account<span className="highlight">.</span></h1>
        <p className="register-subtitle">Sign up to get started</p>
        <form className="register-form" onSubmit={handleSubmit}>
          <label htmlFor="username" className="register-label">Username</label>
          <input type="text" id="username" name="username" className="register-input" required onChange={handleChange} />

          <label htmlFor="email" className="register-label">Email</label>
          <input type="email" id="email" name="email" className="register-input" required onChange={handleChange} />

          <label htmlFor="password" className="register-label">Password</label>
          <input type="password" id="password" name="password" className="register-input" required onChange={handleChange} />

          <button type="submit" className="button register-button">Register</button>
        </form>
        <p className="register-footer">
          Already have an account? <a href="/Login" className="register-link">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
