const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const helmet  = require('helmet');
// const bodyparser = require('body-parser')
const authRouter = require('./Routers/authRouter');
const menuRouter = require('./Routers/menuRouter');
const connectDB = require('./config/db');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(helmet({ origin: true, credentials: true }));
app.use(express.urlencoded({ extended: true }))// Backend Can read url encoded Data

connectDB();
app.use('/api/auth', authRouter);
app.use('/api', menuRouter);

// example admin route
const protect = require('./Middlewares/authMiddleWare');
const authorize = require('./Middlewares/roleMiddleWare');


// app.get('/api/admin/stats', protect, authorize('admin'), (req, res) => {
//   res.json({ secret: 'only for admin' });
// });

const PORT = process.env.PORT || 4000;  

app.listen(PORT, ()=> {
    console.log(`Server running on port: ${PORT}`);
});