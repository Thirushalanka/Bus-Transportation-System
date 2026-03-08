const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: String,
  route: String,
  seats: [String],
  total: Number,
  date: String
});

module.exports = mongoose.model("Booking", bookingSchema);