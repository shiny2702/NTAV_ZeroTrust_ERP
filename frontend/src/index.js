import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pageComponents/mainPage';
import AdminPage from './pageComponents/adminPage'
import NoPermPage from './pageComponents/noPermPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="105774342869-f21hqi363lkuo4m7ec9cc6fisgc1vpfu.apps.googleusercontent.com">  {/* 구글 클라이언트 ID */}
      <Router>
        <Routes>
          <Route path="/" element={<App />} />              {/* 로그인 페이지 */}
          <Route path="/main" element={<MainPage />} />     {/* 메인 페이지 */}
          <Route path="/admin" element={<AdminPage />} />   {/* 관리자 페이지 */}
          <Route path="/noPerm" element={<NoPermPage />} /> {/* 권한 없음 페이지 */}
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals 
reportWebVitals();

