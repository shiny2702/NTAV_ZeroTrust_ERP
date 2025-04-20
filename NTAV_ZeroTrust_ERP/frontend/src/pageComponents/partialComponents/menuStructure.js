// src/data/menuStructure.js

export const MENU_STRUCTURE = [
    {
      category: "경영",
      sections: [
        {
          title: "영업",
          items: [
            { name: "영업목표", app_no: 1, key: "businessTarget" },
            { name: "성과평가", app_no: 2, key: "businessEvaluation" },
            { name: "고객(B2B)관리", app_no: 3, key: "b2bCustomer" },
          ],
        },
        {
          title: "기획",
          items: [
            { name: "영업전략기획", app_no: 4, key: "businessStrategy" },
            { name: "신제품/서비스기획", app_no: 5, key: "newProductPlan" },
            { name: "시장조사", app_no: 6, key: "businessMarketSearch" },
            { name: "비용처리", app_no: 7, key: "businessOperatingCost" },
          ],
        },
        {
          title: "운영",
          items: [
            { name: "직영점관리", app_no: 8, key: "storeManagement" },
            { name: "메뉴관리", app_no: 9, key: "menuManagement" },
            { name: "비용처리", app_no: 10, key: "storeOperatingCost" },
            { name: "매출분석및보고", app_no: 11, key: "salesReporting" },
          ],
        },
      ],
    },
    {
      category: "재무회계",
      sections: [
        {
          title: "재무",
          items: [
            { name: "재무계획수립", app_no: 12, key: "financialPlan" },
            { name: "예산관리", app_no: 13, key: "budgetManagement" },
            { name: "재무데이터분석", app_no: 14, key: "totalRinancialDataAnalysis" },
            { name: "재무요청", app_no: 15, key: "financialRequest" },
          ],
        },
        {
          title: "회계",
          items: [
            { name: "회계기록유지", app_no: 16, key: "bookkeeping" },
            { name: "세무관리", app_no: 17, key: "taxManagement" },
          ],
        },
      ],
    },
    {
      category: "인사",
      sections: [
        {
          title: "HR정책",
          items: [
            { name: "인사정책수립", app_no: 18, key: "hrPolicy" },
            { name: "휴가정책수립", app_no: 19, key: "leavePolicy" },
            { name: "조직구성관리", app_no: 20, key: "orgStructureManagement" },
            { name: "직원교육", app_no: 21, key: "trainingSession" },
          ],
        },
        {
          title: "인사관리",
          items: [
            { name: "채용관리", app_no: 22, key: "recruitment" },
            { name: "인력지원", app_no: 23, key: "hrRequest" },
            { name: "급여관리", app_no: 24, key: "salaryManagement" },
            { name: "근태관리", app_no: 25, key: "attendanceManagement" },
            { name: "성과평가", app_no: 26, key: "hrEvaluation" },
            { name: "비용처리", app_no: 27, key: "hrOperatingCost" },
          ],
        },
      ],
    },
    {
      category: "마케팅",
      sections: [
        {
          title: "마케팅",
          items: [
            { name: "마케팅시장조사", app_no: 28, key: "marketingMarketSearch" },
            { name: "마케팅전략개발", app_no: 29, key: "marketingStrategy" },
            { name: "마케팅캠페인", app_no: 30, key: "marketingCampaign" },
            { name: "마케팅성과평가", app_no: 31, key: "marketingEvaluation" },
            { name: "비용처리", app_no: 32, key: "marketingOperatingCost" },
          ],
        },
      ],
    },
    {
      category: "고객관리",
      sections: [
        {
          title: "고객서비스",
          items: [
            { name: "서비스정책수립", app_no: 33, key: "servicePolicy" },
            { name: "회원관리", app_no: 34, key: "registeredCustomerManagement" },
            { name: "고객요청및피드백수집", app_no: 35, key: "customerRequestFeedback" },
            { name: "고객요청및피드백분석", app_no: 36, key: "customerRequestReedbackAnalysis" },
            { name: "비용처리", app_no: 37, key: "serviceOperatingCost" },
          ],
        },
      ],
    },
    {
      category: "물류",
      sections: [
        {
          title: "공급망관리",
          items: [
            { name: "공급업체관리", app_no: 38, key: "supplierManagement" },
            { name: "배송업체관리", app_no: 39, key: "courierManagement" },
            { name: "구매전략수립", app_no: 40, key: "purchaseStrategy" },
            { name: "비용처리", app_no: 41, key: "logisticsOperatingCost" },
          ],
        },
        {
          title: "물류",
          items: [
            { name: "제품관리", app_no: 42, key: "productManagement" },
            { name: "주문/배송관리", app_no: 43, key: "orderAndShippingManagement" },
            { name: "품질/재고관리", app_no: 44, key: "qualityInspectionAndInventory" },
          ],
        },
      ],
    },
  ];
  