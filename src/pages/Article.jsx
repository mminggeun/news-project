import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import footerimage from '../assets/footerimage.png';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import '../styles/Article.css';

function Article() {
    const { id } = useParams(); // URL에서 기사 ID를 가져옴
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [scrapMessage, setScrapMessage] = useState('');

    // React Query: 기사를 가져오는 쿼리
    const { data: article, isLoading, error } = useQuery(['article', id], async () => {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`http://52.203.194.120:8081/api/news/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    });

    // React Query: 스크랩 상태 확인 및 관리하는 쿼리
    const { data: isScrapped } = useQuery(['isScrapped', id], async () => {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://52.203.194.120:8081/api/favorites', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const favoritesData = Array.isArray(response.data) ? response.data : [];
        return favoritesData.some(fav => fav.newsId === parseInt(id));
    });

    // 스크랩 추가/삭제를 관리하는 Mutation
    const { mutate: scrapArticle } = useMutation(
        async () => {
            const token = localStorage.getItem('authToken');
            await axios.post(`http://52.203.194.120:8081/api/favorites/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        },
        {
            onSuccess: () => {
                setScrapMessage('기사가 성공적으로 저장되었습니다!');
                queryClient.invalidateQueries(['isScrapped', id]); // 스크랩 상태 쿼리 무효화
            },
            onError: () => {
                setScrapMessage('기사를 저장하는 데 실패했습니다.');
            }
        }
    );

    const { mutate: unscrapArticle } = useMutation(
        async () => {
            const token = localStorage.getItem('authToken');
            await axios.delete(`http://52.203.194.120:8081/api/favorites/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        },
        {
            onSuccess: () => {
                setScrapMessage('기사가 성공적으로 저장 취소되었습니다!');
                queryClient.invalidateQueries(['isScrapped', id]); // 스크랩 상태 쿼리 무효화
            },
            onError: () => {
                setScrapMessage('기사를 저장 취소하는 데 실패했습니다.');
            }
        }
    );

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
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
                <button onClick={() => unscrapArticle()} className="scrap-button">스크랩 취소</button>
            ) : (
                <button onClick={() => scrapArticle()} className="scrap-button">기사 스크랩하기</button>
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
