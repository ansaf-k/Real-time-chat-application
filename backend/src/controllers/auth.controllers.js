import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import cloudinary from "../config/cloudinary.js";

export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // validate input fields
        if (!name && !email && !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // check password length
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) return res.status(400).json({ message: "Email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log(name, email, hashedPassword);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });


        if (newUser) {
            // generate jwt token here
            generateToken(res, newUser._id);
            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        generateToken(res, user._id)

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.log("Error in login controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("error in logout controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile is Required" });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true });
        res.status(200).json({ message: "Profile updated successfully", updatedUser });
    } catch (error) {
        console.log("error in updated profile:", error);
        res.status(500).json({ message: "Internal Server error" });
    }
};

export const checkAuth = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("error in checkAuth:", error);
        res.status(500).json({ message: "Internal Server error" });
    }
}