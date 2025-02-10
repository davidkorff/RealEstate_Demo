const express = require('express');
const router = express.Router();
const pool = require('../db/config');
const isStaff = require('../middleware/isStaff');

// @route   GET /staff/dashboard
// @desc    Staff dashboard page
// @access  Private/Staff
router.get('/dashboard', isStaff, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                m.*,
                r.unit_number,
                r.first_name,
                r.last_name
            FROM maintenance_requests m
            JOIN residents r ON m.resident_id = r.id
            ORDER BY 
                CASE m.status
                    WHEN 'pending' THEN 1
                    WHEN 'in_progress' THEN 2
                    WHEN 'completed' THEN 3
                    ELSE 4
                END,
                m.created_at DESC
        `);

        res.render('staff/dashboard', {
            title: 'Staff Dashboard',
            requests: result.rows
        });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error loading maintenance requests');
        res.redirect('/dashboard');
    }
});

module.exports = router; 