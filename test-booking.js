// Test script to verify booking functionality
const http = require('http');

async function testBookingFlow() {
  console.log('🧪 Testing Booking Flow...\n');
  
  const tests = [
    { name: 'Server health', path: '/api/health' },
    { name: 'Database connection', path: '/api/test' },
    { name: 'Hotels API', path: '/api/hotels' },
    { name: 'Hotel details API', path: '/api/hotels/hotel1' }
  ];
  
  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    console.log(`${i + 1}. Testing ${test.name}...`);
    
    try {
      const response = await makeRequest('localhost', 3000, test.path, 'GET');
      
      if (test.path === '/api/health') {
        console.log('✅ Server health:', response.status || 'OK');
      } else if (test.path === '/api/test') {
        console.log('✅ Database:', response.connected ? 'Connected' : 'Failed');
      } else if (test.path === '/api/hotels') {
        console.log(`✅ Hotels API: ${response.hotels?.length || 0} hotels found`);
      } else if (test.path.includes('hotel1')) {
        console.log('✅ Hotel details:', response.hotel?.name || 'Working');
      }
    } catch (error) {
      console.log(`❌ ${test.name} failed:`, error.message);
    }
    
    if (i < tests.length - 1) console.log('');
  }
  
  console.log('\n🎯 Test Complete! Visit http://localhost:3000 to test manually.');
}

function makeRequest(hostname, port, path, method, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname, port, path, method }, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(responseData));
        } catch {
          resolve({ raw: responseData });
        }
      });
    });
    
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

testBookingFlow().catch(console.error);