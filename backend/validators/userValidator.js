// user validation

const validateRole = (role) => {
    const validRoles = ['admin', 'user', 'store_owner'];
    if (!role || !validRoles.includes(role)) {
        return 'Invalid role. Must be admin, user, or store_owner';
    }
    return null;
};

const validateName = (name) => {
    if (!name || typeof name !== 'string') {
        return 'Name is required';
    }
    const trimmedName = name.trim();
    if (trimmedName.length < 20 || trimmedName.length > 60) {
        return 'Name must be between 20 and 60 characters';
    }
    return null;
};

const validateEmail = (email) => {
    if (!email || typeof email !== 'string') {
        return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Please provide a valid email address';
    }
    return null;
};

const validateAddress = (address) => {
    if (!address || typeof address !== 'string') {
        return 'Address is required';
    }
    const trimmedAddress = address.trim();
    if (trimmedAddress.length === 0) {
        return 'Address cannot be empty';
    }
    if (trimmedAddress.length > 400) {
        return 'Address must not exceed 400 characters';
    }
    return null;
};

const validatePassword = (password) => {
    if (!password || typeof password !== 'string') {
        return 'Password is required';
    }
    if (password.length < 8 || password.length > 16) {
        return 'Password must be between 8 and 16 characters';
    }
    if (!/[A-Z]/.test(password)) {
        return 'Password must contain at least one uppercase letter';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return 'Password must contain at least one special character';
    }
    return null;
};

module.exports = {
    validateRole,
    validateName,
    validateEmail,
    validateAddress,
    validatePassword
};