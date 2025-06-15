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
    FaSignOutAlt, FaAngleRight, FaBuilding, FaUserTie, FaUserShield
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

    // Base menu items - accessible to all roles
    const baseMenuItems = [
        { 
            icon: <FaHome />, 
            label: 'Dashboard', 
            hasSubmenu: false, 
            to: '/Dashboard',
            isActive: pathname === '/Dashboard'
        }
    ];

    // Staff-only menu items (can only manage products)
    const staffMenuItems = [
        { 
            icon: <FaPlusSquare />, 
            label: 'Products', 
            hasSubmenu: false, 
            to: '/Product',
            isActive: pathname === '/Product'
        }
    ];

    // Company Owner menu items (can manage companies, products, and transactions)
    const companyOwnerMenuItems = [
        { 
            icon: <FaBuilding />, 
            label: 'Companies', 
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

    // Admin menu items (full access to everything)
    const adminMenuItems = [
        { 
            icon: <FaBuilding />, 
            label: 'Companies', 
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
        { 
            icon: <FaUsers />, 
            label: 'User Management', 
            hasSubmenu: false, 
            to: '/ShowAllUsers',
            isActive: pathname === '/ShowAllUsers'
        }
    ];

    // Determine menu items based on user role
    let menuItems = [...baseMenuItems];
    
    if (user?.Role === 'Admin') {
        menuItems = [...baseMenuItems, ...adminMenuItems];
    } else if (user?.Role === 'Company_Owner') {
        menuItems = [...baseMenuItems, ...companyOwnerMenuItems];
    } else if (user?.Role === 'Staff') {
        menuItems = [...baseMenuItems, ...staffMenuItems];
    }

    const getRoleColor = (role) => {
        switch(role?.toLowerCase()) {
            case 'Admin': return '#ef4444';
            case 'company_owner': return '#f59e0b';
            case 'Staff': return '#10b981';
            default: return '#6b7280';
        }
    };

    const getRoleIcon = (role) => {
        switch(role?.toLowerCase()) {
            case 'Admin': return '👑';
            case 'company_owner': return '🏢';
            case 'Staff': return '👤';
            default: return '❓';
        }
    };

    const getRoleDisplayName = (role) => {
        switch(role?.toLowerCase()) {
            case 'admin': return 'Admin Access';
            case 'company_owner': return 'Owner Access';
            case 'staff': return 'Staff Access';
            default: return 'Guest Access';
        }
    };

    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            {/* Role Indicator */}
            {!isCollapsed && user && (
                <div 
                    className="sidebar-role-indicator"
                    style={{ 
                        borderColor: getRoleColor(user.Role),
                        color: getRoleColor(user.Role)
                    }}
                >
                    <span className="role-icon">{getRoleIcon(user.Role)}</span>
                    {getRoleDisplayName(user.Role)}
                </div>
            )}

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

            {/* Access Level Info */}
            {!isCollapsed && user && (
                <div className="sidebar-access-info">
                    <div className="access-title">Access Level</div>
                    <div className="access-details">
                        {user.Role === 'Staff' && (
                            <ul>
                                <li>✅ View Dashboard</li>
                                <li>✅ Manage Products</li>
                                <li>❌ Company Management</li>
                                <li>❌ User Management</li>
                            </ul>
                        )}
                        {user.Role === 'Company_Owner' && (
                            <ul>
                                <li>✅ Full Dashboard Access</li>
                                <li>✅ Company Management</li>
                                <li>✅ Product Management</li>
                                <li>✅ Transaction Reports</li>
                                <li>❌ User Management</li>
                            </ul>
                        )}
                        {user.Role === 'Admin' && (
                            <ul>
                                <li>✅ Full System Access</li>
                                <li>✅ All Management Tools</li>
                                <li>✅ User Administration</li>
                            </ul>
                        )}
                    </div>
                </div>
            )}

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