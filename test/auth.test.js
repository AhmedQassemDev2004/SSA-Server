const axios = require('axios');

// Base URL for the API
const API_URL = 'http://localhost:3000';

// Test user data
const testUser = {
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User',
  phone: '1234567890'
};

let token;

// Test registration
async function testRegistration() {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, testUser);
    console.log('Registration successful:', response.data);
    token = response.data.token; // Store token from registration
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error.response?.data || error.message);
    throw error;
  }
}

// Test login
async function testLogin() {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('Login successful:', response.data);
    token = response.data.token;
    return response.data;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    throw error;
  }
}

// Test accessing a protected route
async function testProtectedRoute() {
  try {
    const response = await axios.get(`${API_URL}/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Protected route access successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Protected route access failed:', error.response?.data || error.message);
    throw error;
  }
}

// Run the tests
async function runTests() {
  try {
    await testRegistration();
    await testLogin();
    await testProtectedRoute();
    console.log('All tests passed!');
  } catch (error) {
    console.error('Tests failed!');
  }
}

runTests();
