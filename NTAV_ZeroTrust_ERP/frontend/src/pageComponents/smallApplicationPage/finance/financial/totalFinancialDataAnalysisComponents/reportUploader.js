import React, { useState, useEffect } from "react";
import { uploadPDF, fetchPDFList } from "../../../../../api"; // API 호출 함수

export default function ReportUploader() {
    const [file, setFile] = useState(null);
    const [pdfList, setPdfList] = useState([]);
  
    const handleUpload = async () => {
      if (!file) return;
  
      try {
        await uploadPDF(file);
        setFile(null);
        handleFetchPDFList();
      } catch (err) {
        console.error("업로드 실패:", err);
      }
    };
  
    const handleFetchPDFList = async () => {
      const list = await fetchPDFList();
      setPdfList(list);
    };
  
    useEffect(() => {
      handleFetchPDFList();
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
          onClick={handleUpload}
        >
          업로드
        </button>
  
        <div>
          <h3 className="font-semibold mt-4 mb-2">📁 업로드된 PDF 목록</h3>
          <ul className="list-disc pl-5 text-blue-700 space-y-1">
            {pdfList.map((filename, idx) => (
              <li key={idx}>
                <a href={`https://192.168.100.51:4330/uploads/${filename}`} target="_blank" rel="noreferrer">
                  {filename}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }