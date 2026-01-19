export const validateName = (name) => {
    if (!name) {
        return 'Name is required';
    }

    const length = name.trim().length;

    if (length < 20 || length > 60) {
        return 'Name must be between 20 and 60 characters';
    }

    return null;
};

export const validateEmail = (email) => {
    if (!email) {
        return 'Email is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return 'Invalid email format';
    }

    return null;
};

export const validatePassword = (password) => {
    if (!password) {
        return 'Password is required';
    }

    if (password.length < 8 || password.length > 16) {
        return 'Password must be 8 to 16 characters long';
    }

    if (!/[A-Z]/.test(password)) {
        return 'Password should have at least one uppercase letter';
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return 'Password should have at least one special character';
    }

    return null;
};

export const validateAddress = (address) => {
    if (!address || address.trim() === '') {
        return 'Address is required';
    }

    if (address.length > 400) {
        return 'Address cannot be more than 400 characters';
    }

    return null;
};

export const validateRating = (rating) => {
    if (!rating) {
        return 'Rating is required';
    }

    const ratingValue = Number(rating);

    if (ratingValue < 1 || ratingValue > 5) {
        return 'Rating must be between 1 and 5';
    }

    return null;
};
