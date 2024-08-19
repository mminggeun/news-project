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

        const articles = Array.isArray(response.data)
          ? response.data.map(article => ({
              id: article.id,
              title: article.title,
              summarizedContent: article.summarizedContent,
              originalcontent: article.originalcontent || "No content",
              date: article.publishedAt,
              views: article.viewCount || 0,
              imageUrl: article.imageUrl || "https://example.com/default.jpg"
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