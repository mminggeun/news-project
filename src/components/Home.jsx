import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ArticleContext from '../pages/ArticleContext';
import footerimage from '../assets/footerimage.png';
import '../styles/Home.css';

function Home() {
    const { articlelist } = useContext(ArticleContext);

    // ArticleList를 콘솔에 출력하여 확인
    console.log('ArticleList:', articlelist);

    // 특정 날짜를 기준으로 설정
    const specificDate = new Date('2024-08-15'); // 특정 날짜
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredArticles, setFilteredArticles] = useState([]);

    useEffect(() => {
        if (!articlelist || articlelist.length === 0) {
            setFilteredArticles([]);
            return;
        }

        // 날짜 문자열을 Date 객체로 변환하는 함수
        const parseDate = (dateString) => {
            // 하이픈(-)을 제거하여 YYYYMMDD 형식으로 변환
            const normalizedDateString = dateString.replace(/-/g, '');

            if (normalizedDateString.length !== 8) {
                console.error('Invalid date string length:', dateString);
                return new Date(NaN); // 잘못된 형식의 문자열일 경우 Invalid Date 반환
            }

            const year = parseInt(normalizedDateString.slice(0, 4), 10);
            const month = parseInt(normalizedDateString.slice(4, 6), 10) - 1; // 월은 0부터 시작
            const day = parseInt(normalizedDateString.slice(6, 8), 10);
            const date = new Date(year, month, day);

            // 디버깅: 생성된 날짜 객체와 년, 월, 일을 확인
            console.log('Parsed Date:', dateString, '=>', date, 'Year:', year, 'Month:', month, 'Day:', day);

            return date;
        };

        const filtered = articlelist
            .filter(article => {
                const articleDate = parseDate(article.date);

                // 특정 날짜와 기사 날짜 비교
                const isSameDay = (
                    articleDate.getFullYear() === specificDate.getFullYear() &&
                    articleDate.getMonth() === specificDate.getMonth() &&
                    articleDate.getDate() === specificDate.getDate()
                );

                console.log('Filtered Article Date:', article.date, '=>', articleDate, 'Same Day:', isSameDay);
                return isSameDay;
            })
            .sort((a, b) => {
                return articlelist.indexOf(a) - articlelist.indexOf(b);
            })
            .slice(0, 15);

        setFilteredArticles(filtered);
    }, [articlelist]); // currentDate를 의존성 배열에서 제거

    console.log('Specific Date:', specificDate);
    console.log('Filtered Articles:', filteredArticles);

    if (!articlelist || articlelist.length === 0) {
        return <div>Loading...</div>;
    }

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

    const truncatedContentTop = topArticle.summarizedContent ? truncateText(topArticle.summarizedContent, MAX_CONTENT_LENGTH_TOP) : '';

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
                {topArticle.title && (
                    <div className="top-article">
                        <div className="top-article-content">
                            <Link to={`/article/${topArticle.id}`}>
                                <h3>{topArticle.title}</h3> {/* 제목 자르기 제거 */}
                                <p>{truncatedContentTop}</p>
                            </Link>
                        </div>
                        <img src={topArticle.imageUrl} className="top-article-image" alt="Top article" />
                    </div>
                )}
                {lastArticles.length > 0 && (
                    <div className="last-articles">
                        {lastArticles.map((article, index) => {
                            const truncatedContentLast = truncateText(article.summarizedContent, MAX_CONTENT_LENGTH_LAST);

                            return (
                                <div key={index} className="last-article">
                                    <div className="last-article-content">
                                        <Link to={`/article/${article.id}`}>
                                            <h3>{article.title}</h3> {/* 제목 자르기 제거 */}
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
                    SWENNEWS 신문 등록·발행일자:2024년 8월 19일  
                    주소:경남 창원시 의창구 창원대학로 20 (퇴촌동)
                    © SWENNEWS신문사 All Rights Reserved. 무단 전재, 재배포, AI 학습 및 활용 금지
                </p>
            </div>
        </div>
    );
}

export default Home;
