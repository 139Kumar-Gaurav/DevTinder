const express = require("express");
const dbConnect = require("./config/dbConnect");
const User = require("./models/User");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.post('/signup', async (req, res) => {
    try {
        await new User(req.body).save();
        res.status(200).json({ message: "User signed up successfully" });
    } catch (error) {
        res.status(500).json({ message: "User signup failed", error });
    }
});

app.get('/feed', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "User retrieval failed", error });
    }
});

app.delete('/user', async (req, res)=>{
    try{
        const userToBedeleted = await User.findById(req.body.id);
        if(!userToBedeleted){
            return res.status(404).json({message: "User not found"});
        }
        await User.findByIdAndDelete(req.body.id);
        res.status(200).json(`${userToBedeleted.firstName + ' ' + userToBedeleted.lastName} deleted successfully`);
    } catch (error) {
        res.status(500).json({ message: "User deletion failed", error });
    }
});

app.patch('/user', async (req, res)=>{
    try{
        const updatedUsers = await User.findByIdAndUpdate(req.body.id, req.body, { returnOriginal: false });
        res.status(200).json({ message: "User updated successfully", user: updatedUsers });
    } catch (error) {
        res.status(500).json({ message: "User update failed", error });
    }
})



dbConnect()
  .then(
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    })
  )
  .catch((err) => {
    console.log("Database connection failed", err);
  });
