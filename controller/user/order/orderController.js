const Order = require("../../../model/orderModel");

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

      // Validate items
      if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                  message: "Items must be a non-empty array"
            });
      }

      // Validate each item in the order
      for (const item of items) {
            if (!item.product || !item.quantity) {
                  return res.status(400).json({
                        message: "Each item must have a product and quantity"
                  });
            }
      }

      // check order total amount
      const calculatedTotal = items.reduce((acc, item) => acc + (item.quantity * item.product.price), 0);
      if (calculatedTotal !== totalAmount) {
            return res.status(400).json({
                  message: "Total amount is incorrect"
            });
      }

      // check if order is already crearted
      const existingOrder = await Order.findOne({ user: userId, status: 'pending' });
      if (existingOrder) {
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