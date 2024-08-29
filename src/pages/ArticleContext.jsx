// ArticleContext.jsx

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Context 생성
const ArticleContext = createContext();

// Context Provider 정의
export function ArticleProvider({ children }) {
  const [articles, setArticles] = useState(null); // 전체 응답 데이터를 저장할 상태
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://52.203.194.120:8081/api/news?page=0&size=15');
        console.log('Fetched articles:', response.data);

        setArticles(response.data); // 전체 응답 데이터를 상태에 저장
        console.log('Articles set to state:', response.data); // 디버그 로그 추가
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <ArticleContext.Provider value={{ articles, loading }}>
      {children}
    </ArticleContext.Provider>
  );
}

export default ArticleContext;
