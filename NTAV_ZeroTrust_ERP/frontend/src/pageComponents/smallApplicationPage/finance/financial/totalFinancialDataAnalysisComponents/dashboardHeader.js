import React, { useEffect, useState } from "react";
import { fetchSummary } from "../../../../../api"; // API 호출 함수

function Card({ title, value, color }) {
    return (
      <div className="bg-white shadow rounded-2xl p-4 w-full sm:w-1/3">
        <h3 className="text-sm text-gray-500">{title}</h3>
        <p className={`text-2xl font-bold ${color}`}>₩{value.toLocaleString()}</p>
      </div>
    );
  }

export default function DashboardHeader() {
  const [summary, setSummary] = useState({ income: 0, expense: 0, cashFlow: 0 });

  useEffect(() => {
    fetchSummary()
      .then(setSummary)
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="flex flex-wrap gap-4">
      <Card title="총 수익" value={summary.income} color="text-blue-600" />
      <Card title="총 비용" value={summary.expense} color="text-red-500" />
      <Card title="현금 흐름" value={summary.cashFlow} color="text-green-600" />
    </div>
  );
}

