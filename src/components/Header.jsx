import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo2 from '../assets/homenewslogo.png';
import { AuthContext } from '../pages/AuthContext';
import '../styles/Header.css';

function Header() {
    const { user, logout } = useContext(AuthContext); 
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); 
        navigate('/login'); 
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
                        {user ? ( 
                            <>
                                <span className="namelink">{user.name} 님</span>
                                <span className="logoutlink" onClick={handleLogout}>Logout</span>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="authLink1">Login</Link>
                                <Link to="/makeid" className="authLink2">Register</Link>
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