import React from 'react'
import { useNavigate } from 'react-router'
import { signOut } from 'firebase/auth'
// import { auth } from '../firebase'
import {auth} from '../firebase'

export const SignOut = () => {
    const navigate = useNavigate()

    const handleSignOut = async () => {
        await signOut(auth)
        navigate('/signin')
    }
    return <button onClick={handleSignOut}>Sign Out</button>
}