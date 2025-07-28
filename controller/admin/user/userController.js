const User = require("../../../model/userModel");


exports.getUsers = async (req, res) => {
    const userId = req.user.id;
    const users = await User.find({_id : {$ne:userId}}).select("-__v") // ne = not equal to
    if(users.length > 1){
            return res.status(200).json({
                  message: "Users fetched successfully",
                  data: users
            });
    }
      return res.status(404).json({
            message: "No users found",
            data: []
      });
}

// delete user API
exports.deleteUser = async (req, res) => {
    const userId = req.params.id;
      if(!userId){
            return res.status(400).json({
                  message: "User ID is required"
            });
      }
    await User.findByIdAndDelete(userId);
    return res.status(200).json({
        message: "User deleted successfully",
        data: null
    });
}