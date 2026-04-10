import axios from 'axios';

const testAuth = async () => {
  const baseURL = 'http://localhost:5000/api/auth';
  
  console.log('--- Testing Register Validation ---');
  try {
    await axios.post(`${baseURL}/register`, {
      name: 'Y', // Too short
      email: 'invalid-email',
      password: '123' // Too short
    });
  } catch (error) {
    console.log('Status:', error.response.status);
    console.log('Response:', JSON.stringify(error.response.data, null, 2));
  }

  console.log('\n--- Testing Login Validation ---');
  try {
    await axios.post(`${baseURL}/login`, {
      email: 'not-an-email',
      password: ''
    });
  } catch (error) {
    console.log('Status:', error.response.status);
    console.log('Response:', JSON.stringify(error.response.data, null, 2));
  }
};

testAuth();
