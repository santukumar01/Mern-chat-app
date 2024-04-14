
import React, { useEffect, useState } from 'react'
import { Box } from '@chakra-ui/react';

import { ChatState } from '../contex/ChatProvider.jsx';

import SideDrawer from '../components/miscellanous/SideDrawer.jsx';
import MyChats from '../components/MyChats.jsx';
import ChatBox from '../components/ChatBox.jsx';



// const ChatPage = () => {

//     const [chat, setChat] = useState([]);


//     const fetchData = async () => {
//         try {
//             const response = await axios.get('/api/chat');
//             const data = await response.data;
//             setChat(data);
//         } catch (error) {
//             console.error('Error fetching chat data:', error);
//         }
//     }

//     useEffect(() => {
//         fetchData();
//     }, [])

//     return (
//         <div>
//             <div>
//                 {chat.map(chatItem => (
//                     <div key={chatItem.id}>{chatItem.name}</div>
//                 ))}
//             </div>

//         </div>
//     )
// }


const ChatPage = () => {
    const [fetchAgain, setFetchAgain] = useState(false);  // for after leaving group
    const { user } = ChatState();

    return (
        <div style={{ width: "100%" }} >
            {user && <SideDrawer />}
            <Box display="flex" justifyContent="space-between" w="100%" h="91vh" p="10px">
                {user && <MyChats fetchAgain={fetchAgain} />}
                {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </Box>

        </div>
    )
}

export default ChatPage
