const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
     productName: {
       type: String,
       required: [true, 'Name is required']
      },
      productImage: {
        type: String,
        required: [true, 'Image is required']
      },
     productStockQty: {
       type: Number,
       required: [true, 'Quantity is required']
     },
     productPrice: {
       type: Number,
       required: [true, 'Price is required']
     },
      productStatus: {
        type: String,
        enum: ['Available', 'Unavailable']
      },
     productDescription: {
       type: String,
       required: [true, 'Description is required']
     }
   }, {
     timestamps: true // Automatically manage createdAt and updatedAt fields
   });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;