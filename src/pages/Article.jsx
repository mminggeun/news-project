import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Article.css';

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

            const response = await axios.get(`http://52.203.194.120/api/news/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("Fetched article data:", response.data);
            const articleData = Array.isArray(response.data) ? response.data[1] : response.data;
            setArticle(articleData);

            // 스크랩된 기사 목록 가져오기 및 상태 확인
            const favoritesResponse = await axios.get(`http://52.203.194.120/api/favorites`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const favoritesData = Array.isArray(favoritesResponse.data) ? favoritesResponse.data[1] : [];

            // JSON 데이터를 파싱하여 기사의 목록을 추출
            const articles = favoritesData.map(item => item[1]);  // 각 기사 정보만 추출
            console.log('Scrapped articles:', articles);

            // 스크랩된 기사 목록을 콘솔에 출력
            const isArticleScrapped = articles.some(fav => fav.newsId === parseInt(id));
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
            const response = await axios.post(`http://52.203.194.120/api/favorites/${id}`, {}, {
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
            const response = await axios.delete(`http://52.203.194.120/api/favorites/${id}`, {
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
                <button onClick={handleScrapArticle} className="scrap-button">이 기사 스크랩하기</button>
            )}
            {scrapMessage && <p>{scrapMessage}</p>}
            <p onClick={() => navigate(-1)} className="back">Back</p>
        </div>
    );
}

export default Article;
