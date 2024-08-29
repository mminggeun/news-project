// Home.jsx

import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ArticleContext from '../pages/ArticleContext';
import footerimage from '../assets/footerimage.png';
import '../styles/Home.css';

function Home() {
    const { articles, loading } = useContext(ArticleContext);
    const navigate = useNavigate();

    const specificDate = new Date('2024-08-27');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredArticles, setFilteredArticles] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]); // 최근 검색어 저장
    const [showRecentSearches, setShowRecentSearches] = useState(false); // 검색창 클릭 상태 저장

    useEffect(() => {
        if (loading || !articles || !Array.isArray(articles)) {
            setFilteredArticles([]);
            return;
        }

        const parseDate = (dateString) => {
            if (!dateString) return new Date(NaN);
            const normalizedDateString = dateString.replace(/-/g, '');
            if (normalizedDateString.length !== 8) {
                return new Date(NaN);
            }
            const year = parseInt(normalizedDateString.slice(0, 4), 10);
            const month = parseInt(normalizedDateString.slice(4, 6), 10) - 1;
            const day = parseInt(normalizedDateString.slice(6, 8), 10);
            return new Date(year, month, day);
        };

        const filtered = articles.filter(article => {
            const articleDate = parseDate(article.publishedAt);
            return articleDate.getFullYear() === specificDate.getFullYear() &&
                articleDate.getMonth() === specificDate.getMonth() &&
                articleDate.getDate() === specificDate.getDate();
        }).slice(0, 15);

        setFilteredArticles(filtered);
    }, [articles, loading]);

    useEffect(() => {
        const fetchRecentSearches = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get('http://52.203.194.120:8081/api/search-history/recent', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setRecentSearches(response.data);
            } catch (error) {
                console.error('Error fetching recent searches:', error);
            }
        };

        fetchRecentSearches();
    }, []);

    const handleSearch = async () => {
        if (searchTerm.trim() !== '') {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get(`http://52.203.194.120:8081/api/search-history`, {
                    params: { query: searchTerm },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const structuredResults = response.data;
                navigate('/search', { state: { results: structuredResults } });
            } catch (error) {
                console.error('Error during search:', error);
            }
        }
    };

    const handleDeleteSearch = async (query) => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.delete(`http://52.203.194.120:8081/api/search-history`, {
                params: { query },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setRecentSearches(recentSearches.filter(search => search.query !== query));
        } catch (error) {
            console.error('Error deleting search history:', error);
        }
    };

    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const fullFormattedDate = specificDate.toLocaleDateString('ko-KR', options);
    const dayOfWeek = specificDate.toLocaleDateString('ko-KR', { weekday: 'long' }).charAt(0);
    const dateWithoutDot = fullFormattedDate.endsWith('.') ? fullFormattedDate.slice(0, -1) : fullFormattedDate;
    const finalFormattedDate = `${dateWithoutDot} ${dayOfWeek}`;

    const topArticle = filteredArticles[0] || {};
    const otherArticles = filteredArticles.slice(1, 11);
    const lastArticles = filteredArticles.slice(11, 15);

    const MAX_CONTENT_LENGTH_TOP = 300;
    const MAX_CONTENT_LENGTH_LAST = 500;

    const truncateText = (text, maxLength) =>
        text && text.length > maxLength ? text.slice(0, maxLength) + '...' : text;

    const truncatedContentTop = topArticle.summarizedContent
        ? truncateText(topArticle.summarizedContent, MAX_CONTENT_LENGTH_TOP)
        : topArticle.title;

    return (
        <div className="content-wrapper">
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onClick={() => setShowRecentSearches(true)} // 검색창 클릭 시 최근 검색어 표시
                    onFocus={() => setShowRecentSearches(true)} // 포커스 시 최근 검색어 표시
                    onBlur={() => setTimeout(() => setShowRecentSearches(false), 200)} // 포커스 아웃 시 최근 검색어 숨김
                />
                <button onClick={handleSearch}>검색</button>
                {showRecentSearches && recentSearches.length > 0 && (
                    <div className="recent-searches-dropdown">
                        {recentSearches.map((search, index) => (
                            <div key={index} className="search-item">
                                <span onClick={() => setSearchTerm(search.query)}>{search.query}</span>
                                <button onClick={() => handleDeleteSearch(search.query)}>Delete</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="date-container">
                <p className="date-text">{finalFormattedDate}</p>
            </div>
            <div className="articles-container">
                {topArticle.title && (
                    <div className="top-article">
                        <div className="top-article-content">
                            <Link to={`/article/${topArticle.id}`}>
                                <h3>{topArticle.title}</h3>
                                <p>{truncatedContentTop}</p>
                            </Link>
                        </div>
                        <img src={topArticle.imageUrl} className="top-article-image" alt="Top article" />
                    </div>
                )}
                {lastArticles.length > 0 && (
                    <div className="last-articles">
                        {lastArticles.map((article, index) => {
                            const truncatedContentLast = article.summarizedContent
                                ? truncateText(article.summarizedContent, MAX_CONTENT_LENGTH_LAST)
                                : article.title;

                            return (
                                <div key={index} className="last-article">
                                    <div className="last-article-content">
                                        <Link to={`/article/${article.id}`}>
                                            <h3>{article.title}</h3>
                                            <p>{truncatedContentLast}</p>
                                        </Link>
                                    </div>
                                    <img src={article.imageUrl} className="last-article-image" alt="Last article" />
                                </div>
                            );
                        })}
                    </div>
                )}
                <div className="other-articles">
                    <p>오늘의 인기 뉴스</p>
                    {otherArticles.map((article, index) => (
                        <div key={index} className="other-article">
                            <span className="article-index">{index + 1}</span>
                            <Link to={`/article/${article.id}`}>
                                <h4>{article.title}</h4>
                            </Link>
                            <img src={article.imageUrl} className="other-article-image" alt="Other article" />
                        </div>
                    ))}
                </div>
            </div>
            <div className="sidebar1">
                <div className="sidebar-box">
                    <div className="sidebar-top"></div>
                    <div className="sidebar-content">
                        <Link to="/mypage" className="sidebar-link">
                            스크랩한 <br />기사 <br /> 보러가기
                        </Link>
                        <Link to="/Allarticlepage" className="sidebar-link">
                            전체기사 <br />보러가기
                        </Link>
                    </div>
                    <div className="sidebar-bottom"></div>
                </div>
            </div>
            <div className="footer">
                <img src={footerimage} className="footerimage" alt="Footer" />
                <p>
                    지구촌 소식 신문 등록·발행일자:2024년 8월 19일  
                    주소:경남 창원시 의창구 창원대학로 20 (퇴촌동)
                    © 지구촌 소식 신문사 All Rights Reserved. 무단 전재, 재배포, AI 학습 및 활용 금지
                </p>
            </div>
        </div>
    );
}

export default Home;
