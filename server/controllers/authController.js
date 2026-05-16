const User = require('../models/User')
const jwt = require('jsonwebtoken')

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '7d'})
};

const registerUser = async (req, res) => {
    const {name, email, password} = req.body

    try{
        const userExist = await User.findOne({email})
        if(userExist) {
            return res.status(400).json({
                message: 'User already exists'
            })
        }

        const user = await User.create({name, email, password})

        res.status(201).json({
            token: generateToken(user._id), 
            user
        })
    } catch(err) {
        res.status(500).json({
            message: 'Server error', error: err.message
        })
    }
}
const loginUser = async(req, res) => {
    console.log('Login function is called')
    const {email, password} = req.body
    try{
        const user = await User.findOne({email})

        if(!user){
            return res.status(401).json({
                message: "User don't exist"
            })
        }
        const checkPass = await user.matchPassword(password)
        if(!checkPass){
            return res.status(401).json({
                message: 'Invalid password'
            })
        }
        
        res.json({
            user,
            token: generateToken(user._id)
        })
    } catch(err) {
        console.error('Error: ',err.message)
        res.status(500).json({
            message: 'Server error', error: err.message
        })
    }
}
const getMe = async(req, res) => {
    res.json(req.user)
}

module.exports = {registerUser, loginUser, getMe}
