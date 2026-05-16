const Product = require('../models/Product');

// @route  GET /api/products
// @access Public
const getProducts = async (req, res) => {
  console.log('getProduct is called')
  try {
    const { category, search } = req.query;

    // Build filter object dynamically
    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.name = { $regex: search, $options: 'i' }; // case-insensitive search
    }

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  GET /api/products/:id
// @access Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  POST /api/products
// @access Admin only
const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category, stock } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      image,
      category,
      stock,
      createdBy: req.user._id  // comes from protect middleware
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  PUT /api/products/:id
// @access Admin only
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { name, description, price, image, category, stock } = req.body;

    // Only update fields that were actually sent
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (image) product.image = image;
    if (category) product.category = category;
    if (stock !== undefined) product.stock = stock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  DELETE /api/products/:id
// @access Admin only
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.deleteOne();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };