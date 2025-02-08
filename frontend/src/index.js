import React from 'react';
import ReactDOM from 'react-dom/client';
import './CSS/index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ForbiddenPage from './pageComponents/forbiddenPage';
import LoadingPage from './pageComponents/loadingPage';
import QuarantineZonePage from './pageComponents/quarantineZonePage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<LoadingPage />} /> {/* 기본 페이지 (홈) */}
        <Route path="/quarantine-zone" element={<QuarantineZonePage />} /> {/* 권한 없음 페이지 */}
        <Route path="/forbidden" element={<ForbiddenPage />} /> {/* 권한 없음 페이지 */}
        {/* <Route path="/login" element={<App />} /> 우정님 로그인 페이지 */}
      </Routes>
    </Router>
  </React.StrictMode>
);
