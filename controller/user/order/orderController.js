const Order = require("../../../model/orderModel");
const Product = require("../../../model/productModel");

// Create a new order
exports.createOrder = async (req, res) => {
      const userId = req.user.id;
      if (!userId) {
        return res.status(400).json({
            message: "User ID is required"
        });
      }
      const { items, totalAmount, shippingAddress, paymentDetails } = req.body;
      if (!items || !totalAmount || !shippingAddress || !paymentDetails) {
            return res.status(400).json({
                  message: "items, total amount, shipping address, and payment details are required"
            });
      }

      // check items must have product and quantity
      if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                  message: "Items must be a non-empty array"
            });
      }
      for (const item of items) {
            if (!item.product || !item.quantity) {
                  return res.status(400).json({
                        message: "Each item must have a product and quantity"
                  });
            }
      }

      // Fetch product prices from product IDs
      const productIds = items.map(item => item.product);
      const products = await Product.find({ _id: { $in: productIds } }).select('productPrice');
      if (products.length !== productIds.length) {
            return res.status(400).json({
                  message: "One or more products not found"
            });
      }

      // Create a map of product IDs to prices
      const productPriceMap = products.reduce((map, product) => {
            map[product._id.toString()] = product.productPrice;
            return map;
      }, {});

      // Calculate total amount
      const calculatedTotal = items.reduce((acc, item) => {
            const price = productPriceMap[item.product];
            if (!price) {
                  throw new Error(`Price not found for product ${item.product}`);
            }
            return acc + (item.quantity * price);
      }, 0);

      // Validate total amount
      if (calculatedTotal !== totalAmount) {
            return res.status(400).json({
                  message: "Total amount is incorrect",
                  calculatedTotal,
                  providedTotal: totalAmount
            });
      }

      // Validate shipping address
      if (!shippingAddress || typeof shippingAddress !== 'string') {
            return res.status(400).json({
                  message: "Invalid shipping address"
            });
      }

      // validate payment details as payment method must be either 'Cash on Delivery' or 'Khalti'
      if (!paymentDetails || !['Cash on Delivery', 'Khalti'].includes(paymentDetails.method)) {
            return res.status(400).json({
                  message: "Invalid payment method"
            });
      }

      // check if order is already exists or not by userId and productId
      const existingOrderCheck = await Order.findOne({ user: userId, product: { $in: productIds }, status: 'pending' });
      if (existingOrderCheck) {
            return res.status(400).json({
                  message: "An order is already in progress"
            });
      }

      const order = await Order.create({
            user: userId,
            items,
            totalAmount,
            shippingAddress,
            paymentDetails
      });
      return res.status(201).json({
            message: "Order created successfully",
            data: order
      });
}

// Get all orders 
exports.getsMyOrders = async (req, res) => {
      const userId = req.user.id;
      if (!userId) {
        return res.status(400).json({
            message: "User ID is required"
        });
      }
      const orders = await Order.find({ user: userId }).populate({
            path: "items.product",
            model: "Product",
            select: "-productStatus -__v -productStockQty -createdAt -updatedAt"
      });
      if (orders.length === 0) {
            return res.status(404).json({
                  message: "No orders found for this user",
                  data: []
            });
      }
      return res.status(200).json({
            message: "Orders fetched successfully",
            data: orders
      });
}


