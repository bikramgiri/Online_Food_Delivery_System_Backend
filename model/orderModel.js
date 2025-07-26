const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
      user : {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      items: [{
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: {
          type: Number,
          required: true
        }
      }],
      totalAmount: {
        type: Number,
        required: true
      },
      shippingAddress: {
        type: String,
        required: true
      },
      status: {
        type: String,
        enum: ['pending', 'shipped', 'delivered', 'cancelled', 'preparing'],
        default: 'pending'
      },
      paymentDetails: {
        method: {
          type: String,
          enum: ['Cash on Delivery', 'Khalti'],
          required: true
        },
        status: {
          type: String,
          enum: ['pending', 'paid', 'unpaid'],
          default: 'pending'
        }
      },
}, { timestamps: true
})

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;