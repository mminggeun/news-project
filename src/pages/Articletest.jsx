import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Articletest() {
  const [articlelist, setArticlelist] = useState([]);

  useEffect(() => {
    // 서버에서 기사 데이터를 가져오는 함수
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://52.203.194.120/api/news');
        // 받아온 데이터를 콘솔에 출력
        console.log('Fetched articles:', response.data);

        // 서버에서 받은 데이터를 articlelist 형태로 변환
        const articles = response.data.map(article => ({
          id: article.id,
          title: article.title,
          summarizedContent: article.summarizedContent,
          originalcontent:  article.originalcontent,
          date: article.date || 20240816, // 날짜 필드가 있을 경우 사용, 없으면 수정 필요
          views: article.views || 0, // views 필드가 없으면 기본값 0 설정
          imageUrl: article.imageUrl || "https://flexible.img.hani.co.kr/flexible/normal/970/515/imgdb/original/2024/0731/20240731501073.jpg"
        }));

        // articlelist 상태 업데이트
        setArticlelist(articles);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []); // 빈 배열([])로 의존성을 설정해 컴포넌트가 처음 렌더링될 때만 실행

  return (
    <div>
      <h1>Fetched Articles Data</h1>
      <pre>{JSON.stringify(articlelist, null, 2)}</pre> {/* JSON 형태로 데이터 표시 */}
    </div>
  );
}

export default Articletest;
