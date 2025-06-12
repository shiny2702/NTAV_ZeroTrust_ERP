import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { menuRoutes, itMenuRoutes } from './routesConfig';
import RedirectOnDirectAccess from './redirectOnDirectAccess';
import SecureRoute from './tokenVerification'; // 토큰 검증을 위한 컴포넌트


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

import ItDeptHeadPage from './pageComponents/itDeptHeadPage';
import ItDeptHeadInitialContentArea from './pageComponents/initialPageContentArea/itDeptHeadInitialContentArea';

import PasswordResetPage from './pageComponents/passwordResetPage';
import NoPermPage from './pageComponents/noPermPage';

//mfa
import MfaStartPage from './pageComponents/MfaStart';
import MfaCallbackPage from './pageComponents/MfaCallback';
import MfaCallbackFinalizePage from './pageComponents/MfaCallbackFinalize';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router basename="/erp-frontend">
      <Routes>
        <Route path="/" element={<LoginPage />} />        {/* 기존 App 대신 LoginPage 적용 */}


        <Route path="/main" element={
          <SecureRoute>
            <RedirectOnDirectAccess><MainPage /></RedirectOnDirectAccess>
          </SecureRoute>
        }>
          <Route index element={<MainInitialContentArea />} />
          {menuRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>


        <Route path="/deptHead" element={
          <SecureRoute>
            <RedirectOnDirectAccess><DeptHeadPage /></RedirectOnDirectAccess>
          </SecureRoute>
        }>
          <Route index element={<DeptHeadInitialContentArea />} />
          {menuRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>


        <Route path="/csuite" element={
          <SecureRoute>
            <RedirectOnDirectAccess><CSuitePage /></RedirectOnDirectAccess>
          </SecureRoute>
        }>
          <Route index element={<CsuiteInitialContentArea />} />
          {menuRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
          <Route path="projectApproval" element={<ProjectApprovalPage />} />
        </Route>


        <Route path="/itSecurity" element={
          <SecureRoute>
            <RedirectOnDirectAccess><ItSecurityPage /></RedirectOnDirectAccess>
          </SecureRoute>
        }>
          <Route index element={<ItSecurityInitialContentArea />} />
          {itMenuRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>


        <Route path="/erpManagement" element={
          <SecureRoute>
            <RedirectOnDirectAccess><ERPManagementPage /></RedirectOnDirectAccess>
          </SecureRoute>
        }>
          <Route index element={<ERPManagementInitialContentArea />} />
          {itMenuRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>

        <Route path="/itDeptHead" element={
          <SecureRoute>
            <RedirectOnDirectAccess><ItDeptHeadPage /></RedirectOnDirectAccess>
          </SecureRoute>
        }>
          <Route index element={<ItDeptHeadInitialContentArea />} />
          {itMenuRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>


        <Route path="/passwordReset" element={
          <SecureRoute>
            <RedirectOnDirectAccess><PasswordResetPage /></RedirectOnDirectAccess>
          </SecureRoute>
        } />

        <Route path="/noPerm" element={<NoPermPage />} />

        {/* mfa */}
        <Route path="/mfa/start" element={<MfaStartPage />} />
        <Route path="/mfa/callback" element={<MfaCallbackPage />} />
        <Route path="/mfa/callbackFinalize" element={<MfaCallbackFinalizePage />} />

      </Routes>
    </Router>
  </React.StrictMode>
);





