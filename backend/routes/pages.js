// Routes for serving HTML pages

const express = require('express');
const path = require('path');
const router = express.Router();

/**
 * Serve homepage
 * GET / - Returns the main landing page
 */
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/pages/index.html'));
});

/**
 * Serve hotels listing page
 * GET /hotels - Returns page showing all available hotels
 */
router.get('/hotels', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/pages/hotels.html'));
});

/**
 * Serve individual hotel details page
 * GET /hotel/:id - Returns detailed view of specific hotel
 */
router.get('/hotel/:id', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/pages/hotel-details.html'));
});

/**
 * Serve booking confirmation page
 * GET /booking - Returns booking form and confirmation page
 */
router.get('/booking', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/pages/booking.html'));
});

/**
 * Serve user dashboard page
 * GET /dashboard - Returns user's booking management dashboard
 */
router.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/pages/dashboard.html'));
});

/**
 * Serve contact page
 * GET /contact - Returns contact form page
 */
router.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/pages/contact.html'));
});

/**
 * Serve deals and offers page
 * GET /deals - Returns special deals and promotions page
 */
router.get('/deals', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/pages/deals.html'));
});

/**
 * Serve about us page
 * GET /about - Returns company information page
 */
router.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/pages/about.html'));
});

/**
 * Serve authentication page (login/register)
 * GET /login - Returns login and registration forms
 */
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/pages/auth.html'));
});

module.exports = router;