import React, {useState} from 'react'
import { Link } from 'react-router'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { useNavigate } from "react-router";
import { googleProvider,auth } from '../firebase';

export const SignIn = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

    const navigate = useNavigate()

    const handleSignIn = async () => {
        // Input Validation
        if (!email.trim() || !password.trim()) {
        setError("Email and Password fields cannot be empty.");
        return;
        }
        setError(null);

        try {
            await signInWithEmailAndPassword (auth, email, password)
            navigate('/')
        } catch (error) {
            setError('Error: ${error}')
        }     
    }

    const handleSignInWithGmail = async () => {
        try {
            await signInWithPopup(auth, googleProvider )
            navigate('/')
        } catch (error) {
            setError('Error: ${error}')
        }     
    }

    return (
        <div className='signin'>
            <h1>Sign In Page</h1>
            <input type="email" placeholder= "  Email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" id='password' placeholder="  Password" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleSignIn}>Sign In</button>
            {'or'}
            <button onClick={handleSignInWithGmail}>Sign in with Gmail</button>
            {error && <p className="error-message">{error}</p>}
            <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
        </div>
    )
}