const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
    country: {type: String, required: true},
    state: {type: String, requied: true},
    city: {type: String, requied: true},
});

const user = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    age: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    occupation: {
        type: String,
        required: true,
    },
    location: locationSchema,
},
{timestamps: true}
);

const userModel = mongoose.model("User", user);
module.exports = userModel;

