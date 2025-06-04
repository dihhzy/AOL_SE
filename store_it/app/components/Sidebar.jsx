"use client";
import React, { useState } from 'react';
import './Sidebar.css';
import { useAtom } from 'jotai';
import { userAtom } from '../lib/userAtom';
import { useRouter, usePathname } from 'next/navigation';
import '../global.css'

import {
    FaHome, FaPlusSquare, FaLayerGroup, FaTrashAlt, FaShoppingBag,
    FaUsers, FaGlobeAmericas, FaChartBar, FaCog, FaQuestionCircle, 
    FaSignOutAlt, FaAngleRight, FaBuilding
} from 'react-icons/fa';

const SidebarItem = ({ icon, label, isActive, hasSubmenu, isCollapsed, onClick, to }) => (
    <div 
        onClick={onClick} 
        className={`sidebar-item ${isActive ? 'active' : ''} ${isCollapsed ? 'collapsed' : ''}`} 
        style={{ cursor: 'pointer' }}
        title={isCollapsed ? label : ''}
    >
        <div className="sidebar-item-icon">{icon}</div>
        {!isCollapsed && <span className="sidebar-item-label">{label}</span>}
        {!isCollapsed && hasSubmenu && <FaAngleRight className="submenu-arrow" />}
    </div>
);

const Sidebar = ({ isCollapsed }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useAtom(userAtom);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        // Add a small delay for better UX
        setTimeout(() => {
            setUser(null);
            router.push('/Login');
        }, 500);
    };

    const baseMenuItems = [
        { 
            icon: <FaHome />, 
            label: 'Dashboard', 
            hasSubmenu: false, 
            to: '/Dashboard',
            isActive: pathname === '/Dashboard'
        },
        { 
            icon: <FaBuilding />, 
            label: 'Company', 
            to: '/Company',
            isActive: pathname === '/Company'
        },
        { 
            icon: <FaPlusSquare />, 
            label: 'Products', 
            hasSubmenu: false, 
            to: '/Product',
            isActive: pathname === '/Product'
        },
        { 
            icon: <FaLayerGroup />, 
            label: 'Transactions', 
            hasSubmenu: false, 
            to: '/Transaction',
            isActive: pathname === '/Transaction'
        },
    ];

    const managerItems = [
        { 
            icon: <FaChartBar />, 
            label: 'Reports', 
            to: '/CompanyReport',
            isActive: pathname === '/CompanyReport'
        },
    ];

    const adminMenuItems = [
        { 
            icon: <FaUsers />, 
            label: 'Users', 
            hasSubmenu: true, 
            to: '/ShowAllUsers',
            isActive: pathname === '/ShowAllUsers'
        },
    ];

    let menuItems;

    if (user?.Role === 'admin') {
        menuItems = [...baseMenuItems, ...managerItems, ...adminMenuItems];
    } else if (user?.Role === 'manager') {
        menuItems = [...baseMenuItems, ...managerItems];
    } else if (user?.Role === 'staff') {
        menuItems = [...baseMenuItems];
    } else {
        menuItems = [...baseMenuItems];
    }

    const getRoleColor = (role) => {
        switch(role) {
            case 'admin': return '#ef4444';
            case 'manager': return '#f59e0b';
            case 'staff': return '#10b981';
            default: return '#6b7280';
        }
    };

    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            {/* Role Indicator
            {!isCollapsed && user && (
                <div 
                    className="sidebar-role-indicator"
                    style={{ 
                        borderColor: getRoleColor(user.Role),
                        color: getRoleColor(user.Role)
                    }}
                >
                    {user.Role} Access
                </div>
            )} */}

            <nav className="sidebar-nav">
                {menuItems.map((item, index) => (
                    <SidebarItem
                        key={index}
                        icon={item.icon}
                        label={item.label}
                        isActive={item.isActive}
                        hasSubmenu={item.hasSubmenu}
                        isCollapsed={isCollapsed}
                        to={item.to}
                        onClick={() => {
                            if (item.to) {
                                router.push(item.to);
                            }
                        }}
                    />
                ))}
            </nav>

            <div className="sidebar-footer">
                <div
                    onClick={handleLogout}
                    className={`sidebar-item ${isCollapsed ? 'collapsed' : ''} ${isLoggingOut ? 'logging-out' : ''}`}
                    style={{ cursor: 'pointer' }}
                    title={isCollapsed ? 'Log Out' : ''}
                >
                    <div className="sidebar-item-icon">
                        <FaSignOutAlt style={{ 
                            transform: isLoggingOut ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.5s ease'
                        }} />
                    </div>
                    {!isCollapsed && (
                        <span className="sidebar-item-label">
                            {isLoggingOut ? 'Logging out...' : 'Log Out'}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;