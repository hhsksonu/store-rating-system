import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { validateName, validateEmail, validatePassword, validateAddress } from '../../utils/validation';
import Navbar from '../Common/Navbar';
import './Admin.css';

const AddUser = ({ user }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        address: '',
        role: 'user'
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

        const passwordError = validatePassword(formData.password);
        if (passwordError) newErrors.password = passwordError;

        const addressError = validateAddress(formData.address);
        if (addressError) newErrors.address = addressError;

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
            await api.post('/admin/users', formData);
            setSuccess('User added successfully!');
            setFormData({
                name: '',
                email: '',
                password: '',
                address: '',
                role: 'user'
            });
        } catch (err) {
            setServerError(err.response?.data?.error || 'Failed to add user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar user={user} />
            <div className="container">
                <div className="page-header">
                    <h1>Add New User</h1>
                    <button className="btn-back" onClick={() => navigate('/admin/dashboard')}>
                        Back to Dashboard
                    </button>
                </div>

                <div className="form-card">
                    {serverError && <div className="error-message">{serverError}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter full name (20-60 characters)"
                            />
                            {errors.name && <span className="field-error">{errors.name}</span>}
                        </div>

                        <div className="form-group">
                            <label>Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email address"
                            />
                            {errors.email && <span className="field-error">{errors.email}</span>}
                        </div>

                        <div className="form-group">
                            <label>Password:</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="8-16 chars, 1 uppercase, 1 special character"
                            />
                            {errors.password && <span className="field-error">{errors.password}</span>}
                        </div>

                        <div className="form-group">
                            <label>Address:</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter complete address (max 400 characters)"
                                rows="3"
                            />
                            {errors.address && <span className="field-error">{errors.address}</span>}
                        </div>

                        <div className="form-group">
                            <label>Role:</label>
                            <select name="role" value={formData.role} onChange={handleChange}>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                                <option value="store_owner">Store Owner</option>
                            </select>
                        </div>

                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Adding User...' : 'Add User'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddUser;