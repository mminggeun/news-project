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

    const today = new Date();
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'long' };
    const formattedDate = today.toLocaleDateString('ko-KR', options);

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

    const totalArticles = articles.length;
    const totalPages = Math.ceil(totalArticles / articlesPerPage);
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <div className="all-artilclepage">
            <div className="artilclepage-date">
                <p className="date-text-1">{formattedDate}</p> 
            </div>
            <div className="artilclepage-title">
                <h2 className="page-title">전체 기사</h2>
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
                    <p>기사가 없습니다.</p>
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
