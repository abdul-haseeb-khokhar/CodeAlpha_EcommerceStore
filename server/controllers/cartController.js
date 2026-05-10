const Cart = require('../models/Cart')
const Product = require('../models/Product')


const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id })
            .populate('items.product', 'name price image stock')

        if (!cart) {
            return res.json({ items: [] })
        }

        res.json(cart)
    } catch (error) {
        res.status(500).json({
            message: 'Server error', error: error.message
        })
    }
}

const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body

        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            })
        }

        if (product.stock < quantity) {
            return res.status(400).json({
                message: 'Not enough stock'
            })
        }

        let cart = await Cart.findOne({ user: req.user._id })

        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] })
        }

        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        )

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity
        } else {
            cart.items.push({ product: productId, quantity })
        }

        await cart.save()
        res.json(cart)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

const updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body
        const { productId } = req.params

        const cart = await Cart.findOne({ user: req.user._id })

        if (!cart) {
            return res.status(404).json({
                message: 'Cart not found'
            })
        }

        const itemIndex = cart.items.findIndex(
            item => item.product.toString === productId
        )

        if (itemIndex === -1) {
            return res.status(404).json({
                message: 'Item not found in cart'
            })
        }
        if (quantity <= 0) {
            cart.items.splice(itemIndex, 1)
        } else {
            cart.items[itemIndex].quantity = quantity
        }

        await cart.save()
        res.json(cart);
    } catch (error) {
        res.status(500).json({
            message: 'Server error', error: error.message
        })
    }
}

const removeFromCart = async (req, res) => {
    try {
        const cart = await Car.findOne({ user: req.user._id })
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(
            item => item.product.toString() !== req.params.productId
        );

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

module.exports = {getCart, addToCart, updateCartItem, removeFromCart}
