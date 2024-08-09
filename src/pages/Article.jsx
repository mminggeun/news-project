import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import articlelist from './articlelist'; 
import './Article.css'; 

function Article() {
    const { id } = useParams(); 
    const navigate = useNavigate(); 
    const articleIndex = articlelist.findIndex(article => article.id === parseInt(id)); 

    if (articleIndex === -1) {
        return <p>해당 기사를 찾을 수 없습니다.</p>; 
    }

    // scrap 상태를 정의
    const [scrap, setScrap] = useState(articlelist[articleIndex].scrap);

    const handleScrapToggle = () => {
        const newScrapValue = scrap === 0 ? 1 : 0;
        setScrap(newScrapValue);
        articlelist[articleIndex].scrap = newScrapValue; // 원본 데이터도 업데이트
    };

    return (
        <div className="article">
            <div className="article-container">
                <header className="article-header">
                    <h1 className="article-title">{articlelist[articleIndex].title}</h1>
                    <button onClick={handleScrapToggle} className="scrap-button">
                        {scrap === 0 ? '스크랩하기' : '스크랩 취소'}
                    </button>
                </header>
                <img src={articlelist[articleIndex].imageUrl} alt={articlelist[articleIndex].title} className="article-image" />
                <div>
                    <p className="article-content">{articlelist[articleIndex].content}</p>
                </div>
                <p onClick={() => navigate(-1)} className="back">back</p> 
            </div>
        </div>
    );
}

export default Article;
