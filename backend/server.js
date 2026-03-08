const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Models
const User = require("./models/User");
const Booking = require("./models/Booking");

// Middleware
app.use(cors());
app.use(express.json());


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));


// Test Route
app.get("/", (req, res) => {
  res.send("BusGo API Running");
});


// ---------------- USER REGISTER ----------------

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

    res.status(500).json({ message: "Registration failed" });

  }

});


// ---------------- USER LOGIN ----------------

app.post("/api/login", async (req, res) => {

  const { email, password } = req.body;

  const user = await User.findOne({ email, password });

  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  res.json({ message: "Login Successful", user });

});


// ---------------- BOOK SEATS ----------------

app.post("/api/book", async (req, res) => {

  try {

    const { userId, route, seats, total, date } = req.body;

    // Find bookings for same route & date
    const existingBookings = await Booking.find({ route, date });

    const bookedSeats = existingBookings.flatMap(b => b.seats);

    const conflict = seats.some(seat => bookedSeats.includes(seat));

    if (conflict) {
      return res.status(400).json({ message: "Some seats are already booked." });
    }

    const booking = new Booking({
      userId,
      route,
      seats,
      total,
      date
    });

    await booking.save();

    res.json({ message: "Booking successful" });

  } catch (error) {

    res.status(500).json({ message: "Booking failed" });

  }

});


// ---------------- GET USER BOOKINGS ----------------

app.get("/api/bookings/:userId", async (req, res) => {

  try {

    const bookings = await Booking.find({ userId: req.params.userId });

    res.json(bookings);

  } catch (error) {

    res.status(500).json({ message: "Failed to fetch bookings" });

  }

});




// ---------------- START SERVER ----------------

const PORT = 5000;

app.listen(PORT, () => {
  console.log("Server running on port 5000");
});