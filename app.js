require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // Import the cookie-parser module for parsing cookies
const { multer, storage, upload } = require("./middleware/multerConfig"); // Import multer and storage configuration
// const upload = multer({storage: storage}) // Create an instance of multer with the storage configuration
// const { upload } = require('./middleware/multerConfig');
const { Server } = require("socket.io");
const User = require("./model/userModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

// Node js lai form bta aako data lai handle garna ko lagi
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*", // Allow all origins
  })
);
app.use(cookieParser()); // Middleware to parse cookies in the request

// Give access to storage folder images
app.use("/storage", express.static("storage")); // Serve static files from the storage directory
// or
// give access to images in storage folder
// app.use(express.static('storage'))

// *Routes here
const authRoutes = require("./routes/auth/authRoutes");
const ProductRoute = require("./routes/admin/productRoute");
const adminUsersRoute = require("./routes/admin/adminUsersRoute");
const dataServiceRoute = require("./routes/admin/dataServiceRoute");
const reviewRoute = require("./routes/user/reviewRoute");
const userProfileRoute = require("./routes/user/userProfileRoute");
const cartRoute = require("./routes/user/cartRoute");
const adminOrderRoute = require("./routes/admin/adminOrderRoute");
const userOrderRoute = require("./routes/user/userOrderRoute");
const paymentRoute = require("./routes/user/paymentRoute"); // Import the payment route

// *Database connection
const { connectDatabase } = require("./database/database");
connectDatabase();

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Online Food Delivery System",
  });
});

app.use("/auth", authRoutes);
app.use("/admin", ProductRoute);
app.use("/admin", adminUsersRoute);
app.use("/admin", dataServiceRoute);
app.use("/users", reviewRoute);
app.use("/users", userProfileRoute);
app.use("/users", cartRoute);
app.use("/admin", adminOrderRoute);
app.use("/users", userOrderRoute);
app.use("/users", paymentRoute);

// Server configuration
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
const io = new Server(server, {
  cors: "http://localhost:5173/",
});

let onlineUsers = [];

const addToOnlineUsers = (socketId, userId, role) => {
  onlineUsers = onlineUsers.filter((user) => user.userId !== userId);
  onlineUsers.push({ socketId, userId, role });
  console.log("Online Users: ", onlineUsers);
}

io.on("connection", async (socket) => {
  // *take the token and validate it
  // const token = socket.handshake.auth.token
  // or
  const { token } = socket.handshake.auth;
  if (token) {
    // validate the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(403).json({
        message: "Forbidden access, invalid token",
      });
    }

    // check token is expired or not
    if (decoded.exp < Date.now() / 1000) {
      return res.status(401).json({
        message: "Unauthorized access, token is expired",
      });
    }

    // check if decoded.id(userId) exists in the user table
    const userExists = await User.findById(decoded.userId);
    console.log("User Exists: ", userExists);
    if (!userExists) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    addToOnlineUsers(socket.id, userExists._id.toString(), userExists.role);
  }

  socket.on("updateOrderStatus", ({ orderId, status, userId }) => {
      const findUser = onlineUsers.find((user) => user.userId === userId);
      io.to(findUser?.socketId).emit("orderStatusUpdated", { orderId, status });
  });
  
});











// io.on("connection", (socket) => {
//     socket.on("register", async (data) => {
//             const { username, email, password, phoneNumber } = data;
//             // await User.create({
//             //       username: username,
//             //       email: email,
//             //       password: password,
//             //       phoneNumber: phoneNumber
//             // });
//             // socket.emit("response", { message: "User registered successfully" });
//             io.to(socket.id).emit("response", { message: "User registered successfully" });
//     });
// });

function getSocketIo() {
  return io;
}

module.exports.getSocketIo = getSocketIo;
