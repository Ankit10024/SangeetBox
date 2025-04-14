import { Message } from "../models/message.model.js";

/**
 * Send a chat message from authenticated user to receiver
 */
export const sendMessage = async (req, res, next) => {
  try {
    const senderId = req.auth.userId;
    const { receiverId, content } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({ error: "receiverId and content are required" });
    }

    const message = await Message.create({ senderId, receiverId, content });
    res.status(201).json({ message });
  } catch (error) {
    next(error);
  }
};

/**
 * Get chat messages between authenticated user and another user
 */
export const getMessages = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const otherUserId = req.params.userId;

    if (!otherUserId) {
      return res.status(400).json({ error: "userId parameter is required" });
    }

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json({ messages });
  } catch (error) {
    next(error);
  }
};
