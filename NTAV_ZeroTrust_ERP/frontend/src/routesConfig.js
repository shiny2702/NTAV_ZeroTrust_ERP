// src/routes/routesConfig.js
import React from "react";

// 👉 각 페이지 컴포넌트 import (전체 50개 예시로 가정)
import BusinessTargetPage from "./pageComponents/smallApplicationPage/business/sales/businessTargetPage";
import BusinessEvaluationPage from "./pageComponents/smallApplicationPage/business/sales/businessEvaluationPage";
import B2BCustomerPage from "./pageComponents/smallApplicationPage/business/sales/b2bCustomerPage";
import BusinessStrategyPage from "./pageComponents/smallApplicationPage/business/strategicPlanning/businessStrategyPage";
import NewProductPlanPage from "./pageComponents/smallApplicationPage/business/strategicPlanning/newProductPlanPage";
import BusinessMarketSearchPage from "./pageComponents/smallApplicationPage/business/strategicPlanning/businessMarketSearchPage";
import BusinessOperatingCostPage from "./pageComponents/smallApplicationPage/business/strategicPlanning/businessOperatingCostPage";
import StoreManagementPage from "./pageComponents/smallApplicationPage/business/operations/storeManagementPage";
import MenuManagementPage from "./pageComponents/smallApplicationPage/business/operations/menuManagementPage";
import StoreOperatingCostPage from "./pageComponents/smallApplicationPage/business/operations/storeOperatingCostPage";
import SalesReportingPage from "./pageComponents/smallApplicationPage/business/operations/salesReportingPage";
import FinancialPlanPage from "./pageComponents/smallApplicationPage/finance/financial/financialPlanPage";
import BudgetManagementPage from "./pageComponents/smallApplicationPage/finance/financial/budgetManagementPage";
import TotalFinancialDataAnalysisPage from "./pageComponents/smallApplicationPage/finance/financial/totalFinancialDataAnalysisPage";
import FinancialRequestPage from "./pageComponents/smallApplicationPage/finance/financial/financialRequestPage";
import BookkeepingPage from "./pageComponents/smallApplicationPage/finance/accounting/bookkeepingPage";
import TaxManagementPage from "./pageComponents/smallApplicationPage/finance/accounting/taxManagementPage";
import HRPolicyPage from "./pageComponents/smallApplicationPage/hr/hrGuideline/hrPolicyPage";
import LeavePolicyPage from "./pageComponents/smallApplicationPage/hr/hrGuideline/leavePolicyPage";
import OrgStructureManagementPage from "./pageComponents/smallApplicationPage/hr/hrGuideline/orgStructureManagementPage";
import TrainingSessionPage from "./pageComponents/smallApplicationPage/hr/hrGuideline/trainingSessionPage";
import RecruitmentPage from "./pageComponents/smallApplicationPage/hr/hrAffair/recruitmentPage";
import HRRequestPage from "./pageComponents/smallApplicationPage/hr/hrAffair/hrRequestPage";
import SalaryManagementPage from "./pageComponents/smallApplicationPage/hr/hrAffair/salaryManagementPage";
import AttendanceManagementPage from "./pageComponents/smallApplicationPage/hr/hrAffair/attendanceManagementPage";
import HREvaluationPage from "./pageComponents/smallApplicationPage/hr/hrAffair/hrEvaluationPage";
import HROperatingCostPage from "./pageComponents/smallApplicationPage/hr/hrAffair/hrOperatingCostPage";
import MarketingMarketSearchPage from "./pageComponents/smallApplicationPage/marketing/marketing/marketingMarketSearchPage";
import MarketingStrategyPage from "./pageComponents/smallApplicationPage/marketing/marketing/marketingStrategyPage";
import MarketingCampaignPage from "./pageComponents/smallApplicationPage/marketing/marketing/marketingCampaignPage";
import MarketingEvaluationPage from "./pageComponents/smallApplicationPage/marketing/marketing/marketingEvaluationPage";
import MarketingOperatingCostPage from "./pageComponents/smallApplicationPage/marketing/marketing/marketingOperatingCostPage";
import ServicePolicyPage from "./pageComponents/smallApplicationPage/customerManagement/customerService/servicePolicyPage";
import RegisteredCustomerManagementPage from "./pageComponents/smallApplicationPage/customerManagement/customerService/registeredCustomerManagementPage";
import CustomerRequestFeedbackPage from "./pageComponents/smallApplicationPage/customerManagement/customerService/customerRequestFeedbackPage";
import CustomerRequestFeedbackAnalysisPage from "./pageComponents/smallApplicationPage/customerManagement/customerService/customerRequestFeedbackAnalysisPage";
import ServiceOperatingCostPage from "./pageComponents/smallApplicationPage/customerManagement/customerService/serviceOperatingCostPage";
import SupplierManagementPage from "./pageComponents/smallApplicationPage/logistics/supplyChainManagement/supplierManagementPage";
import CourierManagementPage from "./pageComponents/smallApplicationPage/logistics/supplyChainManagement/courierManagementPage";
import PurchaseStrategyPage from "./pageComponents/smallApplicationPage/logistics/supplyChainManagement/purchaseStrategyPage";
import LogisticsOperatingCostPage from "./pageComponents/smallApplicationPage/logistics/supplyChainManagement/logisticsOperatingCostPage";
import ProductManagementPage from "./pageComponents/smallApplicationPage/logistics/productOperation/productManagementPage";
import OrderAndShippingManagementPage from "./pageComponents/smallApplicationPage/logistics/productOperation/orderAndShippingManagementPage";
import QualityInspectionAndInventoryPage from "./pageComponents/smallApplicationPage/logistics/productOperation/qualityInspectionAndInventoryPage";

