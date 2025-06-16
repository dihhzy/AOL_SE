"use client";

import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { userAtom } from "../lib/userAtom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "./ShowAllUsers.css";
import "../global.css";

function ShowAllUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser] = useAtom(userAtom);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [filters, setFilters] = useState({
    role: 'all',
    search: ''
  });

  const [newUser, setNewUser] = useState({
    Username: '',
    Email: '',
    Password: '',
    Role: 'staff'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, filters]);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    if (filters.role !== 'all') {
      filtered = filtered.filter(user => 
        user.Role.toLowerCase() === filters.role.toLowerCase()
      );
    }

    if (filters.search) {
      filtered = filtered.filter(user =>
        user.Username.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.Email.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  const handleAddUser = async () => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const addedUser = await response.json();
      setUsers(prev => [...prev, addedUser]);
      setShowAddModal(false);
      setNewUser({ Username: '', Email: '', Password: '', Role: 'staff' });
      alert('User added successfully!');
    } catch (err) {
      console.error("Failed to add user:", err);
      alert(`Error adding user: ${err.message}`);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete user "${username}"?\n\nThis action cannot be undone.`
    );

    if (!isConfirmed) return;

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setUsers(prev => prev.filter(user => user.UserID !== userId));
      alert(`User "${username}" has been successfully deleted.`);
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert(`Error deleting user: ${err.message}`);
    }
  };

  const getRoleIcon = (role) => {
    switch(role?.toLowerCase()) {
      case 'admin': return '👑';
      case 'company_owner': return '🏢';
      case 'staff': return '👤';
      default: return '❓';
    }
  };

  const getRoleStats = () => {
    const stats = {
      total: users.length,
      admin: users.filter(u => u.Role.toLowerCase() === 'admin').length,
      company_owner: users.filter(u => u.Role.toLowerCase() === 'company_owner').length,
      staff: users.filter(u => u.Role.toLowerCase() === 'staff').length,
    };
    return stats;
  };

  const stats = getRoleStats();

  return (
    <div className="app-layout">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="page-content users-page-content">
          {/* Header */}
          <div className="users-header">
            <h2>User Management</h2>
            <button 
              className="add-user-button"
              onClick={() => setShowAddModal(true)}
            >
              <span>➕</span>
              Add New User
            </button>
          </div>

          {/* Statistics */}
          <div className="users-stats">
            <div className="stat-card">
              <h3>Total Users</h3>
              <p className="stat-value total">{stats.total}</p>
            </div>
            <div className="stat-card">
              <h3>Admins</h3>
              <p className="stat-value admin">{stats.admin}</p>
            </div>
            <div className="stat-card">
              <h3>Company Owners</h3>
              <p className="stat-value company-owner">{stats.company_owner}</p>
            </div>
            <div className="stat-card">
              <h3>Staff Members</h3>
              <p className="stat-value staff">{stats.staff}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="users-filters">
            <div className="filter-group">
              <label>Filter by Role</label>
              <select 
                className="filter-select"
                value={filters.role}
                onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="company_owner">Company Owner</option>
                <option value="staff">Staff</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Search Users</label>
              <input
                type="text"
                className="filter-input"
                placeholder="Search by username or email..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
          </div>

          {error && <p className="error-message">Error: {error}</p>}

          {isLoading ? (
            <p className="loading-message">Loading users...</p>
          ) : filteredUsers.length > 0 ? (
            <div className="users-list-display">
              {filteredUsers.map(user => (
                <div 
                  key={user.UserID} 
                  className={`user-item-card ${user.Role.toLowerCase().replace('_', '-')}`}
                >
                  <div className="user-avatar">
                    {getRoleIcon(user.Role)}
                  </div>
                  
                  <h4>
                    {user.Username}
                    <span className={`user-role-badge ${user.Role.toLowerCase().replace('_', '-')}`}>
                      {user.Role.replace('_', ' ')}
                    </span>
                  </h4>
                  
                  <div className="user-info">
                    <div className="info-item">
                      <span className="info-icon">📧</span>
                      <div className="info-content">
                        <div className="info-label">Email</div>
                        <div className="info-value">{user.Email}</div>
                      </div>
                    </div>
                    
                    <div className="info-item">
                      <span className="info-icon">👤</span>
                      <div className="info-content">
                        <div className="info-label">User ID</div>
                        <div className="info-value">#{user.UserID}</div>
                      </div>
                    </div>
                    
                    <div className="info-item">
                      <span className="info-icon">📅</span>
                      <div className="info-content">
                        <div className="info-label">Created</div>
                        <div className="info-value">
                          {user.CreatedAt ? new Date(user.CreatedAt).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="user-actions">
                    <button 
                      className="action-button edit"
                      onClick={() => setEditingUser(user)}
                    >
                      <span>✏️</span>
                      Edit
                    </button>
                    <button 
                      className="action-button delete"
                      onClick={() => handleDeleteUser(user.UserID, user.Username)}
                      disabled={user.UserID === currentUser?.UserID}
                    >
                      <span>🗑️</span>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-users-message">
              {filters.role !== 'all' || filters.search ? 'No users match your filters.' : 'No users to display.'}
            </p>
          )}

          {/* Add User Modal */}
          {showAddModal && (
            <div className="modal-overlay">
              <div className="user-modal">
                <h3>Add New User</h3>
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    value={newUser.Username}
                    onChange={(e) => setNewUser(prev => ({ ...prev, Username: e.target.value }))}
                    placeholder="Enter username"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={newUser.Email}
                    onChange={(e) => setNewUser(prev => ({ ...prev, Email: e.target.value }))}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={newUser.Password}
                    onChange={(e) => setNewUser(prev => ({ ...prev, Password: e.target.value }))}
                    placeholder="Enter password"
                  />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select
                    value={newUser.Role}
                    onChange={(e) => setNewUser(prev => ({ ...prev, Role: e.target.value }))}
                  >
                    <option value="staff">Staff</option>
                    <option value="company_owner">Company Owner</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button 
                    className="cancel-btn"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="submit-btn"
                    onClick={handleAddUser}
                  >
                    Add User
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShowAllUsers;