const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = 3000;
const saltRounds = 10;

// -------------------------------------------------------------------------
// 1. PostgreSQL Database Connection Pool Configuration
// -------------------------------------------------------------------------
const pool = new Pool({
    user: process.env.DB_USER || 'liuhanyu',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'golden9-db',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 5432,
});

// Database connection error handling
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

// Simple connectivity check
(async () => {
    const client = await pool.connect();
    try {
        await client.query('SELECT NOW()');
        console.log('✅ PostgreSQL database connected successfully.');
    } catch (err) {
        console.error('❌ Failed to connect to PostgreSQL database:', err.message);
        console.error('   Please check your database configuration in .env file');
    } finally {
        client.release();
    }
})();

// -------------------------------------------------------------------------
// 2. Middleware Configuration
// -------------------------------------------------------------------------
app.use(cors()); // Enable CORS for frontend access
app.use(express.json()); // Allow parsing of JSON request bodies

// -------------------------------------------------------------------------
// 3. JWT Authentication Middleware
// -------------------------------------------------------------------------
const authenticateToken = (req, res, next) => {
    // Check public routes, skip authentication
    if (req.path === '/api/register' || req.path === '/api/login') {
        return next();
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ message: 'Authentication required: Missing token.' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token.' });
        }
        req.user = user;
        next();
    });
};

// Apply authentication middleware to protected routes
app.use(authenticateToken);

// -------------------------------------------------------------------------
// 4. User Authentication Routes
// -------------------------------------------------------------------------

// POST: User registration
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log('API Hit: POST /api/register', { username, email });

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, email, and password are required.' });
        }

        // Check if user already exists
        const existingUser = await pool.query('SELECT user_id FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ message: 'User already exists with this email address.' });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Insert new user
        const queryText = `
            INSERT INTO users (username, email, password_hash, role, points)
            VALUES ($1, $2, $3, 'user', 0)
            RETURNING user_id, username, email, role, points, is_active, created_at
        `;
        const result = await pool.query(queryText, [username, email, passwordHash]);

        // Generate JWT Token
        const user = result.rows[0];
        const token = jwt.sign(
            { user_id: user.user_id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key-change-in-production',
            { expiresIn: '1h' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token: token,
            user: user
        });
    } catch (err) {
        console.error('Error during user registration:', err.message);
        res.status(500).json({ message: 'Failed to register user.', error: err.message });
    }
});

// POST: User login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;
        console.log('API Hit: POST /api/login', { email, role });

        const result = await pool.query(
            'SELECT user_id, email, password_hash, username, role, points, is_active FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const user = result.rows[0];

        // Reject if role does not match requested context
        const expectedRole = role === 'admin' ? 'admin' : 'user';
        const normalizedRole = (user.role || '').toLowerCase();
        const isAdminAccount = normalizedRole === 'admin';
        const isMemberAccount = normalizedRole === 'user' || normalizedRole === 'standard';

        if (expectedRole === 'admin' && !isAdminAccount) {
            return res.status(403).json({ message: 'Only admin accounts can sign in here.' });
        }

        if (expectedRole === 'user' && !isMemberAccount) {
            return res.status(403).json({ message: 'Only member accounts can sign in here.' });
        }

        // Compare password
        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { user_id: user.user_id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key-change-in-production',
            { expiresIn: '1h' }
        );

        // Return safe user data (without password_hash)
        const { password_hash, ...safeUser } = user;

        res.status(200).json({
            message: 'Login successful',
            token: token,
            user: safeUser
        });

    } catch (err) {
        console.error('Error during user login:', err.message);
        res.status(500).json({ message: 'Login failed.', error: err.message });
    }
});

// -------------------------------------------------------------------------
// 5. User Management API Routes (CRUD)
// -------------------------------------------------------------------------
const USER_FIELDS = 'user_id, username, email, role, points, is_active, created_at';

// GET: Retrieve all users
app.get('/api/users', async (req, res) => {
    try {
        console.log('API Hit: GET /api/users');
        const queryText = `SELECT ${USER_FIELDS} FROM users ORDER BY created_at DESC`;
        const result = await pool.query(queryText);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching users:', err.message);
        res.status(500).json({ message: 'Database query failed to retrieve users.', error: err.message });
    }
});

// GET: Retrieve a single user by ID
app.get('/api/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        console.log(`API Hit: GET /api/users/${userId}`);

        const queryText = `SELECT ${USER_FIELDS} FROM users WHERE user_id = $1`;
        const result = await pool.query(queryText, [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching single user:', err.message);
        res.status(500).json({ message: 'Database query failed to retrieve user.', error: err.message });
    }
});

