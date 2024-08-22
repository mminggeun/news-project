import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MakeId.css';
import Logo1 from '../assets/newslogo-1.png';

function MakeId() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordValidationError, setPasswordValidationError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 아이디 유효성 검사
    const usernameRegex = /^[a-zA-Z0-9]{4,20}$/;
    if (!usernameRegex.test(username)) {
      alert("아이디는 알파벳 대소문자와 숫자로만 구성되며 4~20자이어야 합니다.");
      return;
    }

    // 비밀번호 유효성 검사
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#$%^&+=!])(?!.*\s).{8,16}$/;
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

    // 휴대폰 번호 형식 검사
    const phoneRegex = /^01(?:0|1|[6-9])[0-9]{7,8}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setPhoneError(true);
      return;
    } else {
      setPhoneError(false);
    }

    try {
      // 회원가입 정보를 백엔드의 UserRequest DTO에 맞게 구성
      const UserRequest = {
        name,
        username,
        password,
        email,
        phoneNumber
      };
      console.log(UserRequest);
      // 회원가입 정보를 서버에 전송
      await axios.post('http://52.203.194.120/api/users/register', UserRequest);

      // 회원가입 성공 시 로그인 페이지로 이동
      alert('회원가입이 성공적으로 완료되었습니다. 이제 로그인하세요.');
      navigate('/login');
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response.data);
        alert('회원가입 실패: ' + error.response.data.message);
      } else {
        console.error('Error registering user:', error);
        alert('회원가입 실패: 서버와의 연결이 원활하지 않습니다.');
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
          <input type="text" placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          <span>아이디</span>
          <input type="text" placeholder="아이디" value={username} onChange={(e) => setUsername(e.target.value)} />
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
            <p className="password-error">비밀번호는 영문, 숫자, 특수문자를 포함하여 8~16자여야 합니다.</p>
          )}
        </label>
        <label>
          <span>비밀번호 확인</span>
          <input
            type="password"
            placeholder="비밀번호 확인"
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
          {emailError && <p className="email-error">유효한 이메일 주소를 입력해주세요.</p>}
        </label>
        <label>
          <span>전화번호</span>
          <input
            type="tel"
            placeholder="01012345678"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className={phoneError ? 'phone-mismatch' : ''}
          />
          {phoneError && <p className="phone-error">올바른 휴대폰 번호 형식이 아닙니다.</p>}
        </label>
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
}

export default MakeId;
