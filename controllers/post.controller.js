const postModel = require("../models/post.model");
const jwt = require("jsonwebtoken");

const createPost = async(req, res) => {
    const { token } = req.cookies;
    const { id }= jwt.verify(token, process.env.JWT_SECRET);
    const body = req.body;
    try {
        const newPost = new postModel({ ...body, creatorId: id });
        await newPost.save();
        res.status(201).json({message: "post created successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).send("something went wrong");
    }
};


const getAllPosts = async(req, res) => {
    try {
        const allPosts = await postModel.find();
        res.status(200).json(allPosts);
    } catch (error) {
        res.status(500).send("something went wrong");
    }
};

const getOnePost = async(req, res) => {
    const {id} = req.params;
    try {
        const onePost = await postModel.findById(id);
        res.status(200).json(onePost);
    } catch (error) {
        res.status(500).send("something went wrong");
    }
};

const deletePost = async(req, res) => {
    try {
        // check if token exists
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).send({ message: "Unauthorized: No token provided" })
        }

        // verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
        }

        const userId = decoded.id; // Extract user ID from token
        const { id } = req.params; // Extract user ID from URL parameters

        // check if the post exists
        const post = await postModel.findById(id);
        if (!post) {
            return res.status(404).send("This post does not exist");
        }
        // check if user is the owner of the post, if not send an error
        if (post.creatorId.toString() !==  userId) {
            return res.status(404).send("You are not the owner of the post");
        }
        await postModel.findByIdAndDelete(id);
        res.status(200).send("Post deleted successfully");
    } catch (error) {
        res.status(500).send("something went wrong");
    }
};

const updatePost = async(req, res) => {
    const { id: postId, ...others} = req.body;
    try {
        // check if token exists
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).send({ message: "Unauthorized: No token provided" })
        }

        // verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
        }

        const userId = decoded.id; // Extract user ID from token
        const { id } = req.params; // Extract user ID from URL parameters

        // check if the post exists
        const post = await postModel.findById(id);
        if (!post) {
            return res.status(404).send("This post does not exist");
        }
        // check if user is the owner of the post, if not send an error
        if (post.creatorId.toString() !==  userId) {
            return res.status(404).send("You are not the owner of the post");
        }
        await postModel.findByIdAndUpdate(id, {...others}, {new: true});
        res.status(200).send("Post updated successfully");
    } catch (error) {
        console.log(error);
        res.status(500).send("something went wrong");
    }
};

module.exports = { createPost, getAllPosts, getOnePost, deletePost, updatePost};