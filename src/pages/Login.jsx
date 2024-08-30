import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useMutation } from 'react-query';
import { AuthContext } from './AuthContext'; // AuthContext 가져오기
import '../styles/Login.css';
import Logo1 from '../assets/newslogo-1.png';

function Login() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext); // login 함수 가져오기
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // 로그인 mutation 정의
    const loginMutation = useMutation(
        async ({ username, password }) => {
            const response = await axios.post('http://52.203.194.120:8081/api/users/login', {
                username,
                password
            }, {
                withCredentials: true  // 자격 증명 포함
            });
            return response.data;
        },
        {
            onSuccess: (data) => {
                console.log("Response Data:", data);  // 응답 데이터를 콘솔에 출력
    
                let accessToken = data.accessToken;
                console.log("Received access token:", accessToken);
    
                if (accessToken) {
                    const { name } = data;  // 서버 응답에서 name 필드만 추출
                    console.log("User Data to be saved:", { name });
                    login({ name });  // name만 저장
                    localStorage.setItem('authToken', accessToken);
                    navigate('/'); // 홈 화면으로 이동
                } else {
                    console.error('Access token not found in the response');
                    alert('로그인 실패: 토큰을 받아올 수 없습니다.');
                }
            },
            onError: (error) => {
                console.error('Login failed:', error.response ? error.response.data : error.message);
                alert('로그인 실패: 아이디나 비밀번호를 확인하세요.');
            }
        }
    );

    const handleLogin = (e) => {
        e.preventDefault();
        loginMutation.mutate({ username, password }); // mutation 호출
    };

    const handleRegister = () => {
        navigate('/makeId');
    };

    return (
        <>
            <div className="register">
                <div className="logo-container">
                    <img src={Logo1} alt="Logo1" className="logo1" onClick={() => navigate('/')} />
                </div>
                <h1>회원로그인</h1>
                <p>지구촌 소식 아이디와 비밀번호를 입력하세요</p>
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
                    <button type="submit">로그인</button>
                </form>
            </div>
            <div className="not-member">
                <div className="not-member-border">
                    <p>아직 지구촌 소식 회원이 아니신가요?</p>
                    <button className="register-btn" onClick={handleRegister}>
                        회원가입
                    </button>
                </div>
            </div>
        </>
    );
}

export default Login;
