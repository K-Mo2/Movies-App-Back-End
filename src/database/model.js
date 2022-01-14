const mongoose = require("mongoose");

const favoritesSchema = mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true,
  },
});

module.exports = { favoritesSchema };
