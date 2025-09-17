const express = require('express');

const app = express();

app.use('/user',[(req, res, next)=>{
    console.log("response 1");
    //res.send("response 1");
    next();
},
(req, res, next)=>{
    console.log("response 2");
    res.send("response 2");
    next();
}]);

app.listen(7777, ()=>{
    console.log('Server is running on port 7777');
})