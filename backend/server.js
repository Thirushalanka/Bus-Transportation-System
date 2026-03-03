const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const User = require("./models/User");

app.post("/api/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const newUser = new User({
            name,
            email,
            password
        });

        await newUser.save();

        res.json({ message: "User Registered Successfully" });
    } catch (error) {
        res.status(500).json({ error: "Registration Failed" });
    }
});

app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email, password });

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        res.json({ message: "Login Successful", user });
    } catch (error) {
        res.status(500).json({ error: "Login Failed" });
    }
});


// Test Route
app.get("/", (req, res) => {
    res.send("BusGo API Running");
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});