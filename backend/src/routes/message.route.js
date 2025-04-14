import { Router } from "express";
import { sendMessage, getMessages } from "../controller/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/messages", protectRoute, sendMessage);
router.get("/messages/:userId", protectRoute, getMessages);

export default router;
