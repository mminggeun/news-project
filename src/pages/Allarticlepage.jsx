import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ArticleContext from '../pages/ArticleContext';
import './Allarticlepage.css';

function Allarticlepage() {
    const { articlelist } = useContext(ArticleContext);
    const navigate = useNavigate();

    // 특정 날짜를 기준으로 설정
    const specificDate = new Date('2024-08-15'); // 원하는 날짜로 설정

    // 페이지네이션을 위한 상태
    const [currentPage, setCurrentPage] = useState(1);
    const articlesPerPage = 5;
    const [filteredArticles, setFilteredArticles] = useState([]);

    useEffect(() => {
        if (!articlelist || articlelist.length === 0) {
            setFilteredArticles([]);
            return;
        }

        // 날짜 문자열을 Date 객체로 변환하는 함수 (Home 컴포넌트와 동일하게 사용)
        const parseDate = (dateString) => {
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

        // 특정 날짜의 기사만 필터링
        const filtered = articlelist
            .filter(article => {
                const articleDate = parseDate(article.date);
                return (
                    articleDate.getFullYear() === specificDate.getFullYear() &&
                    articleDate.getMonth() === specificDate.getMonth() &&
                    articleDate.getDate() === specificDate.getDate()
                );
            })
            .sort((a, b) => b.views - a.views);

        setFilteredArticles(filtered);
    }, [articlelist]);

    const totalArticles = filteredArticles.length;
    const totalPages = Math.ceil(totalArticles / articlesPerPage);

    // 현재 페이지에 따라 보여줄 기사 선택
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);

    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const fullFormattedDate = specificDate.toLocaleDateString('ko-KR', options);
    const dayOfWeek = specificDate.toLocaleDateString('ko-KR', { weekday: 'long' }).charAt(0);
    const dateWithoutDot = fullFormattedDate.endsWith('.') ? fullFormattedDate.slice(0, -1) : fullFormattedDate;
    const finalFormattedDate = `${dateWithoutDot} ${dayOfWeek}`;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleDateChange = (direction) => {
        const newDate = new Date(specificDate);
        if (direction === 'prev') {
            newDate.setDate(newDate.getDate() - 1);
        } else if (direction === 'next') {
            newDate.setDate(newDate.getDate() + 1);
        }
        setCurrentPage(1);
        navigate(`/allarticlepage?date=${newDate.toISOString().slice(0, 10)}`); // 날짜 변경 시 페이지 이동
    };

    // 현재 페이지에 따라 보여줄 페이지 번호 계산
    const getVisiblePages = () => {
        const visiblePages = [];
        const startPage = Math.floor((currentPage - 1) / 3) * 3 + 1; // 현재 페이지에 따라 시작 페이지 계산
        for (let i = 0; i < 3; i++) {
            const page = startPage + i;
            if (page <= totalPages) {
                visiblePages.push(page);
            }
        }
        return visiblePages;
    };

    const visiblePages = getVisiblePages();

    return (
        <div className="all-artilclepage">
            <div className="artilclepage-date">
                <span className="arrow-text" onClick={() => handleDateChange('prev')}>◀</span>
                <p className="date-text-1">{finalFormattedDate}</p>
                <span className="arrow-text" onClick={() => handleDateChange('next')}>▶</span>
            </div>
            <div className="artilclepage-title">
                <h2 className="page-title">오늘자 전체 기사</h2>
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
                                        <Link to={`/article/${article.id}`}>
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
                <button className="arrow-button" 
                    onClick={() => handlePageChange(Math.max(currentPage - 3, 1))}
                >◀
                </button>
                {visiblePages.map(page => (
                    <button key={page} onClick={() => handlePageChange(page)}
                        className={currentPage === page ? 'active' : ''}
                    >{page}
                    </button>
                ))}
                <button className="arrow-button" onClick={() => handlePageChange(Math.min(currentPage + 3, totalPages))}
                >▶
                </button>
            </div>
        </div>
    );
}

export default Allarticlepage;
