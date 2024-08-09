import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import articlelist from './articlelist';
import './Mypage.css';

function Mypage() {
    const [currentDate] = useState(new Date());
    const [currentPage, setCurrentPage] = useState(1);

    // 스크랩한 기사만 필터링
    const scrapedArticles = articlelist.filter(article => article.scrap === 1);
    const articlesPerPage = 5; // 한 페이지당 보여줄 기사 수
    const totalArticles = scrapedArticles.length; // 스크랩한 기사 수
    const totalPages = Math.ceil(totalArticles / articlesPerPage); // 페이지 수

    const navigate = useNavigate();
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const fullFormattedDate = currentDate.toLocaleDateString('ko-KR', options);
    const dayOfWeek = currentDate.toLocaleDateString('ko-KR', { weekday: 'long' }).charAt(0); 
    const dateWithoutDot = fullFormattedDate.endsWith('.') ? fullFormattedDate.slice(0, -1) : fullFormattedDate;
    const finalFormattedDate = `${dateWithoutDot} ${dayOfWeek}`;

    const splitText = (text, length) => {
        const regex = new RegExp(`.{1,${length}}`, 'g');
        return text.match(regex) || [];
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const MaxTitleLength = 60; // 최대 제목 길이 설정
    const MaxContentLength = 300; // 최대 내용 길이 설정

    // 페이지네이션을 위한 시작 및 끝 인덱스 계산
    const startIndex = (currentPage - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    const currentArticles = scrapedArticles.slice(startIndex, endIndex); // 현재 페이지에 해당하는 기사들

    return (
        <div className="content-wrapper-1">
            <div className="date-container-1-1">
                <p className="date-text-1-1">{finalFormattedDate}</p>
            </div>
            <div className="date-container-2-1">
                <h2 className="page-title-1">스크랩한 기사</h2> 
            </div>
            <div className="articles-container-1-1">
                <div className="all-articles-1-1">
                    {currentArticles.length > 0 ? (
                        currentArticles.map((article, index) => {
                            const truncatedTitle = article.title.length > MaxTitleLength 
                                ? article.title.slice(0, MaxTitleLength) + '...' 
                                : article.title;

                            const truncatedContent = article.content.length > MaxContentLength 
                                ? article.content.slice(0, MaxContentLength) + '...' 
                                : article.content;

                            return (
                                <div key={index} className="all-article-1-1">
                                    <div className="all-article-content-1-1">
                                        <Link to={`/article/${article.id}`}>   
                                            <h3>{truncatedTitle}</h3>
                                            <p>{truncatedContent}</p>
                                        </Link>
                                    </div>
                                    <img src={article.imageUrl} className="all-article-image-1-1" alt="All article-1-1" />
                                </div>
                            );
                        })
                    ) : (
                        <p>스크랩한 기사가 없습니다.</p>
                    )}
                </div>
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
        </div>
    );
}

export default Mypage;
