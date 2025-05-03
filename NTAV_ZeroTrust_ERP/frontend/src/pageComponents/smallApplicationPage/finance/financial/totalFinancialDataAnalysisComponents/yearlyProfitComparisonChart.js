import React, { useEffect, useState } from "react";
import { fetchYearlyComparison } from "../../../../../api"; // API 호출 함수
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function YearlyProfitComparisonChart() {
    const [data, setData] = useState([]);

    useEffect(() => {
      fetchYearlyComparison()
        .then(setData)
        .catch((err) => console.error("❌ API 오류:", err));
    }, []);
  
    return (
      <div className="bg-white shadow rounded-2xl p-4">
        <h2 className="text-lg font-semibold mb-4">작년 vs 올해 손익 비교</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="lastYear" stroke="#60A5FA" strokeWidth={2} name="작년" />
            <Line type="monotone" dataKey="thisYear" stroke="#34D399" strokeWidth={2} name="올해" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }