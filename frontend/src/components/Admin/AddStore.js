import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { validateName, validateEmail, validatePassword, validateAddress } from '../../utils/validation';
import Navbar from '../Common/Navbar';
import './Admin.css';

const AddStore = ({ user }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        ownerEmail: '',
        ownerPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
        setServerError('');
        setSuccess('');
    };

    const validateForm = () => {
        const newErrors = {};

        const nameError = validateName(formData.name);
        if (nameError) newErrors.name = nameError;

        const emailError = validateEmail(formData.email);
        if (emailError) newErrors.email = emailError;

        const addressError = validateAddress(formData.address);
        if (addressError) newErrors.address = addressError;

        const ownerEmailError = validateEmail(formData.ownerEmail);
        if (ownerEmailError) newErrors.ownerEmail = ownerEmailError;

        const ownerPasswordError = validatePassword(formData.ownerPassword);
        if (ownerPasswordError) newErrors.ownerPassword = ownerPasswordError;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        setSuccess('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            await api.post('/admin/stores', formData);
            setSuccess('Store and owner account created successfully!');
            setFormData({
                name: '',
                email: '',
                address: '',
                ownerEmail: '',
                ownerPassword: ''
            });
        } catch (err) {
            setServerError(err.response?.data?.error || 'Failed to add store');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar user={user} />
            <div className="container">
                <div className="page-header">
                    <h1>Add New Store</h1>
                    <button className="btn-back" onClick={() => navigate('/admin/dashboard')}>
                        Back to Dashboard
                    </button>
                </div>

                <div className="form-card">
                    {serverError && <div className="error-message">{serverError}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <form onSubmit={handleSubmit}>
                        <h3>Store Details</h3>

                        <div className="form-group">
                            <label>Store Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter store name (20-60 characters)"
                            />
                            {errors.name && <span className="field-error">{errors.name}</span>}
                        </div>

                        <div className="form-group">
                            <label>Store Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter store email"
                            />
                            {errors.email && <span className="field-error">{errors.email}</span>}
                        </div>

                        <div className="form-group">
                            <label>Store Address:</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter store address (max 400 characters)"
                                rows="3"
                            />
                            {errors.address && <span className="field-error">{errors.address}</span>}
                        </div>

                        <h3>Owner Account Details</h3>

                        <div className="form-group">
                            <label>Owner Email:</label>
                            <input
                                type="email"
                                name="ownerEmail"
                                value={formData.ownerEmail}
                                onChange={handleChange}
                                placeholder="Enter owner email"
                            />
                            {errors.ownerEmail && <span className="field-error">{errors.ownerEmail}</span>}
                        </div>

                        <div className="form-group">
                            <label>Owner Password:</label>
                            <input
                                type="password"
                                name="ownerPassword"
                                value={formData.ownerPassword}
                                onChange={handleChange}
                                placeholder="8-16 chars, 1 uppercase, 1 special character"
                            />
                            {errors.ownerPassword && <span className="field-error">{errors.ownerPassword}</span>}
                        </div>

                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Creating Store...' : 'Create Store'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddStore;