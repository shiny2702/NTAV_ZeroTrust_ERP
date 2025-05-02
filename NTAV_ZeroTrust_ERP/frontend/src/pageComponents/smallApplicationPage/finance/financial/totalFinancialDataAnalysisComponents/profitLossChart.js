import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function ProfitLossChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5050/api/finance/profit-loss")
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="bg-white shadow rounded-2xl p-4">
      <h2 className="text-lg font-semibold mb-4">손익 분석</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="income" stroke="#4F46E5" strokeWidth={2} name="수익" />
          <Line type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={2} name="비용" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}