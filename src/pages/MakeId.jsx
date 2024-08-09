import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MakeId.css';
import Logo1 from '../assets/newslogo-1.png';

function MakeId() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordValidationError, setPasswordValidationError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 비밀번호 유효성 검사
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordValidationError(true);
      return;
    } else {
      setPasswordValidationError(false);
    }

    // 비밀번호와 비밀번호 확인이 일치하는지 확인
    if (password !== confirmPassword) {
      setPasswordError(true);
      return;
    } else {
      setPasswordError(false);
    }

    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError(true);
      return;
    } else {
      setEmailError(false);
    }

    try {
      // 회원가입 정보를 LoginUserRequest DTO에 맞게 구성
      const LoginUserRequest = {
        username,
        userid,
        password,
        email,
        phone,
      };

      // 회원가입 정보를 서버에 전송
      const response = await axios.post('http://223.62.149.151:8080/api/news', LoginUserRequest);
      const token = response.data.token;

      sessionStorage.setItem('authToken', token);

      // 회원가입 성공 시 로그인 페이지로 이동
      navigate('/login');
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response.data);
        // 여기서 사용자에게 에러 메시지를 보여줄 수 있습니다.
        // 예: alert(error.response.data.message);
      } else {
        console.error('Error registering user:', error);
      }
    }
  };

  return (
    <div className="make-id">
      <div className="logo-container">
        <img src={Logo1} alt="Logo1" className="logo1" onClick={handleLogoClick} />
      </div>
      <h1>회원 정보 입력</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <span>이름</span>
          <input type="text" placeholder="이름" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label>
          <span>아이디</span>
          <input type="text" placeholder="아이디" value={userid} onChange={(e) => setUserid(e.target.value)} />
        </label>
        <label>
          <span>비밀번호</span>
          <input
            type="password"
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={passwordValidationError ? 'password-mismatch' : ''}
          />
          {passwordValidationError && (
            <p className="password-error">비밀번호는 대/소문자, 숫자를 포함하여 8자 이상이어야 합니다.</p>
          )}
        </label>
        <label>
          <span>비밀번호 확인</span>
          <input
            type="password"
            placeholder="비밀번호 입력"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={passwordError ? 'password-mismatch' : ''}
          />
          {passwordError && (
            <p className="password-error">비밀번호와 비밀번호 확인이 일치하지 않습니다.</p>
          )}
        </label>
        <label>
          <span>이메일</span>
          <input
            type="text"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={emailError ? 'email-mismatch' : ''}
          />
          {emailError && <p className="email-error">잘못된 이메일 형식입니다.</p>}
        </label>
        <label>
          <span>전화번호</span>
          <input
            type="tel"
            placeholder="010-1234-5678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
}

export default MakeId;