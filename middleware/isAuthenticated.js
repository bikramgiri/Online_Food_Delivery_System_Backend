const jwt = require('jsonwebtoken');
const {promisify} = require('util');
const User = require('../model/userModel');

const isAuthenticated = async (req, res, next) => {
      const token = req.headers.authorization;
      if (!token) {
            return res.status(401).json({
                  message: "Unauthorized access, token is missing"
            });
      }
       
      // **Method 1: 
      // // Verify the token
      // jwt.verify(token, process.env.JWT_SECRET, (err, success) => {
      //       if (err) {
      //             return res.status(403).json({
      //                   message: "Forbidden access, invalid token"
      //             });
      //       } 
      //       next();
      // });


      // **Method 2: Using promisify
      const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
      if (!decoded) {
            return res.status(403).json({
                  message: "Forbidden access, invalid token"
            });
      }

      // check token is expired or not
      if (decoded.exp < Date.now() / 1000) { 
            return res.status(401).json({
                  message: "Unauthorized access, token is expired"
            });
      }

      // check if decoded.id(userId) exists in the user table
      const userExists = await User.findById(decoded.userId);
      if (!userExists) {
            return res.status(404).json({
                  message: "User not found"
            });
      }
      req.user = userExists; // Attach user to request object
      next();
};

module.exports = isAuthenticated;
