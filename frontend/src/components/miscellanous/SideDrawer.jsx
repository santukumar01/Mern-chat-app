
import { useState } from 'react';
import {
    Box, Tooltip, Button, Text, Menu, Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Input,
    useToast,
    Spinner
} from '@chakra-ui/react'

import axios from 'axios';

import { getSender } from '../../Config/ChatLogic.js';

import { Toast } from '@chakra-ui/react';

import { useDisclosure } from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon, Search2Icon } from "@chakra-ui/icons"
import { Avatar } from '@chakra-ui/react';
import { MenuItem, MenuList, MenuDivider } from '@chakra-ui/react';
import { MenuButton } from '@chakra-ui/react';
import { ChatState } from '../../contex/ChatProvider.jsx';
import ChatLoading from '../ChatLoading.jsx';
import UserListItem from '../UserAvatar/UserListItem.jsx';
import { Effect } from "react-notification-badge";
import NotificationBadge from "react-notification-badge";

import ProfileModal from './ProfileModal.jsx';



import { useNavigate } from 'react-router-dom';

const SideDrawer = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);

    const toast = useToast()
    const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const logOutHandler = () => {
        localStorage.removeItem("userInfo");
        navigate('/');
    }

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "Please Enter something in search",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            });
            return;
        }

        try {

            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            // console.log("Search:", search);
            // console.log("Config:", config);

            const { data } = await axios.get(`/api/user?search=${search}`, config);

            setLoading(false);

            setSearchResult(data);

        } catch (error) {
            // console.log(error);
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };


    const accessChat = async (userId) => {
        // console.log(userId);

        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(`/api/chat`, { userId }, config);

            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
            setSelectedChat(data);
            setLoadingChat(false);
            onClose();
        } catch (error) {
            toast({
                title: "Error fetching the chat",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };
    return (
        <div>
            <Box display="flex"
                justifyContent="space-between"
                alignItems="center"
                bg="white"
                w="100%"
                p="5px 10px 5px 10px"
                borderWidth="5px" >
                <Tooltip label="Search for Users" hasArrow placement="bottom-end">
                    <Button variant="ghost" onClick={onOpen}>
                        <Search2Icon />
                        <Text display={{ base: "none", md: "flex" }} px="4">Search User</Text>
                    </Button>
                </Tooltip>
                <Text fontSize="2xl" fontFamily="Work sans">
                    Let's - Connect
                </Text>
                <div>

                    <Menu>
                        <MenuButton p={1} >
                            <NotificationBadge
                                count={notification.length}
                                effect={Effect.SCALE}
                            />
                            <BellIcon fontSize="2xl" m={1} />
                        </MenuButton>
                        <MenuList p={2}>
                            {!notification.length && "No New Msg"}
                            {notification.map((notif) => (
                                <MenuItem
                                    key={notif._id}
                                    onClick={() => {
                                        setSelectedChat(notif.chat);
                                        setNotification(notification.filter((n) => n !== notif));
                                    }}
                                >
                                    {notif.chat.isGroupChat
                                        ? `New Message in ${notif.chat.chatName}`
                                        : `New Message from ${getSender(user, notif.chat.users)}`}
                                </MenuItem>
                            ))}
                        </MenuList>

                    </Menu>
                    <Menu>
                        <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
                            <Avatar
                                size="sm"
                                cursor="pointer"
                                name={user.name}
                                src={user.pic}
                            />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>My Profile</MenuItem>{" "}
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={logOutHandler}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>

            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
                    <DrawerBody>
                        <Box display="flex" pb={2}>
                            <Input
                                placeholder="Search by name or email"
                                mr={2}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button
                                onClick={handleSearch}
                            >Go</Button>
                        </Box>
                        {loading ? (
                            <ChatLoading />
                        ) : (
                            searchResult?.map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => accessChat(user._id)}
                                />
                            ))
                        )}
                        {loadingChat && <Spinner ml="auto" display="flex" />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </div>

    )
}

export default SideDrawer
