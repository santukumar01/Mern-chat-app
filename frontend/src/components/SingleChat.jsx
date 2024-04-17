import React, { useEffect } from 'react'
import { useState } from 'react';
import axios from "axios"
import { ChatState } from '../contex/ChatProvider.jsx'

import { getSender, getSenderFull } from '../Config/ChatLogic.js';

import ProfileModal from './miscellanous/ProfileModal.jsx';
import UpdateGroupChatModel from './miscellanous/UpdateGroupChatModel.jsx';

import ScrollableChat from './ScrollableChat.jsx';

import { Box, Text } from "@chakra-ui/layout";
import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";

import Lottie from "react-lottie"

import animationdata from './animation/typing.json'

import io from "socket.io-client";
const ENDPOINT = "http://localhost:3000";   // backend server

var socket, selecteChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);
    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();
    const toast = useToast();

    // const defaultOptions = {
    //     loop: true,
    //     autoplay: true,
    //     animationData: animationdata,
    //     rendererSettings: {
    //         preserveAspectRatio: "xMidYMid slice",
    //     },
    // };

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            setLoading(true);

            const { data } = await axios.get(
                `/api/message/${selectedChat._id}`,
                config
            );
            // console.log(data);
            setMessages(data);
            setLoading(false);

            socket.emit("join chat", selectedChat._id);
        } catch (error) {
            console.log(error);
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                setNewMessage("");
                const { data } = await axios.post(
                    "/api/message",
                    {
                        content: newMessage,
                        chatId: selectedChat,
                    },
                    config
                );
                // console.log(data);
                socket.emit("new message", data);
                setMessages([...messages, data]);
            } catch (error) {
                console.log(error);
                toast({
                    title: "Error Occured!",
                    description: "Failed to send the Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }
    };
    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));

        socket.on("typing", () => {
            try {
                console.log("Received 'typing' event from server");
                setIsTyping(true);
            } catch (error) {
                console.error("Error handling 'typing' event:", error);
            }
        });
        socket.on("stop typing", () => {
            try {
                console.log("Received 'stop typing' event from server");
                setIsTyping(false);
            } catch (error) {
                console.error("Error handling 'stop typing' event:", error);
            }
        });


    }, [])

    useEffect(() => {
        fetchMessages();
        selecteChatCompare = selectedChat;
    }, [selectedChat])


    // console.log(notification, "++++++++++++");
    useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
            if (
                !selecteChatCompare || selecteChatCompare._id !== newMessageRecieved.chat._id
            ) {
                if (!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            } else {
                setMessages([...messages, newMessageRecieved]);
            }
        });
    });

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
            console.log("insdie ", istyping);
        }

        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if ((timeDiff >= timerLength) && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };

    return (
        <div>
            {selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={2}
                        w="100%"
                        // bg="white"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent={{ base: "space-between" }}
                        alignItems="center"
                    >
                        <IconButton
                            display={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat("")}
                        />
                        {messages && !selectedChat.isGroupChat ? (
                            <>
                                {getSender(user, selectedChat.users)}
                                <ProfileModal
                                    user={getSenderFull(user, selectedChat.users)}
                                />
                            </>
                        ) : (
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                <UpdateGroupChatModel
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                />

                            </>
                        )}
                    </Text>

                    <Box
                        display="flex"
                        flexDir="column"
                        justifyContent="flex-end"
                        p={3}
                        bg="#E8E8E8"
                        w="100%"
                        h="70vh"
                        borderRadius="lg"
                        overflowY="hidden"
                    >
                        {loading ? (
                            <Spinner
                                size="xl"
                                w={20}
                                h={20}
                                alignSelf="center"
                                margin="auto"
                            />
                        ) : (
                            <div className="messages" style={{ overflowY: 'auto' }} >
                                <ScrollableChat messages={messages} />
                            </div>
                        )}

                        <FormControl
                            onKeyDown={sendMessage}
                            id="first-name"
                            isRequired
                            mt={3}
                        >  {istyping ? (
                            <div>
                                Typing...
                            </div>
                        ) : (
                            <></>)}
                            <Input
                                variant="filled"
                                bg="#E0E0E0"
                                placeholder="Enter a message.."
                                value={newMessage}
                                onChange={typingHandler}
                            />
                        </FormControl>
                    </Box>
                </>
            ) : (
                <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                    <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                        Click on a user to start chatting
                    </Text>
                </Box>
            )
            }
        </div>
    )
}

export default SingleChat
