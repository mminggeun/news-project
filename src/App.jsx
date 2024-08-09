import './App.css';
import Header from './components/Header';
import First from './pages/First';
import Home from './pages/Home';
import Register from './pages/Register';
import MakeId from './pages/MakeId';
import Article from './pages/Article'; 
import Allarticlepage from './pages/Allarticlepage';
import Mypage from './pages/Mypage';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path="/" element={<First />} />
          <Route path="/home" element={
            <>
              <Header />
              <Home />
            </>
          } />
          <Route path="/register" element={<Register />} />
          <Route path="/makeId" element={<MakeId />} />
          <Route path="/allarticlepage" element={
            <>
               <Header />
               <Allarticlepage/>
            </>} /> 
            <Route path="/mypage" element={
            <>
               <Header />
               <Mypage/>
            </>} /> 
          <Route path="/article/:id" element={
            <>
               <Header />
               <Article />
            </>} /> 
        </Routes>
      </Router>
    </div>
  );
}

export default App;