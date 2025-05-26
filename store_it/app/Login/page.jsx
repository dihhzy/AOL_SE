"use client";
import React, { useState } from "react";
import "./LoginPage.css";
import "../global.css";
import { useRouter } from "next/navigation";
import { useAtom } from 'jotai';
import { userAtom } from '../lib/userAtom';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [user, setUser] = useAtom(userAtom);

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      setUser(data.user); // ✅ simpan user ke Jotai
      router.push("/Dashboard"); // ✅ redirect ke Dashboard
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container animate-fade-in-up">
        <h1 className="login-title">
          Welcome Back<span className="highlight">.</span>
        </h1>
        <p className="login-subtitle">Please sign in to your account</p>
        <form className="login-form" onSubmit={handleLogin}>
          <label htmlFor="email" className="login-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="login-input"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password" className="login-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="login-input"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="button login-button">
            Sign In
          </button>
        </form>
        <p className="login-footer">
          Don't have an account?{" "}
          <a href="/Register" className="login-link">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
