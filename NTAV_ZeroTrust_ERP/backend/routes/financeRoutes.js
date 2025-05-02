const express = require('express');
const router = express.Router();
const { getSummary, getProfitLoss, getBudgetVsActual, getDepartmentComparison, getYearlyProfitComparison, uploadPDF, getPDFList } = require('../controllers/financeController');

router.get('/summary', getSummary);

router.get('/profit-loss', getProfitLoss);

router.get('/budget-actual', getBudgetVsActual);

router.get('/department-comparison', getDepartmentComparison);

router.get('/yearly-profit-comparison', getYearlyProfitComparison); 

router.get('/pdf-list', getPDFList); 

module.exports = router;
