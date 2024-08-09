import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import articlelist from './articlelist';
import BottomImage1 from '../assets/homebottom1.png';
import BottomImage2 from '../assets/homebottom2.png';
import footerimage from '../assets/footerimage.png';
import './Home.css';

function Home() {
    const [currentDate] = useState(new Date());
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    // 오늘자 뉴스 필터링 및 조회수로 정렬 후 상위 14개 선택
    const filteredArticles = articlelist.filter(article => {
        const articleDate = new Date(article.date);
        return articleDate.toDateString() === currentDate.toDateString();
    }).sort((a, b) => b.views - a.views) // 조회수 기준으로 정렬
      .slice(0, 14); // 상위 14개 기사 선택

    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const fullFormattedDate = currentDate.toLocaleDateString('ko-KR', options);
    const dayOfWeek = currentDate.toLocaleDateString('ko-KR', { weekday: 'long' }).charAt(0); 
    const dateWithoutDot = fullFormattedDate.endsWith('.') ? fullFormattedDate.slice(0, -1) : fullFormattedDate;
    const finalFormattedDate = `${dateWithoutDot} ${dayOfWeek}`;

    // 가장 조회수 높은 기사 선택
    const topArticle = filteredArticles[0];
    const otherArticles = filteredArticles.slice(1, 10); // 나머지 9개 기사
    const lastArticles = filteredArticles.slice(10, 14); // 나머지 4개 기사

    // 주어진 길이로 텍스트를 나누는 함수
    const splitText = (text, length) => {
        const regex = new RegExp(`.{1,${length}}`, 'g');
        return text.match(regex) || [];
    };

    const maxTitleLength = 50; // 최대 제목 길이 설정
    const maxContentLength = 300; // 최대 내용 길이 설정

    const truncatedTitle = topArticle.title.length > maxTitleLength 
        ? topArticle.title.slice(0, maxTitleLength) + '...' 
        : topArticle.title;

    const truncatedContent = topArticle.content.length > maxContentLength 
        ? topArticle.content.slice(0, maxContentLength) + '...' 
        : topArticle.content;

    return (
        <div className="content-wrapper">
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={() => setSearchTerm(searchTerm)}>검색</button>
            </div>
            <div className="date-container">
                <p className="date-text">{finalFormattedDate}</p>
            </div>
            <div className="articles-container">
                {topArticle && (
                    <div className="top-article">
                        <div className="top-article-content">
                        <Link to={`/article/${topArticle.id}`}>  
                            <h3>     
                                {splitText(truncatedTitle, 40).map((line, index) => (
                                    <span key={index}>{line}<br /></span>
                                ))}
                            </h3>
                            <p>
                                {splitText(truncatedContent, 50).map((line, index) => (
                                    <span key={index}>{line}<br /></span>
                                ))}
                            </p>
                            </Link>
                        </div>
                        <img src={topArticle.imageUrl} className="top-article-image" alt="Top article" />
                    </div>
                )}
                {lastArticles.length > 0 && (
                    <div className="last-articles">
                        {lastArticles.map((article, index) => {
                            const maxTitleLength = 60; // 최대 제목 길이 설정
                            const maxContentLength = 500; // 최대 내용 길이 설정

                            const truncatedTitle = article.title.length > maxTitleLength 
                                ? article.title.slice(0, maxTitleLength) + '...' 
                                : article.title;

                            const truncatedContent = article.content.length > maxContentLength 
                                ? article.content.slice(0, maxContentLength) + '...' 
                                : article.content;

                            return (
                                <div key={index} className="last-article">
                                    <div className="last-article-content">
                                    <Link to={`/article/${article.id}`}>   
                                        <h3>    
                                            {splitText(truncatedTitle, 70).map((line, lineIndex) => (
                                                <span key={lineIndex}>{line}<br /></span>
                                            ))}
                                        </h3>
                                        <p>
                                            {splitText(truncatedContent, 450).map((line, lineIndex) => (
                                                <span key={lineIndex}>{line}<br /></span>
                                            ))}
                                        </p>
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
                            <h4>{splitText(article.title.slice(0, 35), 14).map((line, lineIndex) => (
                                <span key={lineIndex}>{line}<br /></span>
                            ))}</h4></Link>
                            <img src={article.imageUrl} className="other-article-image" alt="Other article" />
                        </div>
                    ))}
                </div>
            </div>
            <div className="sidebar1">  
                <Link to="/mypage">
                    <img src={BottomImage1} className="BottomImage1" />
                </Link>
                <Link to="/Allarticlepage">
                    <img src={BottomImage2} className="BottomImage2" />
                </Link>
            </div>
            <div className="footer">
                <img src={footerimage} className="footerimage" />
                <p>SWENNEWS 신문 등록·발행일자:2011년 7월 19일  <span className="publisher">  발행인:전재환, 장민근 </span>   
                주소:경남 창원시 의창구 창원대학로 20 (퇴촌동)
                © SWENNEWS신문사 All Rights Reserved. 무단 전재, 재배포, AI 학습 및 활용 금지</p>
            </div>
        </div>
    );
}

export default Home;
