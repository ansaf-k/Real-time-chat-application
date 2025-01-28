import jwt from "jsonwebtoken"
import User from "../model/user.model.js";

const protect = async (req, res, next) => {
    try {
        let token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }
        
        let decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if(!decoded) {
            return res.status(401).json({ message: "Access denied. Invalid token." });
        }

        const user = await User.findById(decoded.userId).select("-password");

        if(!user) {
            return res.status(404).json({ message: "User not found." });
        }

        req.user = user;
        next();

    } catch (error) {
        console.log("error in protectRoute",error.message);
        res.status(500).json({ message: "Server error." });
        next(error)
    }
};

export default protect;