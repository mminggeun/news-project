import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './SearchResults.css'; // 필요한 스타일 파일을 작성해주세요.

function SearchResults() {
    const location = useLocation();
    const { results } = location.state || { results: [] }; // 방어 코드 추가

    const [currentPage, setCurrentPage] = useState(1);
    const articlesPerPage = 5;

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
            </div>
            <div className="search-results-container">
                {currentArticles.length > 0 ? (
                    <div className="search-articles">
                        {currentArticles.map((article, index) => {
                            const maxContentLength = 300;
                            const truncatedContent = article.summarizedContent && article.summarizedContent.length > maxContentLength
                                ? article.summarizedContent.slice(0, maxContentLength) + '...'
                                : article.summarizedContent;

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
                    <p>검색 결과가 없습니다.</p>
                )}
            </div>
            {totalPages > 1 && (
                <div className="page-buttons">
                    <button
                        className="arrow-button"
                        onClick={() => handlePageChange(Math.max(currentPage - 3, 1))}
                    >
                        ◀
                    </button>
                    {visiblePages.map(page => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={currentPage === page ? 'active' : ''}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        className="arrow-button"
                        onClick={() => handlePageChange(Math.min(currentPage + 3, totalPages))}
                    >
                        ▶
                    </button>
                </div>
            )}
        </div>
    );
}

export default SearchResults;
