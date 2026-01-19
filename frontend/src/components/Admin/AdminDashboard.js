import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import Navbar from '../Common/Navbar';
import './Admin.css';

const AdminDashboard = ({ user }) => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalStores: 0,
        totalRatings: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/admin/dashboard/stats');
            setStats(response.data);
        } catch (err) {
            setError('Failed to load dashboard statistics');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar user={user} />
            <div className="container">
                <h1>Admin Dashboard</h1>

                {error && <div className="error-message">{error}</div>}

                {loading ? (
                    <p>Loading statistics...</p>
                ) : (
                    <div className="stats-grid">
                        <div className="stat-card">
                            <h3>Total Users</h3>
                            <p className="stat-number">{stats.totalUsers}</p>
                        </div>
                        <div className="stat-card">
                            <h3>Total Stores</h3>
                            <p className="stat-number">{stats.totalStores}</p>
                        </div>
                        <div className="stat-card">
                            <h3>Total Ratings</h3>
                            <p className="stat-number">{stats.totalRatings}</p>
                        </div>
                    </div>
                )}

                <div className="action-buttons">
                    <button
                        className="btn-action"
                        onClick={() => navigate('/admin/users')}
                    >
                        Manage Users
                    </button>
                    <button
                        className="btn-action"
                        onClick={() => navigate('/admin/stores')}
                    >
                        Manage Stores
                    </button>
                    <button
                        className="btn-action"
                        onClick={() => navigate('/admin/add-user')}
                    >
                        Add User
                    </button>
                    <button
                        className="btn-action"
                        onClick={() => navigate('/admin/add-store')}
                    >
                        Add Store
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;