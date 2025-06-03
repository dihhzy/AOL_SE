"use client"

import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import './ShowAllUsers.css'
import "../global.css";

export default function ShowAllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('/api/users');
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        setUsers(data);
        console.log(data)
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  return (
    <div className="app-layout">
      <Navbar />

      <div className="main-content">
          <Sidebar />

    <div className="app-wrapper">
      <div className="container" style={{ paddingTop: '1rem', paddingBottom: '5rem' }}>
        <h1 className="section-title" style={{ marginBottom: '2rem', color: 'white' }}>
          Users List
        </h1>

        {loading && <p style={{ color: '#9ca3af' }}>Loading users...</p>}
        {error && <p style={{ color: '#f87171' }}>Error: {error}</p>}

        {!loading && !error && users.length === 0 && (
          <p style={{ color: '#9ca3af' }}>No users found.</p>
        )}

        {!loading && !error && users.length > 0 && (
          <table style={{ width: '220%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #374151' }}>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.UserID} style={trStyle}>
                  <td style={tdStyle}>{user.UserID}</td>
                  <td style={tdStyle}>{user.Username}</td>
                  <td style={tdStyle}>{user.Email}</td>
                  <td style={tdStyle}>{user.Role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
    </div>
    </div>
  );
}

const thStyle = {
  textAlign: 'left',
  padding: '12px 16px',
  color: '#38bdf8', // text-sky-400
  fontWeight: '600',
  backgroundColor: '#1f2937', // bg-gray-800
};

const tdStyle = {
  padding: '12px 16px',
  borderBottom: '1px solid #374151', // border-gray-700
  color: '#d1d5db', // text-gray-300
};

const trStyle = {
  backgroundColor: '#111827', // bg-gray-900
};
