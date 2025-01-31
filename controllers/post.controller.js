const postModel = require("../models/post.model");
const jwt = require("jsonwebtoken");

const createPost = async(req, res) => {
    const { token } = req.cookies;
    const { id }= jwt.verify(token, process.env.JWT_SECRET);
    const body = req.body;
    try {
        const newPost = new postModel({ ...body, creatorId: id });
        await newPost.save();
        res.json({message: "post created successfully"});
    } catch (error) {
        console.log(error);
        res.send("something went wrong");
    }
};


const getAllPosts = async(req, res) => {
    try {
        const allPosts = await postModel.find();
        res.json(allPosts);
    } catch (error) {
        res.send("something went wrong");
    }
};

const getOnePost = async(req, res) => {
    const {id} = req.params;
    try {
        const onePost = await postModel.findById(id);
        res.json(onePost);
    } catch (error) {
        res.send("something went wrong");
    }
};

const deletePost = async(req, res) => {
    const {token} = req.cookies;
    const { id:creatorId } = jwt.verify(token, "danieligwe");;
    const { id } = req.params;
    try {
        // get the post
        const post = await postModel.findById(id);
        // check if post exists, if not send error to user
        if (!post) {
            return res.send("Post does not exist");
        }
        // check if the creatorId of the post matches the creatorId passed in the body
        if (post.creatorId.toString() !== creatorId) {
            return res.send("This post does not belong to you");
        }
        await postModel.findByIdAndDelete(id);
        res.send("Post deleted successfully");
    } catch (error) {
        res.send("something went wrong");
    }
};

const updatePost = async(req, res) => {
    const {token} = req.cookies;
    const {id} = req.params;
    const { id: creatorId } = jwt.verify(token, "danieligwe");
    const { id: postId, ...others} = req.body;
    try {
        // check if the post exists
        const post = await postModel.findById(id);
        if (!post) {
            return res.send("This post does not exist");
        }
        // check if user is the owner of the post, if not send an error
        if (post.creatorId.toString() !==  creatorId) {
            return res.send("You are not the owner of the post");
        }
        await postModel.findByIdAndUpdate(id, {...others}, {new: true});
        res.send("Post updated successfully");
    } catch (error) {
        console.log(error);
        res.send("something went wrong");
    }
};

module.exports = { createPost, getAllPosts, getOnePost, deletePost, updatePost};