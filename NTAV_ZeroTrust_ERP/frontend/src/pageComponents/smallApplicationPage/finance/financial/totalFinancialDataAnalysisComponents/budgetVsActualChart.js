import React, { useEffect, useState } from "react";
import { fetchBudgetActual } from "../../../../../api"; // API 호출 함수
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function BudgetVsActualChart() {
    const [data, setData] = useState([]);

    useEffect(() => {
      fetchBudgetActual()
        .then(setData)
        .catch((err) => console.error(err));
    }, []);
  
    return (
      <div className="bg-white shadow rounded-2xl p-4">
        <h2 className="text-lg font-semibold mb-4">예산 vs 실적</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="budget" fill="#60A5FA" name="예산" />
            <Bar dataKey="actual" fill="#10B981" name="실적" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }