import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import Navbar from '../Common/Navbar';
import './Admin.css';

const AdminStores = ({ user }) => {
    const [stores, setStores] = useState([]);
    const [filters, setFilters] = useState({
        name: '',
        email: '',
        address: '',
        sortBy: 'created_at',
        sortOrder: 'desc'
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = async () => {
        setLoading(true);
        setError('');
        try {
            const params = new URLSearchParams();
            Object.keys(filters).forEach(key => {
                if (filters[key]) {
                    params.append(key, filters[key]);
                }
            });

            const response = await api.get(`/admin/stores?${params}`);
            setStores(response.data.stores);
        } catch (err) {
            setError('Failed to load stores');
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
        fetchStores();
    };

    const handleClearFilters = () => {
        setFilters({
            name: '',
            email: '',
            address: '',
            sortBy: 'created_at',
            sortOrder: 'desc'
        });
    };

    return (
        <div>
            <Navbar user={user} />
            <div className="container">
                <div className="page-header">
                    <h1>Manage Stores</h1>
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
                            placeholder="Search by store name"
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
                        <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
                            <option value="created_at">Sort by Date</option>
                            <option value="name">Sort by Name</option>
                            <option value="email">Sort by Email</option>
                            <option value="rating">Sort by Rating</option>
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
                    <p>Loading stores...</p>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Store Name</th>
                                    <th>Email</th>
                                    <th>Address</th>
                                    <th>Rating</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stores.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center' }}>
                                            No stores found
                                        </td>
                                    </tr>
                                ) : (
                                    stores.map((store) => (
                                        <tr key={store.id}>
                                            <td>{store.name}</td>
                                            <td>{store.email}</td>
                                            <td>{store.address}</td>
                                            <td>
                                                <span className="rating-badge">
                                                    ⭐ {store.average_rating}
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

export default AdminStores;