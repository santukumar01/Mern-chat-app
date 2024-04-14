import express from "express";

const chatRouter = express.Router();


import ChatController from "../controllers/chatController.js";
import protect from "../middleware/authmiddleware.js";

const chatController = new ChatController();

chatRouter.post('/', protect, chatController.accessChat)

chatRouter.get('/', protect, chatController.fetchChats)

chatRouter.post('/group', protect, chatController.createGroupChat)

chatRouter.put('/rename', protect, chatController.renameGroup);

chatRouter.put('/groupadd', protect, chatController.addToGroup);

chatRouter.put('/groupremove', protect, chatController.removeFromGroup);


export default chatRouter;