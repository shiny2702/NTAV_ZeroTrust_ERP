import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ForbiddenPage from './pageComponents/forbiddenPage';
import LoadingPage from './pageComponents/loadingPage';
import DownLoadPage from './pageComponents/downloadPage';
import ErrorPage from './pageComponents/errorPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<LoadingPage />} /> {/* 클라이언트가 접속 요청 시 시작되는 페이지 */}
        <Route path="/exe-download" element={<DownLoadPage />} /> {/* quarantine zone */}
        <Route path="/forbidden" element={<ForbiddenPage />} /> {/* 권한 없음 페이지 */}
        <Route path="/error" element={<ErrorPage />} /> {/* 에러 페이지 */}
        {/* <Route path="/login" element={<App />} /> 우정님 로그인 페이지 */}
      </Routes>
    </Router>
  </React.StrictMode>
);
