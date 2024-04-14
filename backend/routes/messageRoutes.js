import express from "express"

const msgRoutes = express.Router();

import MessageModel from "../controllers/messageController.js";
import protect from "../middleware/authmiddleware.js";
const messageModel = new MessageModel();

msgRoutes.post('/', protect, messageModel.sendMessage)
msgRoutes.get('/:chatId', messageModel.allMessages)

export default msgRoutes;