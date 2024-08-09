import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import Logo1 from '../assets/newslogo-1.png';

function Register() {
const navigate = useNavigate();
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const [rememberUsername, setRememberUsername] = useState(false);


const handleLogin = (e) => {
    e.preventDefault();
    // 로그인 로직 구현
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('Remember Username:', rememberUsername);
    // 로그인 성공 시 메인 페이지로 이동
    navigate('/');
};

const handleRegister = () => {
    // 회원가입 페이지로 이동
    navigate('/makeId');
};

const handleRememberUsername = () => {
    setRememberUsername(!rememberUsername);
};

const handleLogoClick = () => {
    // First.jsx 파일로 이동
    navigate('/');
};


return (
    <>
    <div className="register">
        <div className="logo-container">
            <img src={Logo1} alt="Logo1" className="logo1" onClick={handleLogoClick}/>
        </div>
        <h1>회원로그인</h1>
        <p>SWENNEWS 아이디와 비밀번호를 입력하세요</p>
        <form onSubmit={handleLogin}>
            <label>
                <input type="text"
                    placeholder="아이디"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}/>
            </label>
            <label>
                <input type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}/>
            </label>
            <div className="remember-username">
                <input type="checkbox"
                    checked={rememberUsername}
                    onChange={handleRememberUsername}/>
                <label htmlFor="remember-username">아이디 저장</label>
            </div>
            <button type="submit">로그인</button>
        </form>
        </div>
        <div className="not-member">
            <div className="not-member-border">
                <p>아직 SWENNEWS 회원이 아니신가요?</p>
                <button className="register-btn" onClick={handleRegister}>
                    회원가입
                </button>
            </div>
        </div>
        </>
);
}

export default Register;