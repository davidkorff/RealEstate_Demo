const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const pool = require('../db/config');

// @route   POST api/auth/register
// @desc    Register a resident
// @access  Public
router.post('/register', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  check('unit_number', 'Unit number is required').not().isEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, unit_number, first_name, last_name } = req.body;

    // Check if user exists
    const userExists = await pool.query(
      'SELECT * FROM residents WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await pool.query(
      'INSERT INTO residents (email, password, unit_number, first_name, last_name) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, unit_number, first_name, last_name',
      [email, hashedPassword, unit_number, first_name, last_name]
    );

    // Create JWT
    const payload = {
      user: {
        id: newUser.rows[0].id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        // Set session
        req.session.user = newUser.rows[0];
        req.session.token = token;
        
        // Return success response
        res.status(201).json({
          token,
          user: newUser.rows[0]
        });
      }
    );
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ msg: 'Server error during registration' });
  }
});

// @route   POST api/auth/login
// @desc    Authenticate resident & get token
// @access  Public
router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.headers['content-type']?.includes('application/json')) {
        return res.status(400).json({ errors: errors.array() });
      }
      req.flash('error_msg', 'Please check your email and password');
      return res.redirect('/login');
    }

    const { email, password } = req.body;

    // Check if user exists
    const result = await pool.query(
      'SELECT * FROM residents WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      if (req.headers['content-type']?.includes('application/json')) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
      req.flash('error_msg', 'Invalid credentials');
      return res.redirect('/login');
    }

    const user = result.rows[0];

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      if (req.headers['content-type']?.includes('application/json')) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
      req.flash('error_msg', 'Invalid credentials');
      return res.redirect('/login');
    }

    // Create JWT
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        // Set session
        const sessionUser = {
          id: user.id,
          email: user.email,
          unit_number: user.unit_number,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role
        };
        req.session.user = sessionUser;
        req.session.token = token;

        // Handle response based on request type
        if (req.headers['content-type']?.includes('application/json')) {
          return res.json({
            token,
            user: sessionUser
          });
        }
        
        // For form submissions, redirect to dashboard
        req.flash('success_msg', 'Successfully logged in');
        res.redirect('/dashboard');
      }
    );
  } catch (err) {
    console.error('Login error:', err.message);
    if (req.headers['content-type']?.includes('application/json')) {
      return res.status(500).json({ msg: 'Server error during login' });
    }
    req.flash('error_msg', 'An error occurred during login');
    res.redirect('/login');
  }
});

// @route   GET api/auth/me
// @desc    Get current resident
// @access  Private
router.get('/me', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const user = await pool.query(
      'SELECT id, email, unit_number, first_name, last_name, created_at FROM residents WHERE id = $1',
      [req.session.user.id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user.rows[0]);
  } catch (err) {
    console.error('Get user error:', err.message);
    res.status(500).json({ msg: 'Server error getting user data' });
  }
});

// @route   POST api/auth/logout
// @desc    Logout user
// @access  Public
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ msg: 'Error logging out' });
    }
    res.json({ msg: 'Logged out successfully' });
  });
});

module.exports = router; 