import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import connectDB from './config/db.js';
import cookieparser from 'cookie-parser';
import cors from "cors";

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(cookieparser());
app.use(express.json());
app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
    })
);

app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    connectDB();
})