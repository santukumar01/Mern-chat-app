
import dotenv from "dotenv"
dotenv.config();

import express from "express"

import { Server } from "socket.io";

import connectDB from "./cofig/db.js";
connectDB();

import path from "path"

import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import msgRoutes from "./routes/messageRoutes.js";
const app = express();   //express() is a function inside Express module

app.use(express.json()); // to accept json data from fonrtend

const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

app.use('/api/user', userRouter)
app.use('/api/chat', chatRouter)
app.use('/api/message', msgRoutes)


// --------------------------deployment------------------------------

app.use(express.static(path.join(__dirname, 'frontend/dist')))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
})

// --------------------------deployment------------------------------

const server = app.listen(PORT, () => {
    console.log(`the app is running on ${PORT}`);
})


const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:5173"  // forontend server
    }

})

io.on('connection', (socket) => {
    console.log("socket io is connected");
    socket.on("setup", (userDate) => {
        socket.join(userDate._id);
        // console.log(userDate._id);
        socket.emit("connected");
    })

    socket.on("join chat", (room) => {
        socket.join("user join room ", room);
        console.log("user Joined", room);
    })


    socket.on("typing", (room) => {
        if (room) {
            socket.in(room).emit("typing");
            // console.log(`User in room ${room} is typing...`);
        } else {
            // console.error("No room provided for 'typing' event");
        }
    });

    socket.on("stop typing", (room) => {
        if (room) {
            socket.in(room).emit("stop typing");
            // console.log(`User in room ${room} stopped typing`);
        } else {
            // console.error("No room provided for 'stop typing' event");
        }
    });

    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });

})