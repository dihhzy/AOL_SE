"use client";
import React, { useEffect, useState } from 'react';
import './Navbar.css';
import '../global.css'

import {
    FaSearch, FaBell
} from 'react-icons/fa';

import { useAtom, useSetAtom } from 'jotai';
import { userAtom } from '../lib/userAtom';



const Navbar = () => {
    const [user] = useAtom(userAtom);
    const setUser = useSetAtom(userAtom); // ✅ tambahkan ini
    const [searchTerm, setSearchTerm] = useState('');

    // useEffect(() => {
    //     fetch('/api/me')
    //         .then((res) => res.json())
    //         .then((data) => {
    //             if (data) {
    //                 console.log("data", data)
    //                 setUser(data); // ✅ set hasil API ke Jotai
    //             } else {
    //                 console.log('User tidak login', data);
    //             }
    //         })
    //         .catch((err) => {
    //             console.error('Gagal ambil user:', err);
    //         });
    // }, []);



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

                <div className="navbar-user-profile">
                    {console.log(user)}
                    <div className="user-info">
                        <span className="user-name">
                            {user ? user.Username : 'Loading...'}
                        </span>
                        <span className="user-role">
                            {user ? user.Role : ''}
                        </span>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
