import React from 'react';
import './Sidebar.css';
import { useAtom } from 'jotai';
import { userAtom } from '../lib/userAtom';
import { useRouter } from 'next/navigation';

import {
    FaHome, FaPlusSquare, FaLayerGroup, FaTrashAlt, FaShoppingBag,
    FaUsers, FaGlobeAmericas, FaChartBar, FaCog, FaQuestionCircle, FaSignOutAlt, FaAngleRight
} from 'react-icons/fa';

const SidebarItem = ({ icon, label, isActive, hasSubmenu, isCollapsed, onClick }) => (
    <div onClick={onClick} className={`sidebar-item ${isActive ? 'active' : ''} ${isCollapsed ? 'collapsed' : ''}`} style={{ cursor: 'pointer' }}>
        <div className="sidebar-item-icon">{icon}</div>
        {!isCollapsed && <span className="sidebar-item-label">{label}</span>}
        {!isCollapsed && hasSubmenu && <FaAngleRight className="submenu-arrow" />}
    </div>
);



const Sidebar = ({ isCollapsed }) => {
    const router = useRouter();
    const [user, setUser] = useAtom(userAtom);

    const handleLogout = () => {
        setUser(null);
        router.push('/Login');
    };

    const baseMenuItems = [
        { icon: <FaHome />, label: 'Home', isActive: true, hasSubmenu: false, to: '/' },
        { icon: <FaPlusSquare />, label: 'Product', hasSubmenu: true, to: '/Product' },
        { icon: <FaLayerGroup />, label: 'Category', hasSubmenu: true, to: '/Category' },
        { icon: <FaCog />, label: 'Company', to: '/Company' },
    ];

    const managerItems = [
        { icon: <FaChartBar />, label: 'Company', to: '/CompanyReport' },
    ];

    const adminMenuItems = [
        { icon: <FaUsers />, label: 'Users', hasSubmenu: true, to: '/ShowAllUsers' },
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
                    className={`sidebar-item ${isCollapsed ? 'collapsed' : ''}`}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="sidebar-item-icon"><FaSignOutAlt /></div>
                    {!isCollapsed && <span className="sidebar-item-label">Log Out</span>}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;