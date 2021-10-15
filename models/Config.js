const mongoose = require("mongoose");

const ConfigSchema = new mongoose.Schema({
  blogName: String,
  titleFont: String,
  primaryColor: String,
  secondaryColor: String,
});

module.exports = mongoose.model("Config", ConfigSchema);
