const mongoose = require('mongoose')

exports.connectDatabase = async()=>{
      await mongoose.connect(process.env.MongoDB_URL, {
      }).then(() => {
            console.log("Database connected successfully");
      }).catch((error) => {
            console.error("Database connection error:", error);
      });
}

