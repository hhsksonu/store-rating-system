import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { validateRating } from '../../utils/validation';
import Navbar from '../Common/Navbar';
import './User.css';

const UserStores = ({ user }) => {
    const [stores, setStores] = useState([]);
    const [searchFilters, setSearchFilters] = useState({
        name: '',
        address: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [ratingModal, setRatingModal] = useState({
        show: false,
        storeId: null,
        storeName: '',
        currentRating: null,
        newRating: ''
    });
    const [ratingError, setRatingError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = async () => {
        setLoading(true);
        setError('');
        try {
            const params = new URLSearchParams();
            if (searchFilters.name) params.append('name', searchFilters.name);
            if (searchFilters.address) params.append('address', searchFilters.address);

            const response = await api.get(`/user/stores?${params}`);
            setStores(response.data.stores);
        } catch (err) {
            setError('Failed to load stores');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        setSearchFilters({
            ...searchFilters,
            [e.target.name]: e.target.value
        });
    };

    const handleSearch = () => {
        fetchStores();
    };

    const handleClearSearch = () => {
        setSearchFilters({ name: '', address: '' });
    };

    const openRatingModal = (store) => {
        setRatingModal({
            show: true,
            storeId: store.id,
            storeName: store.name,
            currentRating: store.user_rating,
            newRating: store.user_rating || ''
        });
        setRatingError('');
    };

    const closeRatingModal = () => {
        setRatingModal({
            show: false,
            storeId: null,
            storeName: '',
            currentRating: null,
            newRating: ''
        });
        setRatingError('');
    };

    const handleRatingSubmit = async () => {
        setRatingError('');

        const validationError = validateRating(ratingModal.newRating);
        if (validationError) {
            setRatingError(validationError);
            return;
        }

        try {
            const endpoint = ratingModal.currentRating ? '/user/ratings' : '/user/ratings';
            const method = ratingModal.currentRating ? 'put' : 'post';

            await api[method](endpoint, {
                storeId: ratingModal.storeId,
                rating: parseInt(ratingModal.newRating)
            });

            closeRatingModal();
            fetchStores();
        } catch (err) {
            setRatingError(err.response?.data?.error || 'Failed to submit rating');
        }
    };

    return (
        <div>
            <Navbar user={user} />
            <div className="container">
                <div className="page-header">
                    <h1>Browse Stores</h1>
                    <button className="btn-secondary" onClick={() => navigate('/user/update-password')}>
                        Update Password
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="search-section">
                    <h3>Search Stores</h3>
                    <div className="search-grid">
                        <input
                            type="text"
                            name="name"
                            placeholder="Search by store name"
                            value={searchFilters.name}
                            onChange={handleSearchChange}
                        />
                        <input
                            type="text"
                            name="address"
                            placeholder="Search by address"
                            value={searchFilters.address}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="search-buttons">
                        <button className="btn-primary" onClick={handleSearch}>
                            Search
                        </button>
                        <button className="btn-secondary" onClick={handleClearSearch}>
                            Clear
                        </button>
                    </div>
                </div>

                {loading ? (
                    <p>Loading stores...</p>
                ) : (
                    <div className="stores-grid">
                        {stores.length === 0 ? (
                            <p>No stores found</p>
                        ) : (
                            stores.map((store) => (
                                <div key={store.id} className="store-card">
                                    <h3>{store.name}</h3>
                                    <p className="store-address">{store.address}</p>
                                    <div className="store-rating">
                                        <span className="overall-rating">
                                            Overall Rating: ⭐ {store.overall_rating}
                                        </span>
                                    </div>
                                    {store.user_rating ? (
                                        <div className="user-rating">
                                            <p>Your Rating: ⭐ {store.user_rating}</p>
                                            <button
                                                className="btn-rate"
                                                onClick={() => openRatingModal(store)}
                                            >
                                                Update Rating
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            className="btn-rate"
                                            onClick={() => openRatingModal(store)}
                                        >
                                            Rate Store
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}

                {ratingModal.show && (
                    <div className="modal-overlay" onClick={closeRatingModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h3>
                                {ratingModal.currentRating ? 'Update Rating' : 'Rate Store'}
                            </h3>
                            <p className="modal-store-name">{ratingModal.storeName}</p>

                            {ratingError && <div className="error-message">{ratingError}</div>}

                            <div className="rating-input">
                                <label>Select Rating (1-5):</label>
                                <select
                                    value={ratingModal.newRating}
                                    onChange={(e) => setRatingModal({ ...ratingModal, newRating: e.target.value })}
                                >
                                    <option value="">Select rating</option>
                                    <option value="1">⭐ 1 - Poor</option>
                                    <option value="2">⭐⭐ 2 - Fair</option>
                                    <option value="3">⭐⭐⭐ 3 - Good</option>
                                    <option value="4">⭐⭐⭐⭐ 4 - Very Good</option>
                                    <option value="5">⭐⭐⭐⭐⭐ 5 - Excellent</option>
                                </select>
                            </div>

                            <div className="modal-buttons">
                                <button className="btn-primary" onClick={handleRatingSubmit}>
                                    Submit
                                </button>
                                <button className="btn-secondary" onClick={closeRatingModal}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserStores;