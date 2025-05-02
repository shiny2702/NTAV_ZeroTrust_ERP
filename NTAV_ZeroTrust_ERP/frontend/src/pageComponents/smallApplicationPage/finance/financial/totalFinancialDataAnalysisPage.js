import React, { Component } from "react";
import DashboardHeader from "./totalFinancialDataAnalysisComponents/dashboardHeader";
import ProfitLossChart from "./totalFinancialDataAnalysisComponents/profitLossChart";
import BudgetVsActualChart from "./totalFinancialDataAnalysisComponents/budgetVsActualChart";
import DepartmentComparisonChart from "./totalFinancialDataAnalysisComponents/departmentComparisonChart";
import YearlyProfitComparisonChart from "./totalFinancialDataAnalysisComponents/yearlyProfitComparisonChart";
import ReportUploader from "./totalFinancialDataAnalysisComponents/reportUploader";

import "../../../../css/totalFinancialDataAnalysisPage.css";

class TotalFinancialDataAnalysisPage extends Component {
  render() {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold text-gray-800">ERP 재무 분석</h1>
        <DashboardHeader />
        <ProfitLossChart />
        <YearlyProfitComparisonChart />
        <BudgetVsActualChart />
        <DepartmentComparisonChart />
        <ReportUploader />
      </div>
    );
  }
}

export default TotalFinancialDataAnalysisPage;

