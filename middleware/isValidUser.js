// for all projects: For edit and delete operations, check if the user is authorized to perform the action

const Product = require("../model/productModel");

exports.isValidUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const userId = req.userId; // Get the authenticated user's ID from the request object
    const product = await Product.findAll({
        where: {
            id: id
        }
    });
    if(product[0].userId !== userId){ // Check if the product's userId matches the authenticated user's ID
        return res.send("You are not authorized to edit this product"); // If not, return an error response
    }
    next();
  } catch (error) {
    console.error('Error in isValidUser:', error);
    res.status(500).send('Internal Server Error');
  }
}




