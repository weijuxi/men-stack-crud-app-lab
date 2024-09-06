const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
    name: String,
    isReadyToEat: Boolean,
});