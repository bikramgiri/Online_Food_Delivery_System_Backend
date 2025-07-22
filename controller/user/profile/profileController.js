const User = require("../../../model/userModel")
const bcrypt = require('bcryptjs');

// View my profile
exports.getMyProfile = async (req, res) => {
      const userId = req.user.id
      // Validate user ID
      if (!userId) {
            return res.status(400).json({
                  message: "User ID is required"
            });
      }
      const myProfile = await User.findById(userId)
      //send response
      res.status(200).json({
            message: "Profile fetched successfully",
            data: myProfile
      });
}

// Update my profile
exports.updateMyProfile = async (req, res) => {
      const userId = req.user.id;
      const { username, email, phoneNumber } = req.body;

      // Validate request body
      if (!username || !email || !phoneNumber ) {
            return res.status(400).json({
                  message: "Username, email, and phone number are required"
            });
      }

      // Update user profile
      const updatedUser = await User.findByIdAndUpdate(userId, {
            username,
            email,
            phoneNumber
      }, { runValidators: true });

      if (!updatedUser) {
            return res.status(404).json({
                  message: "User not found",
                  data: null
            });
      }

      return res.status(200).json({
            message: "Profile updated successfully",
            data: updatedUser
      });
}

// Update my password
exports.updateMyPassword = async (req, res) => {
      const userId = req.user.id;
      // Validate user ID
      if (!userId) {
            return res.status(400).json({
                  message: "User ID is required"
            });
      }

      const { oldPassword, newPassword, confirmPassword } = req.body;

      // Validate request body
      if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                  message: "Old password, new password, and confirm password are required"
            });
      }

      // validate new password muste be at least 6 characters long
      if (newPassword.length < 6) {
            return res.status(400).json({
                  message: "New password must be at least 6 characters long"
            });
      }

      // Find user by ID
      const user = await User.findById(userId);
      if (!user) {
            return res.status(404).json({
                  message: "User not found"
            });
      }

      // Check if old password matches
      const isMatchOldPassword = await user.comparePassword(oldPassword);
      if (!isMatchOldPassword) {
            return res.status(401).json({
                  message: "Old password is incorrect"
            });
      }

      // Check if new password and confirm password match
      if (newPassword !== confirmPassword) {
            return res.status(400).json({
                  message: "New password and confirm password do not match"
            });
      }

      // Update password
      user.password = bcrypt.hashSync(newPassword, 10);
      await user.save();

      return res.status(200).json({
            message: "Password updated successfully"
      });
};

// Delete my profile
exports.deleteMyProfile = async (req, res) => {
      const userId = req.user.id;

      // Validate user ID
      if (!userId) {
            return res.status(400).json({
                  message: "User ID is required"
            });
      }

      // Find and delete user profile
      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) {
            return res.status(404).json({
                  message: "User not found",
                  data: null
            });
      }

      return res.status(200).json({
            message: "Profile deleted successfully",
            data: null
      });
};

