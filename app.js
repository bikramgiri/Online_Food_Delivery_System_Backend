require('dotenv').config()
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

// Node js lai form bta aako data lai handle garna ko lagi
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
      origin: "http://localhost:5173", // React app ko port
}))

// Routes here
const authRoutes = require('./routes/authRoutes');

// *Database connection
const { connectDatabase } = require('./database/database');
connectDatabase()

app.get('/', (req,res)=>{
      res.status(200).json({
            message: "Welcome to Online Food Delivery System API"
      })
})

app.use('/', authRoutes);

// Server configuration
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});
