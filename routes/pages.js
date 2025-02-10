const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pool = require('../db/config');
const fs = require('fs').promises;
const path = require('path');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  const token = req.session.token;
  if (!token) {
    req.flash('error_msg', 'Please log in to access this resource');
    return res.redirect('/login');
  }
  next();
};

// Home page
router.get('/', async (req, res) => {
  try {
    // Read all images from the gallery directory
    const galleryPath = path.join(__dirname, '../public/images/gallery');
    const files = await fs.readdir(galleryPath);
    
    // Filter for image files only
    const images = files.filter(file => 
      /\.(jpg|jpeg|png|gif)$/i.test(file)
    );

    res.render('index', {
      title: 'Welcome',
      images: images,
      user: req.session.user
    });
  } catch (err) {
    console.error('Error loading gallery images:', err);
    res.render('index', {
      title: 'Welcome',
      images: [],
      user: req.session.user
    });
  }
});

// Login page
router.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.render('login', { title: 'Login' });
});

// Register page
router.get('/register', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.render('register', { title: 'Register' });
});

// Dashboard page
router.get('/dashboard', isAuthenticated, async (req, res) => {
  try {
    const maintenanceRequests = await pool.query(
      'SELECT * FROM maintenance_requests WHERE resident_id = $1 ORDER BY created_at DESC',
      [req.session.user.id]
    );
    res.render('dashboard', {
      title: 'Dashboard',
      user: req.session.user,
      requests: maintenanceRequests.rows
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error loading dashboard');
    res.redirect('/');
  }
});

// Profile page
router.get('/profile', isAuthenticated, async (req, res) => {
  try {
    const profile = await pool.query(
      'SELECT * FROM residents WHERE id = $1',
      [req.session.user.id]
    );
    res.render('profile', {
      title: 'Profile',
      user: profile.rows[0]
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error loading profile');
    res.redirect('/dashboard');
  }
});

// Maintenance request page
router.get('/maintenance', isAuthenticated, async (req, res) => {
  try {
    const requests = await pool.query(
      'SELECT * FROM maintenance_requests WHERE resident_id = $1 ORDER BY created_at DESC',
      [req.session.user.id]
    );
    res.render('maintenance', {
      title: 'Maintenance Requests',
      user: req.session.user,
      requests: requests.rows
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error loading maintenance requests');
    res.redirect('/dashboard');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// Gallery page
router.get('/gallery', (req, res) => {
  res.render('gallery', { title: 'Photo Gallery' });
});

// Info page
router.get('/info', (req, res) => {
  res.render('info', { title: 'Property Information' });
});

// Floorplans page
router.get('/floorplans', (req, res) => {
  res.render('floorplans', { title: 'Floor Plans' });
});

// Contact page
router.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact Us' });
});

module.exports = router; 