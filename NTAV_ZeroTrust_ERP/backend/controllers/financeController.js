const path = require('path');

exports.getSummary = (req, res) => {
    const summary = {
      income: 120000000,
      expense: 85000000,
      cashFlow: 35000000,
    };
    res.json(summary);
  };
  
  exports.getProfitLoss = (req, res) => {
    const data = [
      { month: '1월', income: 40000, expense: 24000 },
      { month: '2월', income: 30000, expense: 13980 },
      { month: '3월', income: 20000, expense: 9800 },
      { month: '4월', income: 28000, expense: 15000 },
    ];
    res.json(data);
  };

// 예산 vs 실적
exports.getBudgetVsActual = (req, res) => {
  const data = [
    { month: '1월', budget: 50000, actual: 48000 },
    { month: '2월', budget: 60000, actual: 62000 },
    { month: '3월', budget: 55000, actual: 50000 },
    { month: '4월', budget: 70000, actual: 71000 },
  ];
  res.json(data);
};

//부서별
exports.getDepartmentComparison = (req, res) => {
  const data = [
    { department: '영업부', budget: 60000, actual: 58000 },
    { department: '마케팅부', budget: 50000, actual: 52000 },
    { department: '개발부', budget: 70000, actual: 69000 },
    { department: '재무부', budget: 40000, actual: 41000 },
  ];
  res.json(data);
};

// 작년 vs 올해 월별 수익 비교
exports.getYearlyProfitComparison = (req, res) => {
  const data = [
    { month: '1월', lastYear: 30000, thisYear: 40000 },
    { month: '2월', lastYear: 32000, thisYear: 39000 },
    { month: '3월', lastYear: 28000, thisYear: 42000 },
    { month: '4월', lastYear: 35000, thisYear: 41000 },
    { month: '5월', lastYear: 37000 },
    { month: '6월', lastYear: 36000 },
    { month: '7월', lastYear: 39000 },
    { month: '8월', lastYear: 40000 },
    { month: '9월', lastYear: 42000 },
    { month: '10월', lastYear: 41000 },
    { month: '11월', lastYear: 43000 },
    { month: '12월', lastYear: 44000 },
  ];
  res.json(data);
};

exports.uploadPDF = (req, res) => {
  console.log("📥 업로드 요청 수신");
  console.log("파일 정보:", req.file);

  if (!req.file) {
    return res.status(400).json({ error: "PDF 파일이 필요합니다." });
  }

  res.status(200).json({ message: "업로드 성공", filename: req.file.filename });
};

exports.getPDFList = (req, res) => {
  const fs = require('fs');
  const dirPath = path.join(__dirname, '../uploads');

  fs.readdir(dirPath, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "파일 목록을 불러올 수 없습니다." });
    }
    res.json(files.filter(file => file.endsWith('.pdf')));
  });
};