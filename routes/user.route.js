const express = require("express");
const {
    createUser,
    getAllUsers,
    updateUser,
    getOneUser,
    loginUser,
    deleteUser
} = require("../controllers/user.controller");


const routes = express.Router();

// CRUD requests
// Pubic routes
routes.post("/user", createUser);
routes.post("/login", loginUser);

// Protected routes
routes.get("/user", getAllUsers);
routes.put("/user", updateUser);
routes.get("/user/:id", getOneUser);
routes.delete("/user", deleteUser);


module.exports = routes;