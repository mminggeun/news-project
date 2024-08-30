import './App.css';
import Header from './components/Header';
import Home from './components/Home';
import Login from './pages/Login';
import MakeId from './pages/MakeId';
import Article from './pages/Article';
import Allarticlepage from './pages/Allarticlepage';
import SearchResults from './pages/SearchResults';
import Mypage from './pages/Mypage';
import { AuthProvider } from './pages/AuthContext'; // AuthProvider import
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query'; // React Query import

const queryClient = new QueryClient();

function App() {
  return (
    <div className='App'>
      <QueryClientProvider client={queryClient}> {/* React Query의 전역 상태 관리를 위한 Provider */}
        <Router>
          <AuthProvider> {/* 사용자 인증 상태 관리를 위한 Provider */}
            <Header /> {/* Header는 모든 페이지에 공통으로 나타남 */}
            <Routes>
              <Route path="/" element={<Home />} /> {/* 홈 페이지 경로 */}
              <Route path="/login" element={<Login />} /> {/* 로그인 페이지 경로 */}
              <Route path="/makeId" element={<MakeId />} /> {/* 회원가입 페이지 경로 */}
              <Route path="/allarticlepage" element={<Allarticlepage />} /> {/* 모든 기사 페이지 경로 */}
              <Route path="/search" element={<SearchResults />} /> {/* 검색 결과 페이지 경로 */}
              <Route path="/mypage" element={<Mypage />} /> {/* 마이페이지 경로 */}
              <Route path="/article/:id" element={<Article />} /> {/* 개별 기사 페이지 경로 */}
            </Routes>
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </div>
  );
}

export default App;
