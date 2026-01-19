import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import Navbar from '../Common/Navbar';
import './StoreOwner.css';

const StoreOwnerDashboard = ({ user }) => {
    const [dashboardData, setDashboardData] = useState({
        store: null,
        users: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await api.get('/store-owner/dashboard');
            setDashboardData(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar user={user} />
            <div className="container">
                <div className="page-header">
                    <h1>Store Owner Dashboard</h1>
                    <button className="btn-secondary" onClick={() => navigate('/user/update-password')}>
                        Update Password
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}

                {loading ? (
                    <p>Loading dashboard...</p>
                ) : (
                    <>
                        {dashboardData.store && (
                            <div className="store-info-card">
                                <h2>{dashboardData.store.name}</h2>
                                <div className="average-rating">
                                    <span className="rating-label">Average Rating:</span>
                                    <span className="rating-value">
                                        ⭐ {dashboardData.store.average_rating}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="ratings-section">
                            <h3>Users Who Rated Your Store</h3>
                            {dashboardData.users.length === 0 ? (
                                <p className="no-ratings">No ratings yet</p>
                            ) : (
                                <div className="table-container">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>User Name</th>
                                                <th>Email</th>
                                                <th>Rating</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dashboardData.users.map((u) => (
                                                <tr key={u.id}>
                                                    <td>{u.name}</td>
                                                    <td>{u.email}</td>
                                                    <td>
                                                        <span className="rating-badge">
                                                            ⭐ {u.rating}
                                                        </span>
                                                    </td>
                                                    <td>{new Date(u.rated_at).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default StoreOwnerDashboard;