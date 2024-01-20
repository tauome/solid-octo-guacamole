import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import IndexPage from './pages/indexPage'
import LoginPage from './pages/LoginPage'
import Layout from './Layout'
import RegisterPage from './pages/RegisterPage'
import axios from 'axios'
import { UserContextProvider } from './UserContext'
import AccountPage from './pages/AccountPage'

// change this when deploying
axios.defaults.baseURL = "http://localhost:4000"; 


function App() {

  return (
    <UserContextProvider>
        <Routes>
        <Route path='/' element={<Layout/>}>
            <Route index element={<IndexPage/>}></Route>
            <Route path='/login' element={<LoginPage/>}></Route>
            <Route path='/register' element={<RegisterPage/>}></Route>
            <Route path='/account/:subpage?' element={<AccountPage/>}></Route>
            <Route path='/account/:subpage/:action' element={<AccountPage/>}></Route>
        </Route>
      </Routes>
    </UserContextProvider>
  ); 
}

export default App
