require('dotenv').config()
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Node js lai form bta aako data lai handle garna ko lagi
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
      origin: "http://localhost:5173", // React app ko port
}))

const User = require('./model/userModel');


// *Database connection
const { connectDatabase } = require('./database/database');
connectDatabase()


app.get('/', (req,res)=>{
      res.status(200).json({
            message: "Welcome to Online Food Delivery System API"
      })
})

// user register
app.post('/register', async (req, res) => {
      const { username, email, password, phoneNumber } = req.body;

      // Check if all required fields are provided
      if (!username || !email || !password || !phoneNumber) {
            return res.status(400).json({ 
                  message: 'All fields are required' 
            });
      }

      // Validate email format
      if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({
                  message: 'Invalid email format'
            });
      }

      // Check if the user already exists
      const existingUser = await User.find({ 
            email: email 
      });
      if (existingUser.length > 0) {
            return res.status(400).json({
                  message: 'User already exists'
            });
      }

      // Validate password strength
      if (password.length < 6) {
            return res.status(400).json({
                  message: 'Password must be at least 6 characters long'
            });
      }

      // Validate phone number
      if (!/^\d{10}$/.test(phoneNumber)) { // Check if phone number is 10 digits
            return res.status(400).json({
                  message: 'Invalid phone number format. It should be 10 digits.'
            });
      }

      // Check if the phone number already exists
      const existingPhoneNumber = await User.find({ phoneNumber: phoneNumber });
      if (existingPhoneNumber.length > 0) {
            return res.status(400).json({
                  message: 'Phone number already exists'
            });
      }

      // else create a new user
      await User.create({
            username: username,
            email: email,
            password: bcrypt.hashSync(password, 10), // Hash the password
            phoneNumber: phoneNumber
      });
      res.status(201).json({
            message: "User registered successfully"
      });
});


// *User login
app.post('/login', async (req, res) => {
      const { email, password } = req.body;

      // Check if email and password are provided
      if (!email || !password) {
            return res.status(400).json({
                  message: 'Email and password are required'
            });
      }

      // Validate email format
      if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({
                  message: 'Invalid email format'
            });
      }

      // Find user by email
      const user = await User.find({ 
            email: email 
      });
      if (!user || user.length === 0) {
            return res.status(404).json({
                  message: 'User not found'
            });
      }

      // Validate password strength
      if (password.length < 6) {
            return res.status(400).json({
                  message: 'Password must be at least 6 characters long'
            });
      }

      // Check password
      const isPasswordValid = bcrypt.compareSync(password, user[0].password);
      if (!isPasswordValid) {
            return res.status(401).json({
                  message: 'Invalid password'
            });
      }
      // Generate JWT token
      const token = jwt.sign({ userId: user[0]._id }, process.env.JWT_SECRET, {
            expiresIn: '2m' // Token expires in 2 minutes
            // token message
            
      });

      // Successful login
      res.status(200).json({
            message: 'Login successful',
            token: token
      });
});



// Server configuration
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});
