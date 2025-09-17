const express = require('express');

const { userAuth, adminAuth } = require('./middlewares/auth');

const app = express();
const PORT = 7777;

app.get('/user/data', userAuth, (req, res, next) => {
    throw new Error('Simulated error in user data route');
    // res.send('Response from user data route');
    next();
});

app.get('/admin/data', adminAuth, (req, res, next) => {
    try {
        throw new Error('Simulated error in admin data route');
        //res.send('Response from admin data route');
        next();
    } catch (error) {
        res.status(500).send('Internal Server Error for admin route');
    }
});

app.use('/user', (err, req, res, next) => {
    if (err) {
        res.status(500).send('Internal Server Error');
    } else {
        next();
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});