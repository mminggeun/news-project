import React from 'react'
import { useNavigate } from 'react-router-dom'
import './First.css'
import Logo from '../assets/newslogo.png'

function First() {
const navigate = useNavigate()


const handleLogin = () => {
    navigate('/register')
}

const handleJoin = () => {
    navigate('/makeid')
}

return (
    <div className="first-container">
        <img src={Logo} alt="Logo" className="logo" />
        <div className="button-container">
            <div className="login" onClick={handleLogin}>Login</div>
            <div className="join" onClick={handleJoin}>Join</div>
        </div>
    </div>
)
}

export default First