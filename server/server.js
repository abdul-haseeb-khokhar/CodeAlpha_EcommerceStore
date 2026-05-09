const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')

const dns = require('node:dns').promises;
dns.setServers(["1.1.1.1","1.0.0.1"]);

dotenv.config();
const app = express();

app.use(cors())
app.use(express.json())

app.use('/api/auth', require('./routes/authRoutes'))
// app.use('/api/products', require('./routes/productRoutes'))
// app.use('/api/cart', require('./routes/cartRoutes'))
// app.use('/api/orders', require('./routes/orderRoutes'))

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected')
        app.listen(process.env.PORT, ()=>{
            console.log('Server running on port: ', process.env.PORT)
        })
    })
    .catch((err) => console.log('Db connection error: ', err))