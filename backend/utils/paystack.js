// Paystack payment gateway utility functions

const https = require('https');
const { PAYSTACK_SECRET_KEY, API_ENDPOINTS } = require('../config/constants');

/**
 * Make HTTP request to Paystack API
 * @param {string} endpoint - API endpoint path
 * @param {string} method - HTTP method (GET, POST, etc.)
 * @param {Object} data - Request payload data
 * @returns {Promise} - Promise resolving to API response
 */
function makePaystackRequest(endpoint, method, data = null) {
  return new Promise((resolve, reject) => {
    // Configure HTTPS request options
    const options = {
      hostname: API_ENDPOINTS.PAYSTACK_BASE_URL, // Paystack API base URL
      path: endpoint, // Specific endpoint path
      method: method, // HTTP method
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`, // API authentication
        'Content-Type': 'application/json' // Request content type
      }
    };
    
    // Create HTTPS request
    const req = https.request(options, (res) => {
      let responseData = ''; // Buffer to collect response chunks
      
      // Collect response data chunks
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      // Process complete response
      res.on('end', () => {
        try {
          // Parse JSON response
          const parsedData = JSON.parse(responseData);
          resolve(parsedData);
        } catch (error) {
          // Handle JSON parsing errors
          reject(new Error('Invalid JSON response from Paystack'));
        }
      });
    });
    
    // Handle request errors
    req.on('error', (error) => {
      reject(new Error(`Paystack request failed: ${error.message}`));
    });
    
    // Send request data if provided
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    // Complete the request
    req.end();
  });
}

/**
 * Initialize payment transaction with Paystack
 * @param {Object} paymentData - Payment initialization data
 * @returns {Promise} - Promise resolving to initialization response
 */
async function initializePayment(paymentData) {
  try {
    // Make API call to initialize transaction
    const response = await makePaystackRequest(
      API_ENDPOINTS.TRANSACTION_INITIALIZE, 
      'POST', 
      paymentData
    );
    
    return response;
  } catch (error) {
    throw new Error(`Payment initialization failed: ${error.message}`);
  }
}

/**
 * Verify payment transaction with Paystack
 * @param {string} reference - Transaction reference to verify
 * @returns {Promise} - Promise resolving to verification response
 */
async function verifyPayment(reference) {
  try {
    // Make API call to verify transaction
    const response = await makePaystackRequest(
      `${API_ENDPOINTS.TRANSACTION_VERIFY}/${reference}`, 
      'GET'
    );
    
    return response;
  } catch (error) {
    throw new Error(`Payment verification failed: ${error.message}`);
  }
}

module.exports = {
  makePaystackRequest,
  initializePayment,
  verifyPayment
};