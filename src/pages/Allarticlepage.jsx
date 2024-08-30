import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import allarticlefooterimage from '../assets/footerimage.png';
import allarticleslogan from '../assets/newsslogan.png';
import '../styles/Allarticlepage.css';

function Allarticlepage() {
    const [currentPage, setCurrentPage] = useState(1);
    const articlesPerPage = 5;
    const specificDate = new Date('2024-08-27'); // 원하는 날짜로 설정

    // react-query를 사용하여 기사를 가져오는 쿼리
    const { data: articles, isLoading, error } = useQuery('articles', async () => {
        const response = await axios.get('http://52.203.194.120:8081/api/news?page=0&size=15');
        return response.data;
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const parseDate = (dateString) => {
        if (!dateString) return new Date(NaN); // dateString이 존재하지 않을 경우 Invalid Date 반환

        const normalizedDateString = dateString.replace(/-/g, '');
        if (normalizedDateString.length !== 8) {
            console.error('Invalid date string length:', dateString);
            return new Date(NaN);
        }

        const year = parseInt(normalizedDateString.slice(0, 4), 10);
        const month = parseInt(normalizedDateString.slice(4, 6), 10) - 1;
        const day = parseInt(normalizedDateString.slice(6, 8), 10);
        return new Date(year, month, day);
    };

    // 필터링 및 정렬 작업을 수행
    const filteredArticles = articles
        .filter(article => {
            const articleDate = parseDate(article.publishedAt);
            return (
                articleDate.getFullYear() === specificDate.getFullYear() &&
                articleDate.getMonth() === specificDate.getMonth() &&
                articleDate.getDate() === specificDate.getDate()
            );
        })
        .sort((a, b) => b.viewCount - a.viewCount); // views 필드명을 viewCount로 수정하여 일치

    const totalArticles = filteredArticles.length;
    const totalPages = Math.ceil(totalArticles / articlesPerPage);

    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);

    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const fullFormattedDate = specificDate.toLocaleDateString('ko-KR', options);
    const dayOfWeek = specificDate.toLocaleDateString('ko-KR', { weekday: 'long' }).charAt(0);
    const dateWithoutDot = fullFormattedDate.endsWith('.') ? fullFormattedDate.slice(0, -1) : fullFormattedDate;
    const finalFormattedDate = `${dateWithoutDot} ${dayOfWeek}`; // 템플릿 리터럴로 수정

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) { // 페이지 번호 범위 체크
            setCurrentPage(pageNumber);
        }
    };

    return (
        <div className="all-artilclepage">
            <div className="artilclepage-date">
                <p className="date-text-1">{finalFormattedDate}</p>
            </div>
            <div className="artilclepage-title">
                <h2 className="page-title">오늘자 전체 기사</h2>
                <img src={allarticleslogan} className="allarticleslogan" alt="allarticleslogan" />
            </div>
            <div className="articlepage-container">
                {currentArticles.length > 0 ? (
                    <div className="all-articles-1">
                        {currentArticles.map((article, index) => {
                            const maxContentLength = 300;
                            const truncatedContent = article.summarizedContent.length > maxContentLength
                                ? article.summarizedContent.slice(0, maxContentLength) + '...'
                                : article.summarizedContent;

                            return (
                                <div key={index} className="all-article-1">
                                    <div className="all-article-content-1">
                                        <Link to={`/article/${article.id}`}> {/* 템플릿 리터럴로 수정 */}
                                            <h3>{article.title}</h3>
                                            <p>{truncatedContent}</p>
                                        </Link>
                                    </div>
                                    <img src={article.imageUrl} className="all-article-image-1" alt="All article-1" />
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p>해당 날짜에 기사가 없습니다.</p>
                )}
            </div>
            <div className="page-button">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={currentPage === index + 1 ? 'active' : ''}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
            <div className="allarticlesidebar1">
                <div className="allarticlesidebar-box">
                    <div className="allarticlesidebar-top"></div>
                    <div className="allarticlesidebar-content">
                        <Link to="/mypage" className="allarticlesidebar-link">
                            스크랩한 <br />기사 <br /> 보러가기
                        </Link>
                        <Link to="/Allarticlepage" className="allarticlesidebar-link">
                            전체기사 <br />보러가기
                        </Link>
                    </div>
                    <div className="allarticlesidebar-bottom"></div>
                </div>
            </div>
            <div className="allarticlefooter">
                <img src={allarticlefooterimage} className="allarticlefooterimage" alt="Footer" />
                <p>
                    지구촌 소식 신문 등록·발행일자:2024년 8월 19일  
                    주소:경남 창원시 의창구 창원대학로 20 (퇴촌동)
                    © 지구촌 소식 신문사 All Rights Reserved. 무단 전재, 재배포, AI 학습 및 활용 금지
                </p>
            </div>
        </div>
    );
}

export default Allarticlepage;
