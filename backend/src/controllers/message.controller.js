import Message from "../model/message.model.js";
import User from "../model/user.model.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredusers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        res.status(200).json(filteredusers);
    } catch (error) {
        console.log("Error in getUsersForSidebar", error.message);
        res.status(500).json({ message: "Server error" });
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { sender: myId, recipient: userToChatId },
                { sender: userToChatId, recipient: myId }
            ]
        })

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages:", error.message);
        res.status(500).json({ message: "Internal Server error" });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            // upload image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

        await newMessage.save();

        //realtime functionality goes here...(socket.io)

        res.status(201).json(newMessage);

    } catch (error) {
        console.log("error in sendMessage controller", error);
        res.status(500).json({ message: "Internal Server error" });
    }
}