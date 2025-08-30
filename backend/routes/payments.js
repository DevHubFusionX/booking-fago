// Payment processing routes using Paystack

const express = require('express');
const { ObjectId } = require('mongodb');
const database = require('../database');
const { requireAuth } = require('../middleware/auth');
const { initializePayment, verifyPayment } = require('../utils/paystack');
const { COLLECTIONS, PAYMENT_STATUS } = require('../config/constants');

const router = express.Router();

/**
 * Initialize payment transaction
 * POST /api/payment/initialize - Creates payment session with Paystack
 */
router.post('/initialize', requireAuth, async (req, res) => {
  // Extract payment data from request body
  const { email, amount, hotelId, bookingData } = req.body;
  
  // Validate required fields
  if (!email || !amount || !hotelId || !bookingData) {
    return res.json({ 
      success: false, 
      message: 'Missing required payment information' 
    });
  }
  
  // Prepare payment data for Paystack
  const paymentData = {
    email, // Customer email address
    amount: amount * 100, // Convert naira to kobo (Paystack requirement)
    currency: 'NGN', // Nigerian Naira
    callback_url: `${req.protocol}://${req.get('host')}/api/payment/verify`, // Verification URL
    metadata: {
      hotel_id: hotelId, // Hotel being booked
      user_id: req.session.user.id, // Current user ID
      booking_data: JSON.stringify(bookingData) // Booking details as JSON string
    }
  };
  
  try {
    // Initialize payment with Paystack
    const response = await initializePayment(paymentData);
    
    // Check if initialization was successful
    if (response.status) {
      // Return payment URL and reference to frontend
      res.json({ 
        success: true, 
        authorization_url: response.data.authorization_url, // Paystack payment page URL
        reference: response.data.reference // Transaction reference for tracking
      });
    } else {
      // Paystack returned error
      console.error('Paystack initialization error:', response);
      res.json({ 
        success: false, 
        message: response.message || 'Payment initialization failed' 
      });
    }
  } catch (error) {
    // Handle service errors
    console.error('Payment service error:', error);
    res.json({ 
      success: false, 
      message: 'Payment service error: ' + error.message 
    });
  }
});

/**
 * Verify payment and create booking
 * GET /api/payment/verify - Verifies payment with Paystack and saves booking
 */
router.get('/verify', async (req, res) => {
  // Get transaction reference from query parameters
  const { reference } = req.query;
  
  // Validate reference exists
  if (!reference) {
    return res.redirect('/booking?error=missing_reference');
  }
  
  try {
    // Verify payment with Paystack
    const response = await verifyPayment(reference);
    
    // Check if payment was successful
    if (response.status && response.data.status === 'success') {
      // Extract booking information from payment metadata
      const metadata = response.data.metadata;
      const bookingData = JSON.parse(metadata.booking_data);
      
      // Get database connection
      const db = database.getDb();
      if (db) {
        // Create new booking record
        const newBooking = {
          user_id: new ObjectId(metadata.user_id), // User who made booking
          hotel_id: metadata.hotel_id, // Hotel being booked
          hotel_name: bookingData.hotelName, // Hotel name for display
          hotel_location: bookingData.hotelLocation, // Hotel location
          room_type: bookingData.roomType || 'Standard Room', // Room type
          check_in: bookingData.checkin, // Check-in date
          check_out: bookingData.checkout, // Check-out date
          guests: bookingData.guests || 1, // Number of guests
          nights: bookingData.nights || 1, // Number of nights
          price_per_night: bookingData.pricePerNight || 0, // Nightly rate
          subtotal: bookingData.subtotal || 0, // Subtotal before fees
          service_fee: bookingData.serviceFee || 0, // Service fee
          total_amount: response.data.amount / 100, // Total paid (convert from kobo)
          payment_status: PAYMENT_STATUS.PAID, // Mark as paid
          booking_status: 'confirmed', // Confirm booking
          transaction_reference: reference, // Paystack reference
          guest_details: bookingData.guestDetails || {}, // Guest information
          created_at: new Date(), // Booking creation time
          updated_at: new Date() // Last update time
        };
        
        // Insert booking into database
        const bookingResult = await db.collection(COLLECTIONS.BOOKINGS).insertOne(newBooking);
        
        // Create payment record for accounting
        const paymentRecord = {
          booking_id: bookingResult.insertedId, // Link to booking
          user_id: new ObjectId(metadata.user_id), // User who paid
          amount: response.data.amount / 100, // Amount paid (in naira)
          currency: 'NGN', // Currency
          status: PAYMENT_STATUS.PAID, // Payment status
          transaction_reference: reference, // Paystack reference
          paystack_response: {
            paid_at: response.data.paid_at, // Payment timestamp
            channel: response.data.channel, // Payment method (card, bank, etc.)
            authorization: response.data.authorization // Payment authorization details
          },
          created_at: new Date() // Payment record creation time
        };
        
        // Insert payment record into database
        await db.collection(COLLECTIONS.PAYMENTS).insertOne(paymentRecord);
      }
      
      // Redirect to success page with reference
      res.redirect('/booking?success=true&ref=' + reference);
    } else {
      // Payment failed or was not successful
      res.redirect('/booking?error=payment_failed');
    }
  } catch (error) {
    // Handle verification errors
    console.error('Payment verification error:', error);
    res.redirect('/booking?error=verification_failed');
  }
});

module.exports = router;