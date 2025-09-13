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
       unique: true,
       lowercase: true
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
      otp: {
        type: String,
        allowNull: true
      },
      otpGeneratedTime: {
        type: Date,
        default: Date.now,
        allowNull: true
      },
     role: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer'
      },
      cart : [{
        quantity: {
          type: Number,
          required: true,
          default: 1
        },
        product : {type: Schema.Types.ObjectId, ref: 'Product'}
      }]
   }, {
     timestamps: true // Automatically manage createdAt and updatedAt fields
   });

const User = mongoose.model('User', userSchema);

module.exports = User;