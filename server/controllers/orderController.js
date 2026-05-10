const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @route  POST /api/orders
// @access Protected
const placeOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name price stock');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Build order items and calculate total
    let totalPrice = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = item.product;

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}`
        });
      }

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        priceAtPurchase: product.price  // snapshot the price
      });

      totalPrice += product.price * item.quantity;

      // Deduct stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Create the order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalPrice,
      shippingAddress
    });

    // Clear the cart after order placed
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  GET /api/orders
// @access Protected
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name image price')
      .sort({ createdAt: -1 }); // newest first

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  GET /api/orders/all
// @access Admin only
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  PUT /api/orders/:id
// @access Admin only
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { placeOrder, getMyOrders, getAllOrders, updateOrderStatus };