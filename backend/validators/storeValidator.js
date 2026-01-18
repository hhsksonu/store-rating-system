// store Validation 

const validateStoreName = (name) => {
    if (!name || typeof name !== 'string') {
        return 'Store name is required';
    }
    const trimmedName = name.trim();
    if (trimmedName.length < 20 || trimmedName.length > 60) {
        return 'Store name must be between 20 and 60 characters';
    }
    return null;
};

const validateStoreEmail = (email) => {
    if (!email || typeof email !== 'string') {
        return 'Store email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Please provide a valid store email address';
    }
    return null;
};

const validateStoreAddress = (address) => {
    if (!address || typeof address !== 'string') {
        return 'Store address is required';
    }
    const trimmedAddress = address.trim();
    if (trimmedAddress.length === 0) {
        return 'Store address cannot be empty';
    }
    if (trimmedAddress.length > 400) {
        return 'Store address must not exceed 400 characters';
    }
    return null;
};

const validateOwnerEmail = (email) => {
    if (!email || typeof email !== 'string') {
        return 'Owner email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Please provide a valid owner email address';
    }
    return null;
};

const validateOwnerPassword = (password) => {
    if (!password || typeof password !== 'string') {
        return 'Owner password is required';
    }
    if (password.length < 8 || password.length > 16) {
        return 'Owner password must be between 8 and 16 characters';
    }
    if (!/[A-Z]/.test(password)) {
        return 'Owner password must contain at least one uppercase letter';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return 'Owner password must contain at least one special character';
    }
    return null;
};

module.exports = {
    validateStoreName,
    validateStoreEmail,
    validateStoreAddress,
    validateOwnerEmail,
    validateOwnerPassword
};