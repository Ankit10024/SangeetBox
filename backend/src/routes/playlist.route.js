import express from "express";
const router = express.Router();
import * as playlistController from "../controller/playlist.controller.js";
import * as authMiddleware from "../middleware/auth.middleware.js";

router.use(authMiddleware.protectRoute);

router.get("/", playlistController.getPlaylists);
router.post("/", playlistController.createPlaylist);
router.delete("/:id", playlistController.deletePlaylist);

export default router;
