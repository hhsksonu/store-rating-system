const pool = require('../config/database');
const { validateRating, validateStoreId } = require('../validators/ratingValidator');

// Get all stores with search functionality
const getStores = async (req, res) => {
    const { name, address } = req.query;
    const userId = req.user.id;

    try {
        let query = `
      SELECT 
        s.id, 
        s.name, 
        s.address,
        COALESCE(AVG(r.rating), 0) as overall_rating,
        ur.rating as user_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      LEFT JOIN ratings ur ON s.id = ur.store_id AND ur.user_id = $1
      WHERE 1=1
    `;
        const params = [userId];
        let paramCounter = 2;

        // Apply search filters
        if (name) {
            query += ` AND s.name ILIKE $${paramCounter}`;
            params.push(`%${name}%`);
            paramCounter++;
        }

        if (address) {
            query += ` AND s.address ILIKE $${paramCounter}`;
            params.push(`%${address}%`);
            paramCounter++;
        }

        query += ' GROUP BY s.id, ur.rating ORDER BY s.name ASC';

        const result = await pool.query(query, params);

        // Format response
        const stores = result.rows.map(store => ({
            id: store.id,
            name: store.name,
            address: store.address,
            overall_rating: parseFloat(store.overall_rating).toFixed(1),
            user_rating: store.user_rating || null
        }));

        res.json({ stores });
    } catch (error) {
        console.error('Get stores error:', error);
        res.status(500).json({ error: 'Failed to fetch stores' });
    }
};

// Submit a rating for a store
const submitRating = async (req, res) => {
    const { storeId, rating } = req.body;
    const userId = req.user.id;

    try {
        // Validate store ID
        const storeIdError = validateStoreId(storeId);
        if (storeIdError) return res.status(400).json({ error: storeIdError });

        // Validate rating
        const ratingError = validateRating(rating);
        if (ratingError) return res.status(400).json({ error: ratingError });

        // Check if store exists
        const storeCheck = await pool.query(
            'SELECT id FROM stores WHERE id = $1',
            [storeId]
        );

        if (storeCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Store not found' });
        }

        // Check if user already rated this store
        const existingRating = await pool.query(
            'SELECT id FROM ratings WHERE user_id = $1 AND store_id = $2',
            [userId, storeId]
        );

        if (existingRating.rows.length > 0) {
            return res.status(400).json({ error: 'You have already rated this store. Use update instead' });
        }

        // Insert rating
        const result = await pool.query(
            `INSERT INTO ratings (user_id, store_id, rating) 
       VALUES ($1, $2, $3) 
       RETURNING id, rating`,
            [userId, storeId, rating]
        );

        res.status(201).json({
            message: 'Rating submitted successfully',
            rating: result.rows[0]
        });
    } catch (error) {
        console.error('Submit rating error:', error);
        res.status(500).json({ error: 'Failed to submit rating' });
    }
};

// Update existing rating
const updateRating = async (req, res) => {
    const { storeId, rating } = req.body;
    const userId = req.user.id;

    try {
        // Validate store ID
        const storeIdError = validateStoreId(storeId);
        if (storeIdError) return res.status(400).json({ error: storeIdError });

        // Validate rating
        const ratingError = validateRating(rating);
        if (ratingError) return res.status(400).json({ error: ratingError });

        // Check if rating exists
        const existingRating = await pool.query(
            'SELECT id FROM ratings WHERE user_id = $1 AND store_id = $2',
            [userId, storeId]
        );

        if (existingRating.rows.length === 0) {
            return res.status(404).json({ error: 'No rating found for this store. Submit a new rating first' });
        }

        // Update rating
        const result = await pool.query(
            `UPDATE ratings 
       SET rating = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE user_id = $2 AND store_id = $3 
       RETURNING id, rating`,
            [rating, userId, storeId]
        );

        res.json({
            message: 'Rating updated successfully',
            rating: result.rows[0]
        });
    } catch (error) {
        console.error('Update rating error:', error);
        res.status(500).json({ error: 'Failed to update rating' });
    }
};

module.exports = {
    getStores,
    submitRating,
    updateRating
};