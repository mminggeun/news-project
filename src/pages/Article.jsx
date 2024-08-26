import React, { useState } from 'react';
import footerimage from '../assets/footerimage.png';
import './Article.css';

function Article() {
    const [isScrapped, setIsScrapped] = useState(false);
    const [scrapMessage, setScrapMessage] = useState('');

    // Dummy article data
    const article = {
        title: 'Sample Article Title Sample Article Tle Article Title Sample Articlitlele Article Title Sample Articlle Article Title Sample Articl',
        imageUrl: 'https://flexible.img.hani.co.kr/flexible/normal/970/515/imgdb/original/2024/0731/20240731501073.jpg',
        originalContent: 'or styling purposes.This is a sample  is a sample article content for styling purposes.This is a sample  is a sample article content for styling purposes.This is a sample  content for stylpurposes.This is a sample article content for styling purposes.This is a sample article content for styling purposes. is a sample article content for styling purposes.This is a sample article content for styling is a sample article content for styling purposes.This is a sample article content for styling is a sample article content for styling purposes.This is a sample article content for styling is a sample ar'
    };

    const handleScrapArticle = () => {
        setIsScrapped(true);
        setScrapMessage('기사가 성공적으로 저장되었습니다!');
    };

    const handleUnScrapArticle = () => {
        setIsScrapped(false);
        setScrapMessage('기사가 성공적으로 저장 취소되었습니다!');
    };

    return (
        <div className="indi-article-container">
            <header className="indi-article-header">
                <h1 className="indi-article-title">{article.title}</h1>
            </header>
            {isScrapped ? (
                <button onClick={handleUnScrapArticle} className="scrap-button">스크랩 취소</button>
            ) : (
                <button onClick={handleScrapArticle} className="scrap-button">스크랩하기</button>
            )}
            {scrapMessage && <p>{scrapMessage}</p>}
            <img
                src={article.imageUrl}
                alt={article.title}
                className="indi-article-image"
            />
            <div>
                <p className="indi-article-content">{article.originalContent}</p>
            </div>
            <p onClick={() => window.history.back()} className="back">Back</p>
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