import ITSecurityPolicyPage from "./pageComponents/smallApplicationPage/itManagement/itSecurity/itSecurityPolicyPage";
import FirewallAndNetworkManagementPage from "./pageComponents/smallApplicationPage/itManagement/itSecurity/firewallAndNetworkManagementPage";
import SystemLogDataPage from "./pageComponents/smallApplicationPage/itManagement/itSecurity/systemLogDataPage";
import SystemLogManagementPage from "./pageComponents/smallApplicationPage/itManagement/itSecurity/systemLogManagementPage";
import QuarantineModuleManagementPage from "./pageComponents/smallApplicationPage/itManagement/itSecurity/quarantineModuleManagementPage";
import ITOperatingCostPage from "./pageComponents/smallApplicationPage/itManagement/itSecurity/itOperatingCostPage";
import AccountManagementPage from "./pageComponents/smallApplicationPage/itManagement/ERPManagement/accountManagementPage";
import ApplicationDependencyConfigurationPage from "./pageComponents/smallApplicationPage/itManagement/ERPManagement/applicationDependencyConfigurationPage";

// 👉 menuRoutes
export const menuRoutes = [
  { path: "businessTarget", element: <BusinessTargetPage /> },
  { path: "businessEvaluation", element: <BusinessEvaluationPage /> },
  { path: "b2bCustomer", element: <B2BCustomerPage /> },
  { path: "businessStrategy", element: <BusinessStrategyPage /> },
  { path: "newProductPlan", element: <NewProductPlanPage /> },
  { path: "businessMarketSearch", element: <BusinessMarketSearchPage /> },
  { path: "businessOperatingCost", element: <BusinessOperatingCostPage /> },
  { path: "storeManagement", element: <StoreManagementPage /> },
  { path: "menuManagement", element: <MenuManagementPage /> },
  { path: "storeOperatingCost", element: <StoreOperatingCostPage /> },
  { path: "salesReporting", element: <SalesReportingPage /> },
  { path: "financialPlan", element: <FinancialPlanPage /> },
  { path: "budgetManagement", element: <BudgetManagementPage /> },
  { path: "totalRinancialDataAnalysis", element: <TotalFinancialDataAnalysisPage /> },
  { path: "financialRequest", element: <FinancialRequestPage /> },
  { path: "bookkeeping", element: <BookkeepingPage /> },
  { path: "taxManagement", element: <TaxManagementPage /> },
  { path: "hrPolicy", element: <HRPolicyPage /> },
  { path: "leavePolicy", element: <LeavePolicyPage /> },
  { path: "orgStructureManagement", element: <OrgStructureManagementPage /> },
  { path: "trainingSession", element: <TrainingSessionPage /> },
  { path: "recruitment", element: <RecruitmentPage /> },
  { path: "hrRequest", element: <HRRequestPage /> },
  { path: "salaryManagement", element: <SalaryManagementPage /> },
  { path: "attendanceManagement", element: <AttendanceManagementPage /> },
  { path: "hrEvaluation", element: <HREvaluationPage /> },
  { path: "hrOperatingCost", element: <HROperatingCostPage /> },
  { path: "marketingMarketSearch", element: <MarketingMarketSearchPage /> },
  { path: "marketingStrategy", element: <MarketingStrategyPage /> },
  { path: "marketingCampaign", element: <MarketingCampaignPage /> },
  { path: "marketingEvaluation", element: <MarketingEvaluationPage /> },
  { path: "marketingOperatingCost", element: <MarketingOperatingCostPage /> },
  { path: "servicePolicy", element: <ServicePolicyPage /> },
  { path: "registeredCustomerManagement", element: <RegisteredCustomerManagementPage /> },
  { path: "customerRequestFeedback", element: <CustomerRequestFeedbackPage /> },
  { path: "customerRequestFeedbackAnalysis", element: <CustomerRequestFeedbackAnalysisPage /> },
  { path: "serviceOperatingCost", element: <ServiceOperatingCostPage /> },
  { path: "supplierManagement", element: <SupplierManagementPage /> },
  { path: "courierManagement", element: <CourierManagementPage /> },
  { path: "purchaseStrategy", element: <PurchaseStrategyPage /> },
  { path: "logisticsOperatingCost", element: <LogisticsOperatingCostPage /> },
  { path: "productManagement", element: <ProductManagementPage /> },
  { path: "orderAndShippingManagement", element: <OrderAndShippingManagementPage /> },
  { path: "qualityInspectionAndInventory", element: <QualityInspectionAndInventoryPage /> },
];

// 👉 itMenuRoutes
export const itMenuRoutes = [
  { path: "itSecurityPolicy", element: <ITSecurityPolicyPage /> },
  { path: "firewalAndNetworkManagement", element: <FirewallAndNetworkManagementPage /> },
  { path: "systemLogData", element: <SystemLogDataPage /> },
  { path: "systemLogManagement", element: <SystemLogManagementPage /> },
  { path: "quarantimeModuleManagement", element: <QuarantineModuleManagementPage /> },
  { path: "itOperatingCost", element: <ITOperatingCostPage /> },
  { path: "accountManagement", element: <AccountManagementPage /> },
  { path: "applicationDependencyConfiguration", element: <ApplicationDependencyConfigurationPage /> },
];
