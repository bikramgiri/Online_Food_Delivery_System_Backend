const User = require("../../model/userModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require("../../services/sendEmail");

// User registration
exports.registerUser = async (req, res) => {
      const { username, email, password, phoneNumber } = req.body;

      // Check if all required fields are provided
      if (!username || !email || !password || !phoneNumber) {
            return res.status(400).json({ 
                  message: 'All fields are required' 
            });
      }

      // Validate email format like user@example.com
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
      const userData = await User.create({
            username: username,
            email: email,
            password: bcrypt.hashSync(password, 10), // Hash the password
            phoneNumber: phoneNumber
      });
      res.status(201).json({
            message: "User registered successfully",
            data: userData
      });
}

// User login
exports.loginUser = async (req, res) => {
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
      const userExist = await User.find({ 
            email: email 
      });
      if (!userExist || userExist.length === 0) {
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
      const isPasswordValid = bcrypt.compareSync(password, userExist[0].password);
      if (!isPasswordValid) {
            return res.status(401).json({
                  message: 'Invalid password'
            });
      }
      // Generate JWT token
      const token = jwt.sign({ userId: userExist[0]._id }, process.env.JWT_SECRET, {
            expiresIn: '1d' // Token expires in 1 day
            // token message
            
      });

     // Set the token as a cookie
      res.cookie('token', token, {
            httpOnly: true, // Prevent client-side access
            secure: process.env.NODE_ENV === 'production', // HTTPS in production, HTTP in development
            sameSite: 'strict', // Prevent CSRF attacks
            maxAge: 1 * 24 * 60 * 60 * 1000 // 1 day in milliseconds
      });

      // Successful login
      res.status(200).json({
            message: 'Login successful',
            data: userExist,
            token: token
      });
}

// logout user
exports.logout = (req,res)=>{
  res.clearCookie("token") // Clear the token cookie from the response
  res.status(200).json({
        message: "Logout successful"
  });
}

// forgot password
exports.forgotPassword = async (req, res) => {
      const { email } = req.body;

      // Check if email is provided
      if (!email) {
            return res.status(400).json({
                  message: 'Email is required'
            });
      }

      // Validate email format
      if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({
                  message: 'Invalid email format'
            });
      }

        // *for all email: tyo email ma otp pathaunae
        const allUsers = await User.find(); // Get all users from the database

      // Find user by email
      const emailExist = await User.find({ 
            email: email 
      });
      if (!emailExist || emailExist.length === 0) {
            return res.status(404).json({
                  message: 'User not found'
            });
      }

      // Generate OTP (One Time Password) for password reset by checking time by calculating otp generated time - current time
      const generateotp = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit OTP

      // Save OTP and OTP generated time to the user document
      emailExist[0].otp = generateotp; // Save OTP to user document
      emailExist[0].otpGeneratedTime = Date.now(); // Save OTP generated time
      await emailExist[0].save(); // Save the updated user document

          // // *for all email: tyo email ma otp pathaunae
    // for(let i = 0; i < allUsers.length; i++){
    //   await sendEmail({
    //     email : allUsers[i].email,
    //     subject : "OTP for password reset",
    //     otp : Math.floor(100000 + Math.random() * 900000) // Generate a random 6-digit OTP
    //   })
    // }

    // *for one email: tyo email ma otp pathaunae
      await sendEmail({
            email: email,
            subject: 'Password Reset OTP',
            otp: generateotp
      });

      res.status(200).json({
            message: 'OTP sent to your email for password reset'
      });
}


// verify otp
exports.verifyOtp = async (req, res) => {
      const { email, otp } = req.body;

      // Check if email and OTP are provided
      if (!email || !otp) {
            return res.status(400).json({
                  message: 'Email and OTP are required'
            });
      }

      // Find user by email
      const emailExist = await User.find({
            email: email
      });
      if (!emailExist || emailExist.length === 0) {
            return res.status(404).json({
                  message: 'User not found'
            });
      }

      // Check if OTP is valid
      if (emailExist[0].otp !== otp) {
            return res.status(400).json({
                  message: 'Invalid OTP'
            });
      }

      // Check if OTP is expired
      const currentTime = Date.now();
      const otpGeneratedTime = emailExist[0].otpGeneratedTime;
      const timeDifference = currentTime - otpGeneratedTime;
      const otpExpiryTime = 2 * 60 * 1000; // 2 minutes in milliseconds
      if (timeDifference > otpExpiryTime) { // Check if OTP has expired
            return res.status(400).json({
                  message: 'OTP has expired'
            });
      }

      // save the OTP
      emailExist[0].otp = otp; // Save OTP to user document
      emailExist[0].otpGeneratedTime = Date.now(); // Save OTP generated time
      await emailExist[0].save(); // Save the updated user document

      // OTP is valid and not expired
      res.status(200).json({
            message: 'OTP verified successfully'
      });
}


// change password
exports.changePassword = async (req, res) => {
      const { email, otp, newPassword, confirmPassword } = req.body;

      // Check if email and new password are provided
      if (!email || !otp || !newPassword || !confirmPassword) {
            return res.status(400).json({
                  message: 'Email, OTP, new password, and confirm password are required'
            });
      }

      // Validate email format
      if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({
                  message: 'Invalid email format'
            });
      }

      // Find user by email
      const emailExist = await User.find({ 
            email: email 
      });
      if (!emailExist || emailExist.length === 0) {
            return res.status(404).json({
                  message: 'User not found'
            });
      }

      // Check if OTP is valid
      if (emailExist[0].otp !== otp) {
            return res.status(400).json({
                  message: 'Invalid OTP'
            });
      }

      // Check if OTP is expired
      const currentTime = Date.now();
      const otpGeneratedTime = emailExist[0].otpGeneratedTime;
      const timeDifference = currentTime - otpGeneratedTime;
      const otpExpiryTime = 2 * 60 * 1000; // 2 minutes in milliseconds
      if (timeDifference > otpExpiryTime) { // Check if OTP has expired
            return res.status(400).json({
                  message: 'OTP has expired'
            });
      }

      // save the OTP
      emailExist[0].otp = otp; // Save OTP to user document
      emailExist[0].otpGeneratedTime = Date.now(); // Save OTP generated time
      await emailExist[0].save(); // Save the updated user document


      // Validate new password strength
      if (newPassword.length < 6) {
            return res.status(400).json({
                  message: 'New password must be at least 6 characters long'
            });
      }

      // Check if new password and confirm password match
      if (newPassword !== confirmPassword) {
            return res.status(400).json({
                  message: 'New password and confirm password do not match'
            });
      }

      // Update the user's password
      emailExist[0].password = bcrypt.hashSync(newPassword, 10); // Hash the new password
      await emailExist[0].save(); // Save the updated user document

      res.status(200).json({
            message: 'Password changed successfully'
      });
}

