import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Mypage.css';

function Mypage() {
    const [currentDate] = useState(new Date());
    const [currentPage, setCurrentPage] = useState(1);
    const [scrapedArticles, setScrapedArticles] = useState([]); // 서버에서 가져올 스크랩 기사들
    const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태
    const articlesPerPage = 5; // 한 페이지당 보여줄 기사 수

    const fetchScrapedArticles = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get('http://52.203.194.120/api/favorites', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    page: currentPage - 1,
                    size: articlesPerPage,
                },
            });

            const { data } = response;
            console.log('Fetched data:', data);

            // 데이터 파싱
            const articlesArray = data[1]; // 중첩된 배열에서 필요한 부분만 가져옴
            const transformedArticles = articlesArray.map((item) => {
                const articleData = item[1]; // 배열의 두 번째 요소가 실제 기사 데이터
                return {
                    id: articleData.newsId,
                    imageUrl: articleData.imageUrl || 'https://example.com/default.jpg',
                    publishedAt: articleData.publishedAt,
                    summarizedContent: articleData.summarizedContent,
                    title: articleData.title,
                    viewCount: 0,
                };
            });

            setScrapedArticles(transformedArticles);
            setTotalPages(Math.ceil(transformedArticles.length / articlesPerPage));
            setLoading(false);
        } catch (error) {
            console.error('Error fetching scraped articles:', error);
            setError('스크랩된 기사를 불러오는데 실패했습니다.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchScrapedArticles();
    }, [currentPage]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const fullFormattedDate = currentDate.toLocaleDateString('ko-KR', options);
    const dayOfWeek = currentDate.toLocaleDateString('ko-KR', { weekday: 'long' }).charAt(0);
    const dateWithoutDot = fullFormattedDate.endsWith('.') ? fullFormattedDate.slice(0, -1) : fullFormattedDate;
    const finalFormattedDate = `${dateWithoutDot} ${dayOfWeek}`;

    const MaxTitleLength = 60;
    const MaxContentLength = 300;

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

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
                    {scrapedArticles.length > 0 ? (
                        scrapedArticles.map((article) => {
                            const truncatedTitle = article.title.length > MaxTitleLength 
                                ? article.title.slice(0, MaxTitleLength) + '...' 
                                : article.title;

                            const truncatedContent = article.summarizedContent.length > MaxContentLength 
                                ? article.summarizedContent.slice(0, MaxContentLength) + '...' 
                                : article.summarizedContent;

                            return (
                                <div key={article.id} className="all-article-1-1">
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
