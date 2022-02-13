import './home.css'

import { getCurrentUserData } from "../fetch-handlers/admin-user"
import { useEffect, useState, useContext } from 'react'
import { LoginContext } from '../context/loginContext'
import MessagePost from '../components/message-post'

const Home = () => {

    const {userData} = useContext(LoginContext)


    // return (
    //     <div>
    //         <MessagePost />
    //     </div>
    // )

    return (
        <div className='home-container'>
            <h1>Welcome <span style={{color: 'orange'}}>{userData.name} </span>!</h1>
            <p>More features will appear here soon .... </p>
        </div>
    )
}

export default Home
