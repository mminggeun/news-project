import './App.css';
import Header from './components/Header';
import Home from './components/Home';
import Login from './pages/Login';
import MakeId from './pages/MakeId';
import Article from './pages/Article';
import Allarticlepage from './pages/Allarticlepage';
import ArticleContext from './pages/ArticleContext';
import Mypage from './pages/Mypage';
import { ArticleProvider } from './pages/ArticleContext'; // ArticleProvider import
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className='App'>
      <Router>
        <ArticleProvider>
          <Routes>
            <Route path="/" element={
              <>
                <Header />
                <Home />
              </>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/makeId" element={<MakeId />} />
            <Route path="/allarticlepage" element={
              <>
                <Header />
                <Allarticlepage/>
              </>}
            />
            <Route path="/articlecontext" element={
              <>
                <Header />
                <ArticleContext/>
              </>}
            />
            <Route path="/mypage" element={
              <>
                <Header />
                <Mypage/>
              </>}
            />
            <Route path="/article/:id" element={
              <>
                <Header />
                <Article />
              </>}
            />
          </Routes>
        </ArticleProvider>
      </Router>
    </div>
  );
}

export default App;
