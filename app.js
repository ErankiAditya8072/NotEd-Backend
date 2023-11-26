const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://aditya:Eranki%4027@cluster0.f5atp0t.mongodb.net/NotEd?retryWrites=true&w=majority'

const authRoutes = require('./routes/auth')
const subjectRoutes = require('./routes/branch')
const questionRoutes = require('./routes/page')

app.use(bodyParser.json());

app.use( (req, res, next) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();

})

app.use('/auth',authRoutes)
app.use('/branch', subjectRoutes)
app.use('/page', questionRoutes )

app.use((error, req, res, next) => {

    const status = error.statusCode || 500;
    const message = error.message || 'Server Side Error';
    const data = error.data;
    res.status(200).json({
        message : message,
        data : data,
        statusCode : status
    })
})


mongoose.connect(MONGODB_URI)
.then( res => {
    app.listen(8080);
}).catch( err => {

    console.log(err);
  
})

