import React, { useState, useEffect, useContext } from 'react'; // useEffect 추가
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './AuthContext'; // AuthContext 가져오기
import './Login.css';
import Logo1 from '../assets/newslogo-1.png';

function Login() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext); // login 함수 가져오기
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberUsername, setRememberUsername] = useState(false);

    useEffect(() => {
        const rememberedUsername = localStorage.getItem('rememberedUsername');
        if (rememberedUsername) {
            setUsername(rememberedUsername);
            setRememberUsername(true);
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://52.203.194.120/api/users/login', {
                username,
                password
            });

            const token = response.data.token;
            localStorage.setItem('authToken', token);

            // 로그인 성공 시 사용자 정보를 저장
            const userData = { username: response.data.username };
            login(userData);

            if (rememberUsername) {
                localStorage.setItem('rememberedUsername', username);
            } else {
                localStorage.removeItem('rememberedUsername');
            }

            navigate('/');
        } catch (error) {
            console.error('Login failed:', error.response ? error.response.data : error.message);
            alert('로그인 실패: 아이디나 비밀번호를 확인하세요.');
        }
    };

    const handleRegister = () => {
        navigate('/makeId');
    };

    const handleRememberUsername = () => {
        setRememberUsername(!rememberUsername);
    };

    const handleLogoClick = () => {
        navigate('/');
    };

    return (
        <>
            <div className="register">
                <div className="logo-container">
                    <img src={Logo1} alt="Logo1" className="logo1" onClick={handleLogoClick} />
                </div>
                <h1>회원로그인</h1>
                <p>SWENNEWS 아이디와 비밀번호를 입력하세요</p>
                <form onSubmit={handleLogin}>
                    <label>
                        <input 
                            type="text" 
                            placeholder="아이디" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                        />
                    </label>
                    <label>
                        <input 
                            type="password" 
                            placeholder="비밀번호" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </label>
                    <div className="remember-username">
                        <input 
                            type="checkbox" 
                            checked={rememberUsername} 
                            onChange={handleRememberUsername} 
                        />
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

export default Login;