// PUT: Update an existing user
app.put('/api/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const { username, email, role, points, password, is_active } = req.body;
        console.log(`API Hit: PUT /api/users/${userId}`, req.body);

        let queryText = `
            UPDATE users
            SET username = $1, email = $2, role = $3, points = $4, is_active = $5
            WHERE user_id = $6
        `;
        let queryParams = [username, email, role, points, is_active !== undefined ? is_active : true, userId];

        // If password is provided, hash and update it
        if (password) {
            const passwordHash = await bcrypt.hash(password, saltRounds);
            queryText = `
                UPDATE users
                SET username = $1, email = $2, role = $3, points = $4, is_active = $5, password_hash = $6
                WHERE user_id = $7
            `;
            queryParams = [username, email, role, points, is_active !== undefined ? is_active : true, passwordHash, userId];
        }

        queryText += ` RETURNING ${USER_FIELDS}`;

        const result = await pool.query(queryText, queryParams);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json({ message: 'User updated successfully', user: result.rows[0] });
    } catch (err) {
        console.error('Error updating user:', err.message);
        res.status(500).json({ message: 'Failed to update user.', error: err.message });
    }
});

// DELETE: Delete a user
app.delete('/api/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        console.log(`API Hit: DELETE /api/users/${userId}`);

        const queryText = 'DELETE FROM users WHERE user_id = $1 RETURNING user_id';
        const result = await pool.query(queryText, [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json({ message: 'User deleted successfully', user_id: userId });
    } catch (err) {
        console.error('Error deleting user:', err.message);
        res.status(500).json({ message: 'Failed to delete user.', error: err.message });
    }
});

// -------------------------------------------------------------------------
// 6. Event Management API Routes (CRUD)
// -------------------------------------------------------------------------

// GET: Retrieve all events
app.get('/api/events', async (req, res) => {
    try {
        console.log('API Hit: GET /api/events');
        const queryText = `
            SELECT event_id, title, description, location, start_time, end_time, 
                   status, fee, max_participants, created_at 
            FROM events 
            ORDER BY start_time DESC
        `;
        const result = await pool.query(queryText);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching events:', err.message);
        res.status(500).json({ message: 'Database query failed to retrieve events.', error: err.message });
    }
});

// GET: Retrieve a single event by ID
app.get('/api/events/:id', async (req, res) => {
    try {
        const eventId = req.params.id;
        console.log(`API Hit: GET /api/events/${eventId}`);
        const queryText = `
            SELECT event_id, title, description, location, start_time, end_time, 
                   status, fee, max_participants, created_at 
            FROM events 
            WHERE event_id = $1
        `;
        const result = await pool.query(queryText, [eventId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Event not found.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching single event:', err.message);
        res.status(500).json({ message: 'Database query failed to retrieve event.', error: err.message });
    }
});

// POST: Create a new event
app.post('/api/events', async (req, res) => {
    try {
        const { title, description, location, start_time, end_time, status, fee, max_participants } = req.body;
        console.log('API Hit: POST /api/events', { title, location, start_time });

        if (!title || !start_time) {
            return res.status(400).json({ message: 'Title and start_time are required.' });
        }

        const queryText = `
            INSERT INTO events (title, description, location, start_time, end_time, status, fee, max_participants, creator_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING event_id, title, description, location, start_time, end_time, status, fee, max_participants, created_at
        `;
        const result = await pool.query(queryText, [
            title,
            description || null,
            location || null,
            start_time,
            end_time || null,
            status || 'scheduled',
            fee || 0,
            max_participants || null,
            req.user?.user_id || null
        ]);

        res.status(201).json({
            message: 'Event created successfully',
            event: result.rows[0]
        });
    } catch (err) {
        console.error('Error creating event:', err.message);
        res.status(500).json({ message: 'Failed to create event.', error: err.message });
    }
});

// PUT: Update an existing event
app.put('/api/events/:id', async (req, res) => {
    try {
        const eventId = req.params.id;
        const { title, description, location, start_time, end_time, status, fee, max_participants } = req.body;
        console.log(`API Hit: PUT /api/events/${eventId}`, req.body);

        const queryText = `
            UPDATE events
            SET title = $1, description = $2, location = $3, start_time = $4, 
                end_time = $5, status = $6, fee = $7, max_participants = $8,
                updated_at = CURRENT_TIMESTAMP
            WHERE event_id = $9
            RETURNING event_id, title, description, location, start_time, end_time, status, fee, max_participants, created_at
        `;
        const result = await pool.query(queryText, [
            title,
            description || null,
            location || null,
            start_time,
            end_time || null,
            status,
            fee || 0,
            max_participants || null,
            eventId
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Event not found.' });
        }

        res.status(200).json({
            message: 'Event updated successfully',
            event: result.rows[0]
        });
    } catch (err) {
        console.error('Error updating event:', err.message);
        res.status(500).json({ message: 'Failed to update event.', error: err.message });
    }
});

// DELETE: Delete an event
app.delete('/api/events/:id', async (req, res) => {
    try {
        const eventId = req.params.id;
        console.log(`API Hit: DELETE /api/events/${eventId}`);

        const queryText = 'DELETE FROM events WHERE event_id = $1 RETURNING event_id';
        const result = await pool.query(queryText, [eventId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Event not found.' });
        }

        res.status(200).json({ message: 'Event deleted successfully', event_id: eventId });
    } catch (err) {
        console.error('Error deleting event:', err.message);
        res.status(500).json({ message: 'Failed to delete event.', error: err.message });
    }
});

// -------------------------------------------------------------------------
// 7. Product Management API Routes (CRUD)
// -------------------------------------------------------------------------

// GET: Retrieve all products
app.get('/api/products', async (req, res) => {
    try {
        console.log('API Hit: GET /api/products');
        const queryText = `
            SELECT product_id, name, description, price, category, is_available, image_url, created_at 
            FROM products 
            ORDER BY name ASC
        `;
        const result = await pool.query(queryText);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching products:', err.message);
        res.status(500).json({ message: 'Database query failed to retrieve products.', error: err.message });
    }
});

// GET: Retrieve a single product by ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        console.log(`API Hit: GET /api/products/${productId}`);
        const queryText = `
            SELECT product_id, name, description, price, category, is_available, image_url, created_at 
            FROM products 
            WHERE product_id = $1
        `;
        const result = await pool.query(queryText, [productId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching single product:', err.message);
        res.status(500).json({ message: 'Database query failed to retrieve product.', error: err.message });
    }
});

// POST: Create a new product
app.post('/api/products', async (req, res) => {
    try {
        const { name, description, price, category, is_available, image_url } = req.body;
        console.log('API Hit: POST /api/products', { name, price });

        if (!name || price === undefined) {
            return res.status(400).json({ message: 'Name and price are required.' });
        }

        const queryText = `
            INSERT INTO products (name, description, price, category, is_available, image_url)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING product_id, name, description, price, category, is_available, image_url, created_at
        `;
        const result = await pool.query(queryText, [
            name,
            description || null,
            price,
            category || null,
            is_available !== undefined ? is_available : true,
            image_url || null
        ]);

        res.status(201).json({
            message: 'Product created successfully',
            product: result.rows[0]
        });
    } catch (err) {
        console.error('Error creating product:', err.message);
        res.status(500).json({ message: 'Failed to create product.', error: err.message });
    }
});

// PUT: Update an existing product
app.put('/api/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const { name, description, price, category, is_available, image_url } = req.body;
        console.log(`API Hit: PUT /api/products/${productId}`, req.body);

        const queryText = `
            UPDATE products
            SET name = $1, description = $2, price = $3, category = $4, 
                is_available = $5, image_url = $6, updated_at = CURRENT_TIMESTAMP
            WHERE product_id = $7
            RETURNING product_id, name, description, price, category, is_available, image_url, created_at
        `;
        const result = await pool.query(queryText, [
            name,
            description || null,
            price,
            category || null,
            is_available !== undefined ? is_available : true,
            image_url || null,
            productId
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        res.status(200).json({
            message: 'Product updated successfully',
            product: result.rows[0]
        });
    } catch (err) {
        console.error('Error updating product:', err.message);
        res.status(500).json({ message: 'Failed to update product.', error: err.message });
    }
});

// DELETE: Delete a product
app.delete('/api/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        console.log(`API Hit: DELETE /api/products/${productId}`);

        const queryText = 'DELETE FROM products WHERE product_id = $1 RETURNING product_id';
        const result = await pool.query(queryText, [productId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        res.status(200).json({ message: 'Product deleted successfully', product_id: productId });
    } catch (err) {
        console.error('Error deleting product:', err.message);
        res.status(500).json({ message: 'Failed to delete product.', error: err.message });
    }
});

// -------------------------------------------------------------------------
// 8. Start Server
// -------------------------------------------------------------------------
app.listen(port, () => {
    console.log(`✅ PostgreSQL API Server running at http://localhost:${port}`);
    console.log(`   Database: ${process.env.DB_NAME || 'golden9-db'} on port ${process.env.DB_PORT || 5432}`);
    console.log('   Users, Events, and Products CRUD routes are now secured with JWT.');
    console.log('   Authentication Routes: /api/register, /api/login');
});

