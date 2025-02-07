const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// create a user function
const createUser = async(req, res) => {
    const {password, ...others} = req.body;
    // hash password
    const hashPassword = bcrypt.hashSync(password, 10); // 10 is the salt difficulty
    // check user existence
    const isUser = await userModel.findOne({email: others.email});
    if (isUser) {
        return res.status(409).json({message: "User already exists!"});
    }
    try {
        const newUser = new userModel({...others, password: hashPassword});
        await newUser.save();
        res.status(201).json({message: "Registration successful!"});
    } catch (error) {
        res.status(500).json({message: "Something went wrong!"});
    }
}

// get all users
const getAllUsers = async(req, res) => {
    try {
        const users = await userModel.find();
        res.json(users);
    } catch (error) {
        res.json({message: "Something went wrong!"});
    }
}

// delete a user
const deleteUser = async(req, res) => {
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
        // Ensure the authenticated user is updating their own account
        if (id !== userId.toString()) {
            return res.status(403).json({ message: "Forbidden. You can only update your own account!" });
        }
        await userModel.findByIdAndDelete(id);
        res.json({message: "User deleted successfuly!"});
    } catch (error) {
        res.status(500).json({message: "Something went wrong!"});
    }
}

// get a user 
const getOneUser = async(req, res) => {
    const {id} = req.params;
    try {
        const theUser = await userModel.findById(id);
        if (!theUser) {
            return res.status(404).json({message: "User not found!"});
        }
        res.json(theUser);
    } catch (error) {
        res.status(500).json({message: "Something went wrong!"});
    }
}

// update a user
const updateUser = async(req, res) => {
    const {username, age, occupation, location} = req.body;
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

        // Check if user exists before updating
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Ensure the authenticated user is updating their own account
        if (id !== userId.toString()) {
            return res.status(403).json({ message: "Forbidden. You can only update your own account!" });
        }

        const updatedUser = await userModel.findByIdAndUpdate(id, {username, age, occupation, location}, { new: true, runValidators: true });
        res.json({message: "User details updated successfully!", user: updatedUser});
    } catch (error) {
        res.status(500).json({message: "Something went wrong!"});
    }
}

// login user
const loginUser = async(req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        res.status(404).json({message: "Invalid email or password!"});
    }
    // check if user exists
    const checkUser = await userModel.findOne({email});
    if (!checkUser) {
        return res.status(404).json({message: "User not found! Please register."});
    }
    // check user password
    const isPasswordValid = bcrypt.compareSync(password, checkUser.password);
    console.log(isPasswordValid);
    if (!isPasswordValid) {
        return res.status(401).json({message: "Incorrect password!"});
    }

    // Generate Token and return user
    const token = jwt.sign({ id: checkUser.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return res
    .cookie("token", token, { httpOnly:true })
    .status(200)
    .json(checkUser);
}


module.exports = {
    createUser,
    getAllUsers,
    deleteUser,
    getOneUser,
    updateUser, 
    loginUser
};