import React from 'react';
import './Sidebar.css';
import { useAtom } from 'jotai';
import { userAtom } from '../lib/userAtom';

import {
    FaHome, FaPlusSquare, FaLayerGroup, FaTrashAlt, FaShoppingBag,
    FaUsers, FaGlobeAmericas, FaChartBar, FaCog, FaQuestionCircle, FaSignOutAlt, FaAngleRight
} from 'react-icons/fa';

const SidebarItem = ({ icon, label, isActive, hasSubmenu, isCollapsed }) => (
    <a href="#" className={`sidebar-item ${isActive ? 'active' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-item-icon">{icon}</div>
        {!isCollapsed && <span className="sidebar-item-label">{label}</span>}
        {!isCollapsed && hasSubmenu && <FaAngleRight className="submenu-arrow" />}
    </a>
);

const Sidebar = ({ isCollapsed }) => {
    const [user] = useAtom(userAtom);

    const baseMenuItems = [
        { icon: <FaHome />, label: 'Home', isActive: true, hasSubmenu: false },
        { icon: <FaPlusSquare />, label: 'Product', hasSubmenu: true },
        { icon: <FaLayerGroup />, label: 'Category', hasSubmenu: true },
        { icon: <FaCog />, label: 'Company' },
    ];

    
    const managerItems = [
        { icon: <FaChartBar />, label: 'Company' },
    ]
    const adminMenuItems = [
        { icon: <FaUsers />, label: 'Users', hasSubmenu: true },
    ];
    
    const menuItems =
        user?.Role === 'Staff' ? [...baseMenuItems] : baseMenuItems;
        user?.Role === 'Admin' ? [...baseMenuItems, ...adminMenuItems] : baseMenuItems;
        user?.Role === 'Manager' ? [...managerItems] : baseMenuItems;

    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <nav className="sidebar-nav">
                {menuItems.map((item, index) => (
                    <SidebarItem
                        key={index}
                        icon={item.icon}
                        label={item.label}
                        isActive={item.isActive}
                        hasSubmenu={item.hasSubmenu}
                        isCollapsed={isCollapsed}
                    />
                ))}
            </nav>
            <div className="sidebar-footer">
                <SidebarItem icon={<FaSignOutAlt />} label="Log Out" isCollapsed={isCollapsed} />
            </div>
        </div>
    );
};


export default Sidebar;