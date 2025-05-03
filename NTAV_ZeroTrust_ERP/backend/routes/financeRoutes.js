const express = require('express');
const router = express.Router();
const { getSummary, getProfitLoss, getBudgetVsActual, getDepartmentComparison, getYearlyProfitComparison, uploadPDF, getPDFList } = require('../controllers/financeController');

const multer = require('multer');
const path = require('path');

// multer 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  
  const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (ext === '.pdf') {
        cb(null, true);
      } else {
        cb(new Error("PDF 파일만 업로드 가능합니다."));
      }
    }
  });

router.get('/summary', getSummary);

router.get('/profit-loss', getProfitLoss);

router.get('/budget-actual', getBudgetVsActual);

router.get('/department-comparison', getDepartmentComparison);

router.get('/yearly-profit-comparison', getYearlyProfitComparison); 

router.post('/upload-pdf', upload.single('file'), uploadPDF);

router.get('/pdf-list', getPDFList); 

module.exports = router;
