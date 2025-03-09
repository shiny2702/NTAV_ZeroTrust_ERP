import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pageComponents/loginPage'; // App 대신 loginPage를 import
import MainPage from './pageComponents/mainPage';
import CSuitePage from './pageComponents/csuitePage';
import NoPermPage from './pageComponents/noPermPage';
import AccountManagement from "./pageComponents/admin_accountManagementPage";
import PasswordResetPage from './pageComponents/passwordResetPage';
import ProjectApprovalPage from './pageComponents/smallApplicationPage/CSuite/csuite/projectApprovalPage';
import CsuiteInitialContentArea from './pageComponents/initialPageContentArea/csuiteInitialContentArea';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />        {/* 기존 App 대신 LoginPage 적용 */}
        <Route path="/passwordReset" element={<PasswordResetPage />} />
        
        <Route path="/main" element={<MainPage />} />

        <Route path="/csuite" element={<CSuitePage />} >
          <Route index element={<CsuiteInitialContentArea />} />
          <Route path="projectApproval" element={<ProjectApprovalPage />} />
        </Route>

        <Route path="/noPerm" element={<NoPermPage />} />

        <Route path="/admin/accountManagement" element={<AccountManagement />} />

      </Routes>
    </Router>
  </React.StrictMode>
);





