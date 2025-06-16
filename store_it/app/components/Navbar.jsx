"use client";
import React, { useEffect, useState } from 'react';
import './Navbar.css';
import '../global.css'

import {
    FaSearch, FaBell, FaUser
} from 'react-icons/fa';

import { useAtom, useSetAtom } from 'jotai';
import { userAtom } from '../lib/userAtom';

const Navbar = () => {
    const [user] = useAtom(userAtom);
    const setUser = useSetAtom(userAtom);
    const [searchTerm, setSearchTerm] = useState('');
    const [hasNotifications, setHasNotifications] = useState(true);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            console.log('Searching for:', searchTerm);
        }
    };

    return (
        <nav className="dashboard-navbar">
            <div className="navbar-left">
                <div className="navbar-header">
                    <h1 className="navbar-logo">StoreIT</h1>
                </div>
                {/* <form onSubmit={handleSearch} className="navbar-search-container">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search products, companies, transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="navbar-search-input"
                    />
                </form> */}
            </div>

            <div className="navbar-right">

                {/* User Profile */}
                <div className="navbar-user-profile">
                    {/* <div className="user-avatar">
                        <FaUser style={{ width: '80%', height: '80%' }} />
                    </div> */}
                    <div className="user-info">
                        <span className="user-name">
                            {user ? user.Username : 'Loading...'}
                        </span>
                        <span className="user-role">
                            {user ? user.Role : 'User'}
                        </span>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;