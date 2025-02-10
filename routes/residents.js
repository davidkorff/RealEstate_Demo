const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pool = require('../db/config');

// @route   GET api/residents/profile
// @desc    Get resident profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const profile = await pool.query(
      'SELECT id, email, unit_number, first_name, last_name FROM residents WHERE id = $1',
      [req.user.id]
    );

    if (profile.rows.length === 0) {
      return res.status(404).json({ msg: 'Profile not found' });
    }

    res.json(profile.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/residents/profile
// @desc    Update resident profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  const { first_name, last_name, email } = req.body;

  try {
    const updatedProfile = await pool.query(
      'UPDATE residents SET first_name = $1, last_name = $2, email = $3 WHERE id = $4 RETURNING *',
      [first_name, last_name, email, req.user.id]
    );

    res.json(updatedProfile.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router; 