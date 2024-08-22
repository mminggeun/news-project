import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Context 생성
const ArticleContext = createContext();

// Context Provider 정의
export function ArticleProvider({ children }) {
  const [articlelist, setArticlelist] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://52.203.194.120/api/news?page=0&size=15');
        console.log('Fetched articles:', response.data);

        // 데이터를 추출하는 로직 수정
        const articles = Array.isArray(response.data[1])
          ? response.data[1].map(item => ({
              id: item[1].id, // Long -> number
              title: item[1].title, // String -> string
              summarizedContent: item[1].summarizedContent, // String -> string
              publishedAt: item[1].publishedAt, // 서버에서 받은 LocalDate 그대로 사용
              imageUrl: item[1].imageUrl || "https://example.com/default.jpg", // 기본 이미지 설정
              viewCount: item[1].viewCount || 0, // Long -> number
            }))
          : [];
        setArticlelist(articles);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);

  return (
    <ArticleContext.Provider value={{ articlelist }}>
      {children}
    </ArticleContext.Provider>
  );
}

// Context 객체를 default export로 내보내기
export default ArticleContext;
