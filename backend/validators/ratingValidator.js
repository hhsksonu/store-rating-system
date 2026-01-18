// rating Validation 

const validateRating = (rating) => {
    const ratingNum = parseInt(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        return 'Rating must be a number between 1 and 5';
    }
    return null;
};

const validateStoreId = (storeId) => {
    if (!storeId || typeof storeId !== 'string') {
        return 'Store ID is required';
    }
    // Basic UUID format validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(storeId)) {
        return 'Invalid store ID format';
    }
    return null;
};

module.exports = {
    validateRating,
    validateStoreId
};