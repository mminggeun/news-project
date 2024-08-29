import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import footerimage from '../assets/footerimage.png';
import axios from 'axios';
import '../styles/Article.css';

function Article() {
    const { id } = useParams();  // URL에서 기사 ID를 가져옴
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [error, setError] = useState(null);
    const [scrapMessage, setScrapMessage] = useState('');
    const [isScrapped, setIsScrapped] = useState(false);

    const fetchArticleById = async (id) => {
        try {
            const token = localStorage.getItem('authToken');
            console.log('Token:', token);

            const response = await axios.get(`http://52.203.194.120:8081/api/news/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("Fetched article data:", response.data);
            // response.data를 그대로 사용
            setArticle(response.data);

            // 스크랩된 기사 목록 가져오기 및 상태 확인
            const favoritesResponse = await axios.get(`http://52.203.194.120:8081/api/favorites`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // favoritesResponse.data가 배열이 아닌 경우, 직접 할당하여 사용
            const favoritesData = Array.isArray(favoritesResponse.data) ? favoritesResponse.data : [];
            console.log('Scrapped articles:', favoritesData);

            // favoritesData에서 현재 기사가 스크랩되었는지 확인
            const isArticleScrapped = favoritesData.some(fav => fav.newsId === parseInt(id));
            setIsScrapped(isArticleScrapped);
        } catch (error) {
            console.error('Fetch error:', error);
            if (error.response) {
                setError(`Network response was not ok. Status: ${error.response.status}`);
            } else {
                setError('Error fetching article');
            }
        }
    };

    const handleScrapArticle = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post(`http://52.203.194.120:8081/api/favorites/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 204) {
                setScrapMessage('기사가 성공적으로 저장되었습니다!');
                setIsScrapped(true);
                fetchArticleById(id); // 스크랩된 기사 목록을 다시 가져와 콘솔에 출력
            }
        } catch (error) {
            console.error('Error saving article:', error);
            setScrapMessage('기사를 저장하는 데 실패했습니다.');
        }
    };

    const handleUnScrapArticle = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.delete(`http://52.203.194.120:8081/api/favorites/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 204) {
                setScrapMessage('기사가 성공적으로 저장 취소되었습니다!');
                setIsScrapped(false);
                fetchArticleById(id); // 스크랩된 기사 목록을 다시 가져와 콘솔에 출력
            }
        } catch (error) {
            console.error('Error unsaving article:', error);
            setScrapMessage('기사를 저장 취소하는 데 실패했습니다.');
        }
    };

    useEffect(() => {
        fetchArticleById(id);
    }, [id]);

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!article) {
        return <p>Loading...</p>;
    }

    return (
        <div className="indi-article-container">
            <header className="indi-article-header">
                <h1 className="indi-article-title">{article?.title}</h1>
            </header>
            <img src={article?.imageUrl || 'https://example.com/default.jpg'} alt={article?.title} className="indi-article-image" />
            <div>
                {article?.originalContent ? (
                    <p className="indi-article-content">{article.originalContent}</p>
                ) : (
                    <p className="indi-article-content">내용을 사용할 수 없습니다.</p>
                )}
            </div>
            {isScrapped ? (
                <button onClick={handleUnScrapArticle} className="scrap-button">스크랩 취소</button>
            ) : (
                <button onClick={handleScrapArticle} className="scrap-button">기사 스크랩하기</button>
            )}
            {scrapMessage && <p>{scrapMessage}</p>}
            <p onClick={() => navigate(-1)} className="back">Back</p>
            <div className="articlefooter">
                <img src={footerimage} className="articlefooterimage" alt="Footer" />
                <p>
                    지구촌 소식 신문 등록·발행일자:2024년 8월 19일  
                    주소:경남 창원시 의창구 창원대학로 20 (퇴촌동)
                    © 지구촌 소식 신문사 All Rights Reserved. 무단 전재, 재배포, AI 학습 및 활용 금지
                </p>
            </div>

        </div>
    );
}

export default Article;
