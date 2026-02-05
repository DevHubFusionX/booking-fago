// Routes for serving HTML pages

const express = require('express');
const path = require('path');
const router = express.Router();

/**
 * Serve homepage
 * GET / - Returns the main landing page
 */
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

router.get('/hotels', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/hotels.html'));
});

router.get('/hotel/:id', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/hotel-details.html'));
});

router.get('/booking', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/booking.html'));
});

router.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dashboard.html'));
});

router.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/contact.html'));
});

router.get('/deals', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/deals.html'));
});

router.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/about.html'));
});

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/auth.html'));
});

module.exports = router;