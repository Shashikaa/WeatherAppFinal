import React, { useState } from 'react';
import axios from 'axios';
import '../RegisterForm.css';

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [registrationError, setRegistrationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setEmailError('');
    setRegistrationError('');
    setMessage('');

    // Validate email format
    if (!validateEmail(email)) {
      setEmailError('Invalid email address.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/weather/register', { email, location });
      setMessage(response.data.message);
      if (response.data.message.includes('already registered')) {
        setRegistrationError('This email is already registered.');
      }
    } catch (error) {
      console.error('Error registering user:', error.message);
      if (error.response && error.response.data && error.response.data.message) {
        // Display specific error message from server if available
        setRegistrationError(error.response.data.message);
      } else {
        // Display general error message if no specific message is available
        setMessage('Registration failed. Please try again.');
      }
    }
  };

  // Function to validate email format
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  return (
    <div className="register-form">
      <h7>Get Daily Weather Updates to your Email every 24 hours.</h7>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {emailError && <p className="error">{emailError}</p>}
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      {registrationError && <p className="error">{registrationError}</p>}
      {message && !registrationError && <p>{message}</p>}
    </div>
  );
};

export default RegisterForm;
