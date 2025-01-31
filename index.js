require("dotenv").config();

const express = require("express");
const userRoutes = require("./routes/user.route");
const postRoutes = require("./routes/post.route");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());
app.use(express.json());


mongoose.connect("mongodb://localhost:27017/simple-api")
.then(() => {
    console.log("Connected to database");
})
.catch(() => {
    console.log("something went wrong");
});

// requests
app.use(userRoutes);
app.use(postRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});