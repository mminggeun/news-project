import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Article.css';

function Article() {
    const { id } = useParams();  // URL에서 newsId를 가져옴
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [error, setError] = useState(null);
    const [isScraped, setIsScraped] = useState(false);  // 스크랩 상태 저장
    const [scrapedArticleId, setScrapedArticleId] = useState(null);  // 스크랩된 기사 ID 저장

    const fetchArticleById = async (id) => {
        try {
            const token = localStorage.getItem('authToken');
            console.log('Token:', token);

            const response = await axios.get(`http://52.203.194.120/api/news/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("Fetched article data:", response.data);
            const articleData = Array.isArray(response.data) ? response.data[1] : response.data;
            setArticle(articleData);

            checkIfScraped(id, token); // 스크랩 상태 확인
        } catch (error) {
            console.error('Fetch error:', error);
            if (error.response) {
                setError(`Network response was not ok. Status: ${error.response.status}`);
            } else {
                setError('Error fetching article');
            }
        }
    };

    const checkIfScraped = async (newsId, token) => {
        try {
            const response = await axios.get('http://52.203.194.120/api/favorites', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log('Favorites data:', response.data); // 서버에서 받은 스크랩된 기사들 확인
            
            const scrapedArticle = response.data.find(article => article.id === parseInt(newsId, 10));
            if (scrapedArticle) {
                setIsScraped(true);
                setScrapedArticleId(scrapedArticle.id); // 스크랩된 기사 ID 저장
            }
        } catch (error) {
            console.error('Check if scraped error:', error);
        }
    };

    const handleScrap = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post(
                `http://52.203.194.120/api/favorites/${id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            console.log('스크랩이 서버에 정상적으로 요청되었습니다.');
            alert('기사 스크랩 성공!');
            setScrapedArticleId(response.data.id); // 서버에서 반환된 ID 저장 (서버가 ID를 반환한다고 가정)
            setIsScraped(true); // 스크랩 상태를 true로 설정
        } catch (error) {
            console.error('Scrap error:', error);
            alert('스크랩에 실패했습니다. 다시 시도해주세요.');
        }
    };
    
    const handleUnScrap = async () => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.delete(
                `http://52.203.194.120/api/favorites/${scrapedArticleId}`, // 저장된 스크랩 ID를 사용하여 삭제
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            alert('기사 스크랩 취소 성공!');
            setIsScraped(false); // 스크랩 상태를 false로 변경
            setScrapedArticleId(null); // 스크랩 ID 초기화
        } catch (error) {
            console.error('UnScrap error:', error);
            alert('스크랩 취소에 실패했습니다. 다시 시도해주세요.');
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
                    <p className="indi-article-content">Content is not available.</p>
                )}
            </div>
            {isScraped ? (
                <button onClick={handleUnScrap} className="scrap-button">스크랩 취소</button>
            ) : (
                <button onClick={handleScrap} className="scrap-button">스크랩</button>
            )}
            <p onClick={() => navigate(-1)} className="back">Back</p>
        </div>
    );
}

export default Article;
