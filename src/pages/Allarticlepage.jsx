import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import ArticleContext from '../pages/ArticleContext';
import './Allarticlepage.css';

function Allarticlepage() {
    const { articlelist } = useContext(ArticleContext);
    const specificDate = new Date('2024-08-15'); // Set the specific date
    const [currentPage, setCurrentPage] = useState(1);
    const articlesPerPage = 5; // Number of articles per page

    // Convert date string to Date object
    const parseDate = (dateString) => {
        const year = dateString.slice(0, 4);
        const month = dateString.slice(4, 6) - 1; // Months are zero-indexed
        const day = dateString.slice(6, 8);
        return new Date(year, month, day);
    };

    // Filter articles for the specific date and sort by views
    const filteredArticles = articlelist
        .filter(article => {
            const articleDate = parseDate(article.date);
            return articleDate.toDateString() === specificDate.toDateString();
        })
        .sort((a, b) => b.views - a.views); // Sort by views

    const totalArticles = filteredArticles.length;
    const totalPages = Math.ceil(totalArticles / articlesPerPage);

    // Get articles for the current page
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);

    // Format the date
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const fullFormattedDate = specificDate.toLocaleDateString('ko-KR', options);
    const dayOfWeek = specificDate.toLocaleDateString('ko-KR', { weekday: 'long' }).charAt(0);
    const dateWithoutDot = fullFormattedDate.endsWith('.') ? fullFormattedDate.slice(0, -1) : fullFormattedDate;
    const finalFormattedDate = `${dateWithoutDot} ${dayOfWeek}`;

    // Split text into lines
    const splitText = (text, length) => {
        const regex = new RegExp(`.{1,${length}}`, 'g');
        return text.match(regex) || [];
    };

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="all-articlepage">
            <div className="articlepage-date">
                <p className="date-text-1">{finalFormattedDate}</p>
            </div>
            <div className="articlepage-title">
                <h2 className="page-title">기사 목록 - {finalFormattedDate}</h2> 
            </div>
            <div className="articlepage-container">
                {currentArticles.length > 0 ? (
                    <div className="all-articles-1">
                        {currentArticles.map((article, index) => {
                            const maxTitleLength = 60; // Maximum title length
                            const maxContentLength = 300; // Maximum content length

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
                                    <img src={article.imageUrl} className="all-article-image-1" alt="All article" />
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p>No articles found for the selected date.</p>
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
