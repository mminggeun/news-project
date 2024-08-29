import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import mypagefooterimage from '../assets/footerimage.png';
import mypageslogan from '../assets/newsslogan.png';
import '../styles/Mypage.css';

function Mypage() {
    const [currentDate] = useState(new Date());
    const [currentPage, setCurrentPage] = useState(1);
    const [scrapedArticles, setScrapedArticles] = useState([]); // 서버에서 가져올 스크랩 기사들
    const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태
    const articlesPerPage = 3; // 한 페이지당 보여줄 기사 수를 3개로 설정

    const fetchScrapedArticles = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get('http://52.203.194.120:8081/api/favorites', {
                headers: {
                    Authorization: `Bearer ${token}`, // 템플릿 리터럴을 사용하여 토큰 설정
                },
                params: {
                    page: currentPage - 1,
                    size: articlesPerPage,
                },
            });

            const { data } = response;
            console.log('Fetched data:', data);

            // 데이터 파싱 - 중첩 배열 대신 data가 이미 객체 배열임을 가정
            const transformedArticles = data.map((articleData) => ({
                id: articleData.newsId,
                imageUrl: articleData.imgUrl || 'https://example.com/default.jpg',
                publishedAt: articleData.publishedAt,
                summarizedContent: articleData.summarizedContent,
                title: articleData.title,
                viewCount: articleData.viewCount || 0,
            }));

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
    const finalFormattedDate = `${dateWithoutDot} ${dayOfWeek}`; // 템플릿 리터럴 사용

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
                <img src={mypageslogan} className="mypageslogan" alt="mypageslogan" />
            </div>
            <div className="articles-container-1-1">
                <div className="all-articles-1-1">
                    {scrapedArticles.length > 0 ? (
                        scrapedArticles.map((article) => {
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
