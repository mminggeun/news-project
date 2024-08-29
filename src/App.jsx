import './App.css';
import Header from './components/Header';
import Home from './components/Home';
import Login from './pages/Login';
import MakeId from './pages/MakeId';
import Article from './pages/Article';
import Allarticlepage from './pages/Allarticlepage';
import ArticleContext from './pages/ArticleContext';
import SearchResults from './pages/SearchResults';
import Mypage from './pages/Mypage';
import { ArticleProvider } from './pages/ArticleContext'; // ArticleProvider import
import { AuthProvider } from './pages/AuthContext'; // AuthProvider import
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className='App'>
      <Router>
        <AuthProvider> {/* AuthProvider로 애플리케이션 감싸기 */}
          <ArticleProvider>
            <Header /> {/* Header는 모든 페이지에 공통으로 나타남 */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/makeId" element={<MakeId />} />
              <Route path="/allarticlepage" element={<Allarticlepage />} />
              <Route path="/search" element={<SearchResults />} /> {/* 검색 결과 페이지 경로 */}
              <Route path="/articlecontext" element={<ArticleContext />} />
              <Route path="/mypage" element={<Mypage />} />
              <Route path="/article/:id" element={<Article />} />
            </Routes>
          </ArticleProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;