import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
    console.log("jwt generated");
    res.cookie("jwt", token, {
        secure: false,
        sameSite: "strict", // only sent with requests from the same site
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 day
        httpOnly: true,// Prevents client-side JavaScript from accessing the cookie
    });

}

export default generateToken;