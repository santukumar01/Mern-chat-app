
import { Button, ButtonGroup } from '@chakra-ui/react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import ChatPage from './Pages/ChatPage'

import './App.css'

function App() {
  return (
    <>
      {/* <Button colorScheme='blue'>Button</Button> */}
      <Routes>
        <Route exact path='/' Component={HomePage} />
        <Route exact path='/chats' Component={ChatPage} />
      </Routes>
    </>

  )
}

export default App
