import React, { useEffect, useRef } from "react";
import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
    isSameSender,
    isLastMessage,
    isSameSenderMargin,
    isSameUser
} from "../Config/ChatLogic";
import { ChatState } from "../contex/ChatProvider.jsx";

const ScrollableChat = ({ messages }) => {
    const { user } = ChatState();
    const containerRef = useRef(null);

    useEffect(() => {
        // Scroll to the bottom when messages change
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div
            ref={containerRef}
            style={{
                maxHeight: "100%", // adjust height as needed
                overflowY: "auto"
            }}
        >
            {messages &&
                messages.map((m, i) => (
                    <div style={{ display: "flex" }} key={m._id}>
                        {isSameSender(messages, m, i, user._id) ||
                            isLastMessage(messages, i, user._id) ? (
                            <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                                <Avatar
                                    mt="7px"
                                    mr={1}
                                    size="sm"
                                    cursor="pointer"
                                    name={m.sender.name}
                                    src={m.sender.pic}
                                />
                            </Tooltip>
                        ) : null}
                        <span
                            style={{
                                backgroundColor: `${m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"}`,
                                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                                borderRadius: "20px",
                                padding: "5px 15px",
                                maxWidth: "75%"
                            }}
                        >
                            {m.content}
                        </span>
                    </div>
                ))}
        </div>
    );
};

export default ScrollableChat;
