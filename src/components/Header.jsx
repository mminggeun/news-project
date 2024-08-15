import React from 'react';
import { Link } from 'react-router-dom';
import Logo2 from '../assets/homenewslogo.png';
import '../styles/Header.css';

function Header() {
    return (
        <>
            <div className="headerContainer">
                <div className="blackScreen leftBlackScreen"></div>
                <div className="header1">
                    <div className="leftSide">
                        <Link to="/">
                            <img src={Logo2} alt="News Logo" className="logo2" />
                        </Link>
                        <Link to="/login" className="authLink">Login</Link>
                        <Link to="/makeid" className="authLink">Register</Link>
                    </div>
                </div>
                <div className="blackScreen rightBlackScreen"></div>
            </div>
        </>
    );
}

export default Header;