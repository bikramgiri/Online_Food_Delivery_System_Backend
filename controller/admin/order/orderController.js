const Order = require("../../../model/orderModel");

// Get all orders for admin
exports.getsAllOrders = async (req, res) => {
      const orders = await Order.find().populate({
            path: "items.product",
            model: "Product",
            select: "-productStatus -__v -productStockQty -createdAt -updatedAt"
      });
      if(orders.length === 0) {
            return res.status(404).json({
                  message: "No orders found",
                  data: []
            });
      }
      return res.status(200).json({
            message: "Orders fetched successfully",
            data: orders
      });
}