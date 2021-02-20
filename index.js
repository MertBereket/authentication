const { Router } = require('express');
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

//Import Routes
const aouthRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

dotenv.config();
//Connect to DB

mongoose.connect(process.env.DB_CONNECT,
{ useUnifiedTopology: true },
() => console.log('Connected to db !'));

//Middleware
app.use(express.json());

//Route Middlewares
app.use('/api/user',aouthRoute);
app.use('/api/posts',postRoute);



app.listen(3000, () => console.log('Server Up and Running'));
