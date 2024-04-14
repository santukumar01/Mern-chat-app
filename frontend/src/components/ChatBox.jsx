import { Box } from "@chakra-ui/react";

// import "./styles.css";

import SingleChat from "./SingleChat";
import { ChatState } from "../contex/ChatProvider";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
    const { selectedChat } = ChatState();

    return (
        <Box
            display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
            // alignItems="center"
            flexDirection="column"
            p={3}
            bg="white"
            w={{ base: "100%", md: "68%" }}
            borderRadius="lg"
            borderWidth="1px"
            justifyContent="space-between"

        >
            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
            {/* Single Chat */}
        </Box>
    );
};

export default Chatbox;