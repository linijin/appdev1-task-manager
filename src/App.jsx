import { useState, useEffect } from 'react'
import TaskList  from './components/TaskList'
import { BrowserRouter, Routes, Route } from "react-router"
import { SignIn } from './components/SignIn'
import { SignUp } from './components/SignUp'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import './App.css'


function App() {
  const [user,setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })

    return unsubscribe
  }, [])

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <TaskList  user={user} /> : <SignIn /> } />
        <Route path="/signin" element={<SignIn/>} />
        <Route path="signup" element={<SignUp/>} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
