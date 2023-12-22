const Cart = require('../model/cartModel');
const Product = require('../model/productModel');
const {successMsg, errorMsg} = require('../utils/response');

const cartController = {
  addItemToCart: async (req, res) => {
    const {userId, productId, quantity} = req.body;

    if (!quantity || isNaN(quantity)) {
      return errorMsg(res, 'Invalid quantity provided', 400);
    }

    const numericQuantity = parseInt(quantity, 10);

    try {
      let cart = await Cart.findOne({userId});

      if (cart) {
        let itemIndex = cart.products.findIndex(p => p.cartItem == productId);

        if (itemIndex > -1) {
          let productItem = cart.products[itemIndex];
          productItem.quantity += numericQuantity;
          cart.products[itemIndex] = productItem;
        } else {
          cart.products.push({cartItem: productId, quantity: numericQuantity});
        }
        cart = await cart.save();
        successMsg(res, 'Item added to cart', cart);
      } else {
        const newCart = await Cart.create({
          userId,
          products: [{cartItem: productId, quantity: numericQuantity}],
        });
        successMsg(res, 'Cart created and item added', newCart, 201);
      }
    } catch (error) {
      errorMsg(res, 'Error adding item to cart', 500, error.message);
    }
  },

  getCart: async (req, res) => {
    const {userId} = req.params;

    try {
      const cart = await Cart.findOne({userId}).populate('products.cartItem');
      if (!cart) {
        return errorMsg(res, 'Cart not found', 404);
      }
      successMsg(res, 'Cart retrieved successfully', cart);
    } catch (error) {
      errorMsg(res, 'Error retrieving cart', 500, error.message);
    }
  },

  removeItemFromCart: async (req, res) => {
    const {userId, productId} = req.body;

    try {
      let cart = await Cart.findOne({userId});

      if (!cart) {
        return errorMsg(res, 'Cart not found', 404);
      }

      const itemIndex = cart.products.findIndex(p => p.cartItem == productId);
      if (itemIndex > -1) {
        cart.products.splice(itemIndex, 1);
        cart = await cart.save();
        successMsg(res, 'Item removed from cart', cart);
      } else {
        errorMsg(res, 'Item not found in cart', 404);
      }
    } catch (error) {
      errorMsg(res, 'Error removing item from cart', 500, error.message);
    }
  },

  deleteCart: async (req, res) => {
    const {userId} = req.params;

    try {
      const result = await Cart.deleteOne({userId});
      if (result.deletedCount === 0) {
        return errorMsg(res, 'Cart not found or already deleted', 404);
      }
      successMsg(res, 'Cart deleted successfully');
    } catch (error) {
      errorMsg(res, 'Error deleting cart', 500, error.message);
    }
  },
};

module.exports = cartController;
