import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Article.css';

function Article() {
    const { id } = useParams(); // URL에서 기사 ID를 가져옵니다.
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [error, setError] = useState(null);
    const [scrap, setScrap] = useState(false);

    const fetchAllArticles = async () => {
        const articles = [];
        let page = 1;
        const limit = 10; // 한 페이지당 기사의 수 (예시)

        while (true) {
            try {
                const response = await fetch(`http://52.203.194.120/api/news?page=${page}&limit=${limit}`);
                if (!response.ok) {
                    throw new Error(`Network response was not ok. Status: ${response.status}`);
                }

                const data = await response.json();
                console.log(`Fetched page ${page} data:`, data);

                if (data.length === 0) break; // 더 이상 기사가 없으면 종료

                articles.push(...data);
                page += 1;
            } catch (error) {
                console.error('Fetch error:', error);
                setError(error.message);
                break;
            }
        }
        return articles;
    };

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const articles = await fetchAllArticles();
                console.log('Fetched articles:', articles);

                const foundArticle = articles.find(article => article.id.toString() === id);
                if (foundArticle) {
                    setArticle(foundArticle);
                    setScrap(foundArticle.scrap || false);
                } else {
                    setError('No article found');
                }
            } catch (error) {
                console.error('Fetch error:', error);
                setError(error.message);
            }
        };

        fetchArticle();
    }, [id]); // `id`가 변경될 때마다 이 효과를 다시 실행합니다.

    const handleScrapToggle = () => {
        setScrap(prevScrap => !prevScrap);
        // 스크랩 상태를 서버에 업데이트하는 로직을 추가할 수 있습니다.
    };

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!article) {
        return <p>Loading...</p>;
    }

    return (
        <div className="indi-article-container">
            <header className="indi-article-header">
                <h1 className="indi-article-title">{article.title}</h1>
                <button onClick={handleScrapToggle} className="scrap-button">
                    {scrap ? '스크랩 취소' : '스크랩하기'}
                </button>
            </header>
            <img src={article.imageUrl} alt={article.title} className="indi-article-image" />
            <div>
                {article.originalContent ? (
                    <p className="indi-article-content">{article.originalContent}</p>
                ) : (
                    <p className="indi-article-content">Content is not available.</p>
                )}
            </div>
            <p onClick={() => navigate(-1)} className="back">back</p>
        </div>
    );
}

export default Article;
