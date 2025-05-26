"use client";
import React, { useEffect, useState } from 'react';
import './Navbar.css';

import {
    FaSearch, FaBell
} from 'react-icons/fa';

import { useAtom, useSetAtom } from 'jotai';

import { userAtom } from '../lib/userAtom';



const Navbar = () => {
    const [user] = useAtom(userAtom);
    const setUser = useSetAtom(userAtom); // ✅ tambahkan ini
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch('/api/me')
            .then((res) => res.json())
            .then((data) => {
                if (data) {
                    console.log("data", data)
                    setUser(data); // ✅ set hasil API ke Jotai
                } else {
                    console.log('User tidak login', data);
                }
            })
            .catch((err) => {
                console.error('Gagal ambil user:', err);
            });
    }, []);



    return (
        <nav className="dashboard-navbar">
            <div className="navbar-left">
                <div className="navbar-header">
                    <h1 className="navbar-logo">StoreIT</h1>
                </div>
                <div className="navbar-search-container">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="navbar-search-input"
                    />
                </div>
            </div>

            <div className="navbar-right">
                <button className="icon-btn notification-btn">
                    <FaBell />
                    <span className="notification-badge">1</span>
                </button>

                <div className="navbar-user-profile">
                    <img
                        // src="/default-avatar.png" // Optional: pakai default image atau ambil dari DB nanti
                        alt="User Avatar"
                        className="user-avatar"
                    />
                    <div className="user-info">
                        <span className="user-name">
                            {user ? user.user.username : 'Loading...'}
                        </span>
                        <span className="user-role">
                            {user ? user.user.role : 'Loading...'}</span>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