// update order
exports.updateMyOrder = async (req, res) => {
      const userId = req.user.id;
      if (!userId) {
        return res.status(400).json({
            message: "User ID is required"
        });
      }
      const orderId = req.params.id;
      if (!orderId) {
        return res.status(400).json({
            message: "Order ID is required"
        });
      }

      const {items, totalAmount, shippingAddress, paymentDetails} = req.body;
      if (!items || !totalAmount || !shippingAddress || !paymentDetails) {
            return res.status(400).json({
                  message: "items, total amount, shipping address, and payment details are required"
            });
      }

      // check items must have product and quantity
      if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                  message: "Items must be a non-empty array"
            });
      }
      for (const item of items) {
            if (!item.product || !item.quantity) {
                  return res.status(400).json({
                        message: "Each item must have a product and quantity"
                  });
            }
      }

      // Fetch product prices from product IDs
      const productIds = items.map(item => item.product);
      const products = await Product.find({ _id: { $in: productIds } }).select('productPrice');
      if (products.length !== productIds.length) {
            return res.status(400).json({
                  message: "One or more products not found"
            });
      }

      // Create a map of product IDs to prices
      const productPriceMap = products.reduce((map, product) => {
            map[product._id.toString()] = product.productPrice;
            return map;
      }, {});

      // Calculate total amount
      const calculatedTotal = items.reduce((acc, item) => {
            const price = productPriceMap[item.product];
            if (!price) {
                  throw new Error(`Price not found for product ${item.product}`);
            }
            return acc + (item.quantity * price);
      }, 0);

      // Validate total amount
      if (calculatedTotal !== totalAmount) {
            return res.status(400).json({
                  message: "Total amount is incorrect",
                  calculatedTotal,
                  providedTotal: totalAmount
            });
      }

      // Validate shipping address
      if (!shippingAddress || typeof shippingAddress !== 'string') {
            return res.status(400).json({
                  message: "Invalid shipping address"
            });
      }

      // validate payment details as payment method must be either 'Cash on Delivery' or 'Khalti'
      if (!paymentDetails || !['Cash on Delivery', 'Khalti'].includes(paymentDetails.method)) {
            return res.status(400).json({
                  message: "Invalid payment method"
            });
      }

      // get order of above orderId
      const existingOrder = await Order.findById(orderId);
      if (!existingOrder) {
            return res.status(404).json({
                  message: "Order not found"
            });
      }
      
      // check if the order belongs to the user
      if (existingOrder.user.toString() !== userId) {
            return res.status(403).json({
                  message: "You are not authorized to update this order"
            });
      }

      // check if order status is shipped, you are not allowed to update it
      if (existingOrder.orderStatus === 'shipped' || existingOrder.orderStatus === 'delivered' || existingOrder.orderStatus === 'preparing') {
            return res.status(400).json({
                  message: "You cannot update a shipped, delivered, or preparing order"
            });
      }

      // update order
      const updatedOrder = await Order.findByIdAndUpdate(orderId, {
            items,
            totalAmount,
            shippingAddress,
            paymentDetails
      }, { new: true });

      return res.status(200).json({
            message: "Order updated successfully",
            data: updatedOrder
      });
}


// Delete order
exports.deleteMyOrder = async (req, res) => {
      const userId = req.user.id;
      if (!userId) {
        return res.status(400).json({
            message: "User ID is required"
        });
      }
      const orderId = req.params.id;
      if (!orderId) {
        return res.status(400).json({
            message: "Order ID is required"
        });
      }

      // get order of above orderId
      const existingOrder = await Order.findById(orderId);
      if (!existingOrder) {
            return res.status(404).json({
                  message: "Order not found"
            });
      }

      // check if the order belongs to the user
      if (existingOrder.user.toString() !== userId) {
            return res.status(403).json({
                  message: "You are not authorized to delete this order"
            });
      }

      // check if order status is shipped, you are not allowed to delete it
      if (existingOrder.orderStatus === 'shipped' || existingOrder.orderStatus === 'preparing') {
            return res.status(400).json({
                  message: "You cannot delete a shipped or preparing order"
            });
      }

      // delete order
      await Order.findByIdAndDelete(orderId);
      return res.status(200).json({
            message: "Order deleted successfully",
            data: null
      });
}

// change order status
exports.cancelMyOrder = async (req, res) => {
      const userId = req.user.id;
      if (!userId) {
        return res.status(400).json({
            message: "User ID is required"
        });
      }
      const orderId = req.params.id;
      if (!orderId) {
        return res.status(400).json({
            message: "Order ID is required"
        });
      }


      // get order of above orderId
      const existingOrder = await Order.findById(orderId);
      if (!existingOrder) {
            return res.status(404).json({
                  message: "Order not found"
            });
      }

      // check if the order belongs to the user
      if (existingOrder.user.toString() !== userId) {
            return res.status(403).json({
                  message: "You are not authorized to change the status of this order"
            });
      }

      // update order status to cancelled only if the order is pending
      if (existingOrder.orderStatus === 'cancelled') {
            return res.status(400).json({
                  message: "Order is already cancelled"
            });
      }

      // Allow cancellation only for pending orders
      if (existingOrder.orderStatus !== 'pending') {
            return res.status(400).json({
                  message: "You can only cancel a pending order"
            });
      }

      const updateOrderStatus = await Order.findByIdAndUpdate(orderId, {
            orderStatus: 'cancelled'
      }, { new: true });
      return res.status(200).json({
            message: "Order status updated successfully",
            data: updateOrderStatus
      });
}