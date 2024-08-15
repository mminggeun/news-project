import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import articlelist from './articlelist';
import './Allarticlepage.css';

function Allarticlepage() {
    const [currentDate] = useState(new Date());
    const [currentPage, setCurrentPage] = useState(1);
    const articlesPerPage = 5; // 한 페이지당 보여줄 기사 수
    const navigate = useNavigate();

    const filteredArticles = articlelist.filter(article => {
        const articleDate = new Date(article.date);
        return articleDate.toDateString() === currentDate.toDateString();
    }).sort((a, b) => b.views - a.views); // 조회수 기준으로 정렬

    const totalArticles = filteredArticles.length;
    const totalPages = Math.ceil(totalArticles / articlesPerPage);

    // 현재 페이지에 따라 보여줄 기사 선택
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);

    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const fullFormattedDate = currentDate.toLocaleDateString('ko-KR', options);
    const dayOfWeek = currentDate.toLocaleDateString('ko-KR', { weekday: 'long' }).charAt(0); 
    const dateWithoutDot = fullFormattedDate.endsWith('.') ? fullFormattedDate.slice(0, -1) : fullFormattedDate;
    const finalFormattedDate = `${dateWithoutDot} ${dayOfWeek}`;

    // 주어진 길이로 텍스트를 나누는 함수
    const splitText = (text, length) => {
        const regex = new RegExp(`.{1,${length}}`, 'g');
        return text.match(regex) || [];
    };

    // 페이지 버튼 클릭 핸들러
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="all-artilclepage">
            <div className="artilclepage-date">
                <p className="date-text-1">{finalFormattedDate}</p>
            </div>
            <div className="artilclepage-title">
                <h2 className="page-title">오늘자 전체 기사</h2> 
            </div>
            <div className="articlepage-container">
                {currentArticles.length > 0 && (
                    <div className="all-articles-1">
                        {currentArticles.map((article, index) => {
                            const maxTitleLength = 60; // 최대 제목 길이 설정
                            const maxContentLength = 300; // 최대 내용 길이 설정

                            const truncatedTitle = article.title.length > maxTitleLength 
                                ? article.title.slice(0, maxTitleLength) + '...' 
                                : article.title;

                            const truncatedContent = article.content.length > maxContentLength 
                                ? article.content.slice(0, maxContentLength) + '...' 
                                : article.content;

                            return (
                                <div key={index} className="all-article-1">
                                    <div className="all-article-content-1">
                                    <Link to={`/article/${article.id}`}>
                                        <h3>    
                                            {splitText(truncatedTitle, 60).map((line, lineIndex) => (
                                                <span key={lineIndex}>{line}<br /></span>
                                            ))}
                                        </h3>
                                        <p>
                                            {splitText(truncatedContent, 250).map((line, lineIndex) => (
                                                <span key={lineIndex}>{line}<br /></span>
                                            ))}
                                        </p>
                                        </Link>
                                    </div>
                                    <img src={article.imageUrl} className="all-article-image-1" alt="All article-1" />
                                </div>
                            );
                        })}
                    </div>
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
            </div>
    );
}

export default Allarticlepage;