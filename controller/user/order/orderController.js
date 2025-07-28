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

      // validate shipping address
      if (!shippingAddress || typeof shippingAddress !== 'string') {
            return res.status(400).json({
                  message: "Invalid shipping address"
            });
      }

      // validate payment details
      if (!paymentDetails || !paymentDetails.method || !paymentDetails.status) {
            return res.status(400).json({
                  message: "Invalid payment details"
            });
      }

      // check if order is already created
      const existingOrderCheck = await Order.findOne({ user: userId, status: 'pending' });
      if (existingOrderCheck && existingOrderCheck._id.toString() !== orderId) {
            return res.status(400).json({
                  message: "An order is already in progress"
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
      
      // make user able to change order status to cancelled only when the order is pending
      const { status } = req.body
      if (req.body.status === 'cancelled') {
            if (existingOrder.status !== 'pending') {
                  return res.status(400).json({
                        message: "You can only cancel a pending order"
                  });
            }
      }

      // update order status to cancelled only if the order is pending
      if (existingOrder.status === 'cancelled') {
            return res.status(400).json({
                  message: "Order is already cancelled"
            });
      }

      const updateOrderStatus = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
      return res.status(200).json({
            message: "Order status updated successfully",
            data: updateOrderStatus
      });
}