const User = require("../../../model/userModel");


exports.getUsers = async (req, res) => {
    const users = await User.find().select("-__v")
    if(users.length > 1){
            return res.status(200).json({
                  message: "Users fetched successfully",
                  users: users
            });
    }
      return res.status(404).json({
            message: "No users found",
            users: []
      });
}