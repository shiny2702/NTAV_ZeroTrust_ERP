import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ReportUploader() {
  const [file, setFile] = useState(null);
  const [pdfList, setPdfList] = useState([]);

  const uploadPDF = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:5050/api/reports/upload-pdf", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFile(null);
      fetchPDFList();
    } catch (err) {
      console.error("업로드 실패:", err);
    }
  };

  const fetchPDFList = async () => {
    const res = await axios.get("http://localhost:5050/api/reports/pdf-list");
    setPdfList(res.data);
  };

  useEffect(() => {
    fetchPDFList();
  }, []);

  return (
    <div className="bg-white shadow rounded-2xl p-4 space-y-4">
      <h2 className="text-lg font-semibold">📄 PDF 보고서 업로드</h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        onClick={uploadPDF}
      >
        업로드
      </button>

      <div>
        <h3 className="font-semibold mt-4 mb-2">📁 업로드된 PDF 목록</h3>
        <ul className="list-disc pl-5 text-blue-700 space-y-1">
          {pdfList.map((filename, idx) => (
            <li key={idx}>
              <a href={`http://localhost:5050/uploads/${filename}`} target="_blank" rel="noreferrer">
                {filename}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}