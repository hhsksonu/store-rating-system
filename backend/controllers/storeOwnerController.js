const pool = require('../config/database');

// Get store owner dashboard data
const getDashboard = async (req, res) => {
    const ownerId = req.user.id;

    try {
        // Get owner's store
        const storeResult = await pool.query(
            'SELECT id, name FROM stores WHERE owner_id = $1',
            [ownerId]
        );

        if (storeResult.rows.length === 0) {
            return res.status(404).json({ error: 'No store found for this owner' });
        }

        const store = storeResult.rows[0];

        // Get average rating
        const ratingResult = await pool.query(
            'SELECT COALESCE(AVG(rating), 0) as average_rating FROM ratings WHERE store_id = $1',
            [store.id]
        );

        const averageRating = parseFloat(ratingResult.rows[0].average_rating).toFixed(1);

        // Get users who rated the store
        const usersResult = await pool.query(
            `SELECT 
        u.id, 
        u.name, 
        u.email, 
        r.rating, 
        r.created_at as rated_at
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id = $1
       ORDER BY r.created_at DESC`,
            [store.id]
        );

        res.json({
            store: {
                id: store.id,
                name: store.name,
                average_rating: averageRating
            },
            users: usersResult.rows
        });
    } catch (error) {
        console.error('Store owner dashboard error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
};

module.exports = {
    getDashboard
};