const express = require("express");
const {createPost, getAllPosts, getOnePost, deletePost, updatePost} = require("../controllers/post.controller");
const routes = express.Router();

routes.post("/post", createPost);
routes.get("/post", getAllPosts);
routes.get("/post/:id", getOnePost);
routes.delete("/post/:id", deletePost);
routes.put("/post/:id", updatePost);

module.exports = routes;