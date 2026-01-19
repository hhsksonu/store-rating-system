import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { validatePassword } from '../../utils/validation';
import Navbar from '../Common/Navbar';
import './User.css';

const UpdatePassword = ({ user }) => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
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

        if (!formData.currentPassword) {
            newErrors.currentPassword = 'Current password is required';
        }

        const passwordError = validatePassword(formData.newPassword);
        if (passwordError) {
            newErrors.newPassword = passwordError;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

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
            await api.put('/auth/update-password', {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });

            setSuccess('Password updated successfully!');
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (err) {
            setServerError(err.response?.data?.error || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    const getBackPath = () => {
        if (user.role === 'user') return '/user/stores';
        if (user.role === 'store_owner') return '/store-owner/dashboard';
        if (user.role === 'admin') return '/admin/dashboard';
        return '/';
    };

    return (
        <div>
            <Navbar user={user} />
            <div className="container">
                <div className="page-header">
                    <h1>Update Password</h1>
                    <button className="btn-back" onClick={() => navigate(getBackPath())}>
                        Back
                    </button>
                </div>

                <div className="form-card">
                    {serverError && <div className="error-message">{serverError}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Current Password:</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                placeholder="Enter current password"
                            />
                            {errors.currentPassword && (
                                <span className="field-error">{errors.currentPassword}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>New Password:</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                placeholder="8-16 chars, 1 uppercase, 1 special character"
                            />
                            {errors.newPassword && (
                                <span className="field-error">{errors.newPassword}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Confirm New Password:</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Re-enter new password"
                            />
                            {errors.confirmPassword && (
                                <span className="field-error">{errors.confirmPassword}</span>
                            )}
                        </div>

                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdatePassword;