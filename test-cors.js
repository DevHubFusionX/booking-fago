const http = require('http');

const data = JSON.stringify({
    email: 'test@example.com',
    password: 'password'
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'Origin': 'https://booking-fago.onrender.com' // Simulating production origin
    }
};

const req = http.request(options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);

    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
});

req.write(data);
req.end();
