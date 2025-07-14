const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
     username: {
       type: String,
       required: [true, 'Name is required']
      },
     email: {
       type: String,
       required: [true, 'Email is required'],
       unique: true
     },
     password: {
       type: String,
       required: [true, 'Password is required']
     },
    phoneNumber: {
        type: Number,
        required: [true, 'Phone number is required'],
        unique: true
      },
     role: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer'
      }
   }, {
     timestamps: true // Automatically manage createdAt and updatedAt fields
   });

const User = mongoose.model('User', userSchema);

module.exports = User;