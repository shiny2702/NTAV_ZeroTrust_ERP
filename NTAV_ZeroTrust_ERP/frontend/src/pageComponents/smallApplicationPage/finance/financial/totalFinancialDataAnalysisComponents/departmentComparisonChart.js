import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function DepartmentComparisonChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    console.log("📦 useEffect 실행됨");
    axios.get("http://localhost:5050/api/finance/department-comparison")
      .then(res => {
        console.log("📊 데이터 수신:", res.data);
        setData(res.data);
      })
      .catch(err => {
        console.error("❌ API 호출 오류:", err);
      });
  }, []);
  

  return (
    <div className="bg-white shadow rounded-2xl p-4">
      <h2 className="text-lg font-semibold mb-4">부서별 예산/실적 비교</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical">
          <XAxis type="number" />
          <YAxis dataKey="department" type="category" />
          <Tooltip />
          <Legend />
          <Bar dataKey="budget" fill="#A78BFA" name="예산" />
          <Bar dataKey="actual" fill="#34D399" name="실적" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}