import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import searchfooterimage from '../assets/footerimage.png';
import searchslogan from '../assets/newsslogan.png';
import '../styles/SearchResults.css'; // 필요한 스타일 파일을 작성해주세요.

function SearchResults() {
    const location = useLocation();
    const { results } = location.state || { results: [] }; // 방어 코드 추가

    const [currentPage, setCurrentPage] = useState(1);
    const articlesPerPage = 3;

    useEffect(() => {
        setCurrentPage(1); // 새로운 검색이 들어오면 첫 페이지로 초기화
    }, [results]);

    const totalArticles = results.length;
    const totalPages = Math.ceil(totalArticles / articlesPerPage);

    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = results.slice(indexOfFirstArticle, indexOfLastArticle);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const getVisiblePages = () => {
        const visiblePages = [];
        const startPage = Math.floor((currentPage - 1) / 3) * 3 + 1;
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
        <div className="search-results-page">
            <div className="search-results-title">
                <h2 className="search-title">검색 결과</h2>
                <img src={searchslogan} className="searchslogan" alt="searchslogan" />
            </div>
            <div className="search-results-container">
                {currentArticles.length > 0 ? (
                    <div className="search-articles">
                        {currentArticles.map((article, index) => {
                            if (!article) return null;
                            const maxContentLength = 300;
                            const content = article.summarizedContent || article.title || '';
                            const truncatedContent = content.length > maxContentLength
                                ? content.slice(0, maxContentLength) + '...'
                                : content;

                            return (
                                <div key={index} className="search-article">
                                    <div className="search-article-content">
                                        <Link to={`/article/${article.id}`}>
                                            <h3>{article.title}</h3>
                                            <p>{truncatedContent}</p>
                                        </Link>
                                    </div>
                                    {article.imageUrl && (
                                        <img src={article.imageUrl} className="search-article-image" alt="Search result" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="no-results">
                        <p>검색 결과가 없습니다.</p>
                        <p>다른 검색어를 시도해 보세요.</p>
                    </div>
                )}
            </div>
            {totalPages > 1 && (
                <div className="page-buttons">
                    {visiblePages.map(page => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={currentPage === page ? 'active' : ''}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            )}
            <div className="mypagesidebar1">
                <div className="mypagesidebar-box">
                    <div className="mypagesidebar-top"></div>
                    <div className="mypagesidebar-content">
                        <Link to="/mypage" className="mypagesidebar-link">
                            스크랩한 <br />기사 <br /> 보러가기
                        </Link>
                        <Link to="/Allarticlepage" className="mypagesidebar-link">
                            전체기사 <br />보러가기
                        </Link>
                    </div>
                    <div className="mypagesidebar-bottom"></div>
                </div>
            </div>
            <div className="searchfooter">
                <img src={searchfooterimage} className="searchfooterimage" alt="search" />
                <p>
                    지구촌 소식 신문 등록·발행일자:2024년 8월 19일  
                    주소:경남 창원시 의창구 창원대학로 20 (퇴촌동)
                    © 지구촌 소식 신문사 All Rights Reserved. 무단 전재, 재배포, AI 학습 및 활용 금지
                </p>
            </div>
        </div>
    );
}

export default SearchResults;
