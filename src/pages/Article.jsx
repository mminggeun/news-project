import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Article.css';

function Article() {
    const { id } = useParams();  // URL에서 newsId를 가져옴
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [error, setError] = useState(null);

    const fetchArticleById = async (id) => {
        try {
            // 올바른 URL로 GET 요청을 보냄
            const response = await axios.get(`http://52.203.194.120/api/news/188`);
            console.log("Fetched article data:", response.data);
            setArticle(response.data);  // 받은 데이터를 상태로 저장
        } catch (error) {
            console.error('Fetch error:', error);
            if (error.response) {
                setError(`Network response was not ok. Status: ${error.response.status}`);
            } else {
                setError('Error fetching article');
            }
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
            <p onClick={() => navigate(-1)} className="back">Back</p>
        </div>
    );
}

export default Article;
