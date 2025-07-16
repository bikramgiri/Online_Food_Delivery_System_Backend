const bcrypt = require('bcryptjs');
const User = require('./model/userModel');

const adminSeeder = async ()=>{
      // admin seeding

      // check wether admin exists or not
      const adminExists = await User.findOne({ email: "admin@gmail.com", role: "admin" });
      if (!adminExists) {
            await User.create({
            username: "Admin",
            email: "admin@gmail.com",
            password: bcrypt.hashSync("admin1", 10),
            phoneNumber: 9800000020,
            role: "admin"
      });
      } else {
            console.log("Admin already exists");
      }
}

module.exports = adminSeeder;