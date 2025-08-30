// Booking management routes

const express = require('express');
const { ObjectId } = require('mongodb');
const database = require('../database');
const { requireAuth } = require('../middleware/auth');
const { COLLECTIONS, BOOKING_STATUS } = require('../config/constants');

const router = express.Router();

/**
 * Get all user bookings
 * GET /api/bookings - Returns list of current user's bookings
 */
router.get('/', requireAuth, async (req, res) => {
  try {
    // Get database connection
    const db = database.getDb();
    if (!db) {
      return res.json({ success: false, message: 'Database not connected' });
    }
    
    // Find all bookings for current user, sorted by creation date (newest first)
    const userBookings = await db.collection(COLLECTIONS.BOOKINGS)
      .find({ user_id: new ObjectId(req.session.user.id) })
      .sort({ created_at: -1 }) // Sort by newest first
      .toArray();
    
    // Return user's bookings
    res.json({ success: true, bookings: userBookings });
  } catch (error) {
    // Log error and return error response
    console.error('Bookings retrieval error:', error);
    res.json({ success: false, message: 'Failed to retrieve bookings' });
  }
});

/**
 * Get specific booking details
 * GET /api/bookings/:id - Returns detailed information for specific booking
 */
router.get('/:id', requireAuth, async (req, res) => {
  try {
    // Get database connection
    const db = database.getDb();
    if (!db) {
      return res.json({ success: false, message: 'Database not connected' });
    }
    
    // Find booking by ID and ensure it belongs to current user
    const booking = await db.collection(COLLECTIONS.BOOKINGS)
      .findOne({ 
        _id: new ObjectId(req.params.id), // Match booking ID
        user_id: new ObjectId(req.session.user.id) // Ensure user owns this booking
      });
    
    // Check if booking exists and belongs to user
    if (!booking) {
      return res.json({ success: false, message: 'Booking not found or access denied' });
    }
    
    // Return booking details
    res.json({ success: true, booking });
  } catch (error) {
    // Log error and return error response
    console.error('Booking details error:', error);
    res.json({ success: false, message: 'Failed to retrieve booking details' });
  }
});

/**
 * Cancel a booking
 * POST /api/bookings/:id/cancel - Cancels user's booking if eligible
 */
router.post('/:id/cancel', requireAuth, async (req, res) => {
  try {
    // Get database connection
    const db = database.getDb();
    if (!db) {
      return res.json({ success: false, message: 'Database not connected' });
    }
    
    // Find booking to verify ownership and current status
    const booking = await db.collection(COLLECTIONS.BOOKINGS)
      .findOne({ 
        _id: new ObjectId(req.params.id),
        user_id: new ObjectId(req.session.user.id)
      });
    
    // Verify booking exists and belongs to user
    if (!booking) {
      return res.json({ success: false, message: 'Booking not found or access denied' });
    }
    
    // Check if booking is already cancelled
    if (booking.booking_status === BOOKING_STATUS.CANCELLED) {
      return res.json({ success: false, message: 'Booking is already cancelled' });
    }
    
    // Check if booking can be cancelled (not in the past)
    const checkinDate = new Date(booking.check_in);
    const currentDate = new Date();
    
    if (checkinDate <= currentDate) {
      return res.json({ 
        success: false, 
        message: 'Cannot cancel bookings that have already started or are in the past' 
      });
    }
    
    // Update booking status to cancelled
    const updateResult = await db.collection(COLLECTIONS.BOOKINGS).updateOne(
      { _id: new ObjectId(req.params.id) },
      { 
        $set: { 
          booking_status: BOOKING_STATUS.CANCELLED, // Set status to cancelled
          cancelled_at: new Date(), // Record cancellation timestamp
          updated_at: new Date() // Update modification timestamp
        }
      }
    );
    
    // Verify update was successful
    if (updateResult.modifiedCount === 0) {
      return res.json({ success: false, message: 'Failed to cancel booking' });
    }
    
    // Return success response
    res.json({ 
      success: true, 
      message: 'Booking cancelled successfully',
      booking_id: req.params.id
    });
  } catch (error) {
    // Log error and return error response
    console.error('Booking cancellation error:', error);
    res.json({ success: false, message: 'Failed to cancel booking' });
  }
});

module.exports = router;