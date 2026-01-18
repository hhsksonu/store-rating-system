const bcrypt = require('bcrypt');
const pool = require('../config/database');
const {
    validateRole,
    validateName,
    validateEmail,
    validateAddress,
    validatePassword
} = require('../validators/userValidator');
const {
    validateStoreName,
    validateStoreEmail,
    validateStoreAddress,
    validateOwnerEmail,
    validateOwnerPassword
} = require('../validators/storeValidator');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        const usersResult = await pool.query('SELECT COUNT(*) FROM users');
        const storesResult = await pool.query('SELECT COUNT(*) FROM stores');
        const ratingsResult = await pool.query('SELECT COUNT(*) FROM ratings');

        res.json({
            totalUsers: parseInt(usersResult.rows[0].count),
            totalStores: parseInt(storesResult.rows[0].count),
            totalRatings: parseInt(ratingsResult.rows[0].count)
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
    }
};

// Get all users with filtering and sorting
const getUsers = async (req, res) => {
    const { name, email, address, role, sortBy, sortOrder } = req.query;

    try {
        let query = 'SELECT id, name, email, address, role, created_at FROM users WHERE 1=1';
        const params = [];
        let paramCounter = 1;

        // Apply filters
        if (name) {
            query += ` AND name ILIKE $${paramCounter}`;
            params.push(`%${name}%`);
            paramCounter++;
        }

        if (email) {
            query += ` AND email ILIKE $${paramCounter}`;
            params.push(`%${email}%`);
            paramCounter++;
        }

        if (address) {
            query += ` AND address ILIKE $${paramCounter}`;
            params.push(`%${address}%`);
            paramCounter++;
        }

        if (role) {
            query += ` AND role = $${paramCounter}`;
            params.push(role);
            paramCounter++;
        }

        // Apply sorting
        const validSortColumns = ['name', 'email', 'address', 'role'];
        const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
        const order = sortOrder === 'asc' ? 'ASC' : 'DESC';
        query += ` ORDER BY ${sortColumn} ${order}`;

        const result = await pool.query(query, params);

        res.json({ users: result.rows });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

// Get all stores with filtering and sorting
const getStores = async (req, res) => {
    const { name, email, address, sortBy, sortOrder } = req.query;

    try {
        let query = `
      SELECT 
        s.id, 
        s.name, 
        s.email, 
        s.address, 
        s.created_at,
        COALESCE(AVG(r.rating), 0) as average_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE 1=1
    `;
        const params = [];
        let paramCounter = 1;

        // Apply filters
        if (name) {
            query += ` AND s.name ILIKE $${paramCounter}`;
            params.push(`%${name}%`);
            paramCounter++;
        }

        if (email) {
            query += ` AND s.email ILIKE $${paramCounter}`;
            params.push(`%${email}%`);
            paramCounter++;
        }

        if (address) {
            query += ` AND s.address ILIKE $${paramCounter}`;
            params.push(`%${address}%`);
            paramCounter++;
        }

        query += ' GROUP BY s.id';

        // Apply sorting
        const validSortColumns = ['name', 'email', 'address'];
        let sortColumn = 'created_at';

        if (sortBy === 'rating') {
            sortColumn = 'average_rating';
        } else if (validSortColumns.includes(sortBy)) {
            sortColumn = sortBy;
        }

        const order = sortOrder === 'asc' ? 'ASC' : 'DESC';
        query += ` ORDER BY ${sortColumn} ${order}`;

        const result = await pool.query(query, params);

        // Round ratings to 1 decimal place
        const stores = result.rows.map(store => ({
            ...store,
            average_rating: parseFloat(store.average_rating).toFixed(1)
        }));

        res.json({ stores });
    } catch (error) {
        console.error('Get stores error:', error);
        res.status(500).json({ error: 'Failed to fetch stores' });
    }
};

// Add a new user
const addUser = async (req, res) => {
    const { name, email, password, address, role } = req.body;

    try {
        // Validate inputs
        const nameError = validateName(name);
        if (nameError) return res.status(400).json({ error: nameError });

        const emailError = validateEmail(email);
        if (emailError) return res.status(400).json({ error: emailError });

        const passwordError = validatePassword(password);
        if (passwordError) return res.status(400).json({ error: passwordError });

        const addressError = validateAddress(address);
        if (addressError) return res.status(400).json({ error: addressError });

        const roleError = validateRole(role);
        if (roleError) return res.status(400).json({ error: roleError });

        // Check if email exists
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const result = await pool.query(
            `INSERT INTO users (name, email, password, address, role) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, name, email, address, role`,
            [name, email, hashedPassword, address, role]
        );

        res.status(201).json({
            message: 'User added successfully',
            user: result.rows[0]
        });
    } catch (error) {
        console.error('Add user error:', error);
        res.status(500).json({ error: 'Failed to add user' });
    }
};

// Add a new store
const addStore = async (req, res) => {
    const { name, email, address, ownerEmail, ownerPassword } = req.body;

    try {
        // Validate store details
        const nameError = validateStoreName(name);
        if (nameError) return res.status(400).json({ error: nameError });

        const emailError = validateStoreEmail(email);
        if (emailError) return res.status(400).json({ error: emailError });

        const addressError = validateStoreAddress(address);
        if (addressError) return res.status(400).json({ error: addressError });

        // Validate owner details
        const ownerEmailError = validateOwnerEmail(ownerEmail);
        if (ownerEmailError) return res.status(400).json({ error: ownerEmailError });

        const ownerPasswordError = validateOwnerPassword(ownerPassword);
        if (ownerPasswordError) return res.status(400).json({ error: ownerPasswordError });

        // Owner name = store name + " Owner"
        const ownerName = name + " Owner Account";

        // Check if store email exists
        const existingStore = await pool.query(
            'SELECT id FROM stores WHERE email = $1',
            [email]
        );

        if (existingStore.rows.length > 0) {
            return res.status(400).json({ error: 'Store email already exists' });
        }

        // Check if owner email exists
        const existingOwner = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [ownerEmail]
        );

        if (existingOwner.rows.length > 0) {
            return res.status(400).json({ error: 'Owner email already exists' });
        }

        // Start transaction
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Hash owner password
            const hashedPassword = await bcrypt.hash(ownerPassword, 10);

            // Create store owner account
            const ownerResult = await client.query(
                `INSERT INTO users (name, email, password, address, role) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING id`,
                [ownerName, ownerEmail, hashedPassword, address, 'store_owner']
            );

            const ownerId = ownerResult.rows[0].id;

            // Create store
            const storeResult = await client.query(
                `INSERT INTO stores (owner_id, name, email, address) 
         VALUES ($1, $2, $3, $4) 
         RETURNING id, name, email, address`,
                [ownerId, name, email, address]
            );

            await client.query('COMMIT');

            res.status(201).json({
                message: 'Store and owner account created successfully',
                store: storeResult.rows[0]
            });
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Add store error:', error);
        res.status(500).json({ error: 'Failed to add store' });
    }
};

module.exports = {
    getDashboardStats,
    getUsers,
    getStores,
    addUser,
    addStore
};