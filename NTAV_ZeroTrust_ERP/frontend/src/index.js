import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './pageComponents/loginPage'; // App 대신 loginPage를 import

import MainPage from './pageComponents/mainPage';
import MainInitialContentArea from './pageComponents/initialPageContentArea/mainInitialContentArea';

import DeptHeadPage from './pageComponents/deptHeadPage';
import DeptHeadInitialContentArea from './pageComponents/initialPageContentArea/deptHeadInitialContentArea';

import CSuitePage from './pageComponents/csuitePage';
import CsuiteInitialContentArea from './pageComponents/initialPageContentArea/csuiteInitialContentArea';
import ProjectApprovalPage from './pageComponents/smallApplicationPage/CSuite/csuite/projectApprovalPage';

import ItSecurityPage from './pageComponents/itSecurityPage';
import ItSecurityInitialContentArea from './pageComponents/initialPageContentArea/itSecurityInitialContentArea';

import ERPManagementPage from './pageComponents/erpManagementPage';
import ERPManagementInitialContentArea from './pageComponents/initialPageContentArea/erpManagementInitialContentArea';
import AccountManagement from "./pageComponents/smallApplicationPage/itManagement/ERPManagement/accountManagementPage";

import ItDeptHeadPage from './pageComponents/itDeptHeadPage';
import ItDeptHeadInitialContentArea from './pageComponents/initialPageContentArea/itDeptHeadInitialContentArea';

import PasswordResetPage from './pageComponents/passwordResetPage';
import NoPermPage from './pageComponents/noPermPage';




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />        {/* 기존 App 대신 LoginPage 적용 */}


        <Route path="/main" element={<MainPage />} >
          <Route index element={<MainInitialContentArea />} />
        </Route>

        <Route path="/deptHead" element={<DeptHeadPage />} >
          <Route index element={<DeptHeadInitialContentArea />} />
        </Route>

        <Route path="/csuite" element={<CSuitePage />} >
          <Route index element={<CsuiteInitialContentArea />} />
          <Route path="projectApproval" element={<ProjectApprovalPage />} />
        </Route>

        <Route path="/itSecurity" element={<ItSecurityPage />} >
          <Route index element={<ItSecurityInitialContentArea />} />
        </Route>

        <Route path="/erpManagement" element={<ERPManagementPage />} >
          <Route index element={<ERPManagementInitialContentArea />} />
          <Route path="accountManagement" element={<AccountManagement />} />
        </Route>

        <Route path="/itDeptHead" element={<ItDeptHeadPage />} >
          <Route index element={<ItDeptHeadInitialContentArea />} />
        </Route>


        <Route path="/passwordReset" element={<PasswordResetPage />} />

        <Route path="/noPerm" element={<NoPermPage />} />

      </Routes>
    </Router>
  </React.StrictMode>
);





