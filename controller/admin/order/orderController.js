const Order = require("../../../model/orderModel");
const Product = require("../../../model/productModel");

// Get all orders for admin
exports.getsAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate({
      path: "items.product",
      model: "Product",
      select: "-__v",
    })
    .populate({
      // populate user username, and phoneNumber only
      path: "user",
      model: "User",
      select: "username phoneNumber",
    });
  if (orders.length === 0) {
    return res.status(404).json({
      message: "No orders found",
      data: [],
    });
  }
  return res.status(200).json({
    message: "Orders fetched successfully",
    data: orders,
  });
};

// get single order
exports.getSingleOrder = async (req, res) => {
  const orderId = req.params.id;

  // check if order exists
  const order = await Order.findById(orderId).populate({
    path: "items.product",
    model: "Product",
    select: "-__v",
  });
  if (!order) {
    return res.status(404).json({
      message: "Order not found",
    });
  }
  return res.status(200).json({
    message: "Order fetched successfully",
    data: order,
  });
};

// updateOrderStatus
exports.updateOrderStatus = async (req, res) => {
  const orderId = req.params.id;
  const { orderStatus } = req.body;

  // check if order exists
  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({
      message: "Order not found",
    });
  }

  // make admin unable to update cancelled order
  if (order.orderStatus === "Cancelled") {
    return res.status(400).json({
      message: "You cannot update a cancelled order",
    });
  }

  // validate status
  // if (!status || !['Pending', 'In Transit', 'Confirmed', 'Cancelled', 'Preparing'].includes(status)) {
  //       return res.status(400).json({
  //             message: "Invalid status"
  //       });
  // }

  // check user is admin
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "You are not authorized to update this order",
    });
  }

  const updateOrderStatus = await Order.findByIdAndUpdate(
    orderId,
    {
      orderStatus,
    },
    { new: true }
  )
    .populate({
      path: "items.product",
      model: "Product",
      select: "-__v",
    })
    .populate({
      path: "user",
      model: "User",
      select: "username phoneNumber",
    });

    let necessaryData
    if(orderStatus === "delivered") {
      necessaryData = updateOrderStatus.items.map(item => {
            return {
            productId: item.product._id,
            quantity: item.quantity,
            productStockQty: item.product.productStockQty
      }
    })
    for(var i = 0; i < necessaryData.length; i++){
            const item = necessaryData[i];
            await Product.findByIdAndUpdate(item.productId, {
                  productStockQty : item.productStockQty - item.quantity
            })
    }
}

  return res.status(200).json({
    message: "Order status updated successfully",
    data: updateOrderStatus,
    necessaryData : necessaryData,
  });
};

// updatePaymentStatus
exports.updatePaymentStatus = async (req, res) => {
  const orderId = req.params.id;
  const { paymentStatus } = req.body;

  // check if order exists
  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({
      message: "Order not found",
    });
  }

  // make admin unable to update cancelled order
  if (order.orderStatus === "Cancelled") {
    return res.status(400).json({
      message: "You cannot update a cancelled order payment status",
    });
  }

  // validate payment status
//   if (!paymentStatus || !['pending', 'paid', 'unpaid'].includes(paymentStatus)) {
//         return res.status(400).json({
//               message: "Invalid payment status"
//         });
//   }

  // check user is admin
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "You are not authorized to update this order",
    });
  }

  const updatePaymentStatus = await Order.findByIdAndUpdate(
    orderId,
    { "paymentDetails.status": paymentStatus },
    { new: true }
  ).populate({
      path: "items.product",
      model: "Product",
    })
    .populate('user');

    if (!updatePaymentStatus) {
    return res.status(500).json({
      message: "Failed to update payment status",
    });
  }

  return res.status(200).json({
    message: "Payment status updated successfully",
    data: updatePaymentStatus,
  });
};

// Delete order
exports.deleteOrder = async (req, res) => {
  const orderId = req.params.id;
  if (!orderId) {
    return res.status(400).json({
      message: "Order ID is required",
    });
  }

  // check if order exists
  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({
      message: "Order not found",
    });
  }
  // check user is admin
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "You are not authorized to delete this order",
    });
  }

  // delete order
  await Order.findByIdAndDelete(orderId);
  return res.status(200).json({
    message: "Order deleted successfully",
    data: null,
  });
};
