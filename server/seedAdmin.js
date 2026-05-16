const mongoose = require('mongoose')
const User = require('./models/User')

require('dotenv').config()

const makeAdmin = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('DB connected')

        const user = await User.findOneAndUpdate(
            {email: `${process.env.ADMIN_EMAIL}`},
            {role: 'admin'},
            {new: true}
        )

        if(!user) {
            console.log('User not found')
        } else {
            console.log(`${user.email} is now admin`)
        }

        process.exit()
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

makeAdmin()