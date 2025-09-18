const { default: axios } = require("axios");
const Order = require("../../../model/orderModel");
const User = require("../../../model/userModel");

exports.initiateKhaltiPayment = async (req, res) => {
  const {orderId, amount } = req.body;
  if (!orderId || !amount) {
    return res.status(400).json({
      message: "Order ID and amount are required"
    });
  }

  const order= await Order.findById(orderId).populate('items.product');
  if (!order) {
    return res.status(404).json({
      message: "Order not found with this ID"
    });
  }

  // Check if the user is authorized to make payment for this order
  if (order.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      message: "You are not authorized to make payment for this order"
    });
  }

  if (order.paymentDetails && order.paymentDetails.status === "paid") {
    return res.status(400).json({
      message: "This order is already paid"
    });
  }

// validate amount is totalAmount of order
 if(order.totalAmount !== amount) {
    return res.status(400).json({
      message: "Total amount is incorrect",
      calculatedTotal: order.totalAmount,
      providedTotal: amount,
    });
  }

  const data = {
      return_url : "http://localhost:5173/paymentsuccess",
      website_url : "http://localhost:5173",
      purchase_order_id: orderId,
      amount: amount * 100,
      purchase_order_name: "orderName_" + orderId,
  }
  const response = await axios.post(`${process.env.KHALTI_TEST}/epayment/initiate/`, data, {
    headers: {
      "Authorization": `Key ${process.env.KHALTI_SECRET_KEY}`
    }
  })
  console.log("Response from Khalti:", response);

  // **OR
  if (response.status == 200) {
    // Ensure paymentDetails is initialized
    if (!order.paymentDetails) {
      order.paymentDetails = {};
    }
    // Update the order with pidx and payment method
    order.paymentDetails.pidx = response.data.pidx;
    order.paymentDetails.method = "Khalti";
    await order.save();
    res.status(200).json({
      message: "Payment initiated successfully",
      data: response.data,
      paymentUrl: response.data.payment_url
    });
  }else{
    res.status(500).json({
      message: "Failed to initiate payment"
    });
  }
}

exports.verifyPidx = async (req, res) => {
  // const app = require("./../../../app")
  // const io = app.getSocketIo()
  const userId = req.user.id;
  const pidx = req.body.pidx
  const response = await axios.post(`${process.env.KHALTI_TEST}/epayment/lookup/`, {pidx}, {
    headers: {
      "Authorization": `Key ${process.env.KHALTI_SECRET_KEY}`
    }
  })
  if(response.data.status == "Completed") {
    // * Database update logic here
    // *Method 1: Using find() returns an array
    // const order = await Order.find({ "paymentDetails.pidx": pidx });
    // console.log("Order:", order)
    // order[0].paymentDetails.status = "paid";
    // await order[0].save();

    // *Method 2: Using findOne() returns object
    const order = await Order.findOne({ "paymentDetails.pidx": pidx })
    console.log("Order:", order)
    order.paymentDetails.status = "paid";
    await order.save();

    // Empty user cart after payment successful
    const user = await User.findById(userId);
    user.cart = [];
    await user.save();

    res.status(200).json({
      message: "Payment successful",
      data: response.data
    });




    //* Get socket.id of the requesting user
    // io.on("connection", (socket) => {
    //   io.to(socket.id).emit("payment", { message: "Payment successful", orderId: order._id});
    // });

    // **notify to the user about successful payment
    // io.emit("paymentSuccess", { message: "Payment successful", orderId: order._id })

    // return res.status(200).json({
    //   message: "Payment successful",
    //   data: response.data
    // });

    // *OR
    // res.redirect("http://localhost:3000/users/payment/success");
  }else{
    // **notify to the user about failed payment
    // io.on("connection", (socket) => {
    //   io.to(socket.id).emit("payment", { message: "Payment failed", pidx: pidx });
    // });
    // **OR
    // io.emit("paymentFailure", { message: "Payment failed", pidx: pidx })

    // return res.status(400).json({
    //   message: "Payment failed",
    //   data: response.data
    // });

    // *OR
    // res.redirect("http://localhost:3000/users/payment/failure");
  }
}


