const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  numbers: [[Number]],
  associatedId: String,
});

module.exports = mongoose.model('Ticket', ticketSchema);