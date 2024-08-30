import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import mypagefooterimage from '../assets/footerimage.png';
import mypageslogan from '../assets/newsslogan.png';
import '../styles/Mypage.css';

function Mypage() {
    const [currentDate] = useState(new Date());
    const [currentPage, setCurrentPage] = useState(1);
    const articlesPerPage = 3; // 한 페이지당 보여줄 기사 수를 3개로 설정

    // React Query를 사용하여 스크랩된 기사 가져오기
    const { data: scrapedArticles = [], isLoading, isError, error } = useQuery('scrapedArticles', async () => {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://52.203.194.120:8081/api/favorites', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                size: 100, // 임의의 큰 값으로 설정하여 모든 기사를 가져옴
            },
        });
        return response.data.map(articleData => ({
            id: articleData.newsId,
            imageUrl: articleData.imgUrl || 'https://example.com/default.jpg',
            publishedAt: articleData.publishedAt,
            summarizedContent: articleData.summarizedContent,
            title: articleData.title,
            viewCount: articleData.viewCount || 0,
        }));
    });

    // 현재 페이지에 따라 표시할 기사 계산
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = scrapedArticles.slice(indexOfFirstArticle, indexOfLastArticle);

    const totalPages = Math.ceil(scrapedArticles.length / articlesPerPage); // 총 페이지 수 계산

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const fullFormattedDate = currentDate.toLocaleDateString('ko-KR', options);
    const dayOfWeek = currentDate.toLocaleDateString('ko-KR', { weekday: 'long' }).charAt(0);
    const dateWithoutDot = fullFormattedDate.endsWith('.') ? fullFormattedDate.slice(0, -1) : fullFormattedDate;
    const finalFormattedDate = `${dateWithoutDot} ${dayOfWeek}`; // 템플릿 리터럴 사용

    const MaxContentLength = 300;

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>{error.message || '스크랩된 기사를 불러오는데 실패했습니다.'}</div>;
    }

    return (
        <div className="content-wrapper-1">
            <div className="date-container-1-1">
                <p className="date-text-1-1">{finalFormattedDate}</p>
            </div>
            <div className="date-container-2-1">
                <h2 className="page-title-1">스크랩한 기사 ({scrapedArticles.length}개)</h2>
                <img src={mypageslogan} className="mypageslogan" alt="mypageslogan" />
            </div>
            <div className="articles-container-1-1">
                <div className="all-articles-1-1">
                    {currentArticles.length > 0 ? (
                        currentArticles.map((article) => {
                            const truncatedContent = article.summarizedContent && article.summarizedContent.length > MaxContentLength
                                ? article.summarizedContent.slice(0, MaxContentLength) + '...'
                                : article.summarizedContent;

                            return (
                                <div key={article.id} className="all-article-1-1">
                                    <div className="all-article-content-1-1">
                                        <Link to={`/article/${article.id}`}> {/* 템플릿 리터럴 사용 */}
                                            <h3>{article.title}</h3> {/* 제목을 전체 표시 */}
                                            <p>{truncatedContent}</p>
                                        </Link>
                                    </div>
                                    <img src={article.imageUrl} className="all-article-image-1-1" alt="All article-1-1" />
                                </div>
                            );
                        })
                    ) : (
                        <p className="no-articles-message">스크랩한 기사가 없습니다.</p>
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
            <div className="mypagefooter">
                <img src={mypagefooterimage} className="mypagefooterimage" alt="Footer" />
                <p>
                    지구촌 소식 신문 등록·발행일자:2024년 8월 19일  
                    주소:경남 창원시 의창구 창원대학로 20 (퇴촌동)
                    © 지구촌 소식 신문사 All Rights Reserved. 무단 전재, 재배포, AI 학습 및 활용 금지
                </p>
            </div>
        </div>
    );
}

export default Mypage;
