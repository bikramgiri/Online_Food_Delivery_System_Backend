require('dotenv').config()
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser') // Import the cookie-parser module for parsing cookies
const {multer,storage} = require('./middleware/multerConfig'); // Import multer and storage configuration
const upload = multer({storage: storage}) // Create an instance of multer with the storage configuration


// Node js lai form bta aako data lai handle garna ko lagi
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
      origin: "http://localhost:5173", // React app ko port
}))
app.use(cookieParser()) // Middleware to parse cookies in the request

// Give access to storage folder images
app.use('/storage', express.static('storage')) // Serve static files from the storage directory
// or
// give access to images in storage folder
// app.use(express.static('storage'))

// Routes here
const authRoutes = require('./routes/auth/authRoutes');
const ProductRoute = require('./routes/admin/productRoute');
const adminUsersRoute = require('./routes/admin/adminUsersRoute');
const reviewRoute = require('./routes/user/reviewRoute'); 
const userProfileRoute = require('./routes/user/userProfileRoute');
const cartRoute = require('./routes/user/cartRoute');
const adminOrderRoute = require('./routes/admin/adminOrderRoute');
const userOrderRoute = require('./routes/user/userOrderRoute');

// *Database connection
const { connectDatabase } = require('./database/database');
connectDatabase()

app.get('/', (req,res)=>{
      res.status(200).json({
            message: "Welcome to Online Food Delivery System API"
      })
})

app.use('/', authRoutes);
app.use('/', ProductRoute);
app.use('/admin/', adminUsersRoute);
app.use('/users/', reviewRoute);
app.use('/users/', userProfileRoute);
app.use('/users/', cartRoute);
app.use('/admin/', adminOrderRoute);
app.use('/users/', userOrderRoute);

// Server configuration
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});
