import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo2 from '../assets/homenewslogo.png';
import { AuthContext } from '../pages/AuthContext'; // AuthContext 가져오기
import '../styles/Header.css';

function Header() {
    const { user, logout } = useContext(AuthContext); // 로그인 상태와 로그아웃 함수 가져오기
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // 로그아웃 처리
        navigate('/login'); // 로그아웃 후 로그인 페이지로 이동
    };

    return (
        <>
            <div className="headerContainer">
                <div className="blackScreen leftBlackScreen"></div>
                <div className="header1">
                    <div className="leftSide">
                        <Link to="/">
                            <img src={Logo2} alt="News Logo" className="logo2" />
                        </Link>
                        {user ? ( // 로그인 상태에 따른 동적 렌더링
                            <>
                                <span className="namelink">{user.name} 님</span>
                                <span className="logoutlink" onClick={handleLogout}>Logout</span>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="authLink">Login</Link>
                                <Link to="/makeid" className="authLink">Register</Link>
                            </>
                        )}
                    </div>
                </div>
                <div className="blackScreen rightBlackScreen"></div>
            </div>
        </>
    );
}

export default Header;
