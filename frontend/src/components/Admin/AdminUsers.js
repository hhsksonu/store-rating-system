import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import Navbar from '../Common/Navbar';
import './Admin.css';

const AdminUsers = ({ user }) => {
    const [users, setUsers] = useState([]);
    const [filters, setFilters] = useState({
        name: '',
        email: '',
        address: '',
        role: '',
        sortBy: 'created_at',
        sortOrder: 'desc'
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        setError('');
        try {
            const params = new URLSearchParams();
            Object.keys(filters).forEach(key => {
                if (filters[key]) {
                    params.append(key, filters[key]);
                }
            });

            const response = await api.get(`/admin/users?${params}`);
            setUsers(response.data.users);
        } catch (err) {
            setError('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const handleApplyFilters = () => {
        fetchUsers();
    };

    const handleClearFilters = () => {
        setFilters({
            name: '',
            email: '',
            address: '',
            role: '',
            sortBy: 'created_at',
            sortOrder: 'desc'
        });
    };

    return (
        <div>
            <Navbar user={user} />
            <div className="container">
                <div className="page-header">
                    <h1>Manage Users</h1>
                    <button className="btn-back" onClick={() => navigate('/admin/dashboard')}>
                        Back to Dashboard
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="filters-section">
                    <h3>Filters</h3>
                    <div className="filters-grid">
                        <input
                            type="text"
                            name="name"
                            placeholder="Search by name"
                            value={filters.name}
                            onChange={handleFilterChange}
                        />
                        <input
                            type="text"
                            name="email"
                            placeholder="Search by email"
                            value={filters.email}
                            onChange={handleFilterChange}
                        />
                        <input
                            type="text"
                            name="address"
                            placeholder="Search by address"
                            value={filters.address}
                            onChange={handleFilterChange}
                        />
                        <select name="role" value={filters.role} onChange={handleFilterChange}>
                            <option value="">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                            <option value="store_owner">Store Owner</option>
                        </select>
                        <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
                            <option value="created_at">Sort by Date</option>
                            <option value="name">Sort by Name</option>
                            <option value="email">Sort by Email</option>
                            <option value="role">Sort by Role</option>
                        </select>
                        <select name="sortOrder" value={filters.sortOrder} onChange={handleFilterChange}>
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                    </div>
                    <div className="filter-buttons">
                        <button className="btn-primary" onClick={handleApplyFilters}>
                            Apply Filters
                        </button>
                        <button className="btn-secondary" onClick={handleClearFilters}>
                            Clear Filters
                        </button>
                    </div>
                </div>

                {loading ? (
                    <p>Loading users...</p>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Address</th>
                                    <th>Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center' }}>
                                            No users found
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((u) => (
                                        <tr key={u.id}>
                                            <td>{u.name}</td>
                                            <td>{u.email}</td>
                                            <td>{u.address}</td>
                                            <td>
                                                <span className={`role-badge role-${u.role}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsers;