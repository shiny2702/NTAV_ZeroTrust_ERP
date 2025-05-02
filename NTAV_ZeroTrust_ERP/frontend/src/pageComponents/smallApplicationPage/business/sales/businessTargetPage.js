// File: businessTargetPage.js
import React, { useState, useEffect } from "react";
import "../../../../css/businessTargetPage.css";

const BusinessTargetPage = () => {
  const [objectives, setObjectives] = useState([]);
  const [filteredObjectives, setFilteredObjectives] = useState([]);
  const [selectedObjective, setSelectedObjective] = useState(null);
  const [newObjective, setNewObjective] = useState({
    name: "",
    type: "Revenue",
    amount: "",
    quantity: "",
    dms_doc_link: "",
    start: "",
    end: "",
  });
  const [filters, setFilters] = useState({
    keyword: "",
    type: "",
    start: "",
    end: "",
  });

  useEffect(() => {
    const dummy = [
      {
        id: 1,
        type: "Revenue",
        name: "상반기 매출 목표",
        amount: 120000000,
        quantity: null,
        start: "2025-01-01",
        end: "2025-06-30",
        status: "진행중",
        createdAt: "2025-01-10",
        updatedAt: "2025-03-01",
        actualEndDate: null,
        dms_doc_link: "https://dms.example.com/docs/1",
        description: "기업 매출 목표 설정 (상세 내용 링크 참조)",
        link: "#",
      },
      {
        id: 2,
        type: "New Customer",
        name: "신규 고객 유치 캠페인",
        amount: null,
        quantity: 300,
        start: "2025-03-01",
        end: "2025-05-31",
        status: "완료",
        createdAt: "2025-02-15",
        updatedAt: "2025-05-25",
        actualEndDate: "2025-05-28",
        dms_doc_link: "https://dms.example.com/docs/2",
        description: "신규 고객 확보 마케팅 활동",
        link: "#",
      },
      {
        id: 3,
        type: "Sales Quantity",
        name: "3분기 제품 판매 목표",
        amount: null,
        quantity: 1500,
        start: "2025-07-01",
        end: "2025-09-30",
        status: "진행중",
        createdAt: "2025-06-20",
        updatedAt: "2025-07-01",
        actualEndDate: null,
        dms_doc_link: "https://dms.example.com/docs/3",
        description: "주력 제품 판매량 증대 목표",
        link: "#",
      },
      {
        id: 4,
        type: "Profit Margin",
        name: "수익성 향상 프로젝트",
        amount: 80000000,
        quantity: null,
        start: "2025-02-01",
        end: "2025-04-30",
        status: "완료",
        createdAt: "2025-01-25",
        updatedAt: "2025-04-25",
        actualEndDate: "2025-04-29",
        dms_doc_link: "https://dms.example.com/docs/4",
        description: "운영비 절감 및 고마진 상품 집중 전략",
        link: "#",
      },
      {
        id: 5,
        type: "Repeat Customer",
        name: "지속 고객 확보 캠페인",
        amount: null,
        quantity: 500,
        start: "2025-05-01",
        end: "2025-08-31",
        status: "지연",
        createdAt: "2025-04-15",
        updatedAt: "2025-08-01",
        actualEndDate: null,
        dms_doc_link: "https://dms.example.com/docs/5",
        description: "재구매율 증가 목표 및 리워드 프로그램 운영",
        link: "#",
      },
    ];
    setObjectives(dummy);
    setFilteredObjectives(dummy);
  }, []);

  const handleFilter = () => {
    const filtered = objectives.filter((obj) => {
      const matchType = filters.type ? obj.type === filters.type : true;
      const matchKeyword = obj.name.includes(filters.keyword) || obj.description?.includes(filters.keyword);
      const matchDate =
        (!filters.start || obj.start >= filters.start) &&
        (!filters.end || obj.end <= filters.end);
      return matchType && matchKeyword && matchDate;
    });
    setFilteredObjectives(filtered);
  };

  const handleCreateObjective = () => {
    const newObj = {
      ...newObjective,
      id: objectives.length + 1,
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
      status: "진행중",
      description: "",
      actualEndDate: null,
      link: newObjective.dms_doc_link,
    };
    const updated = [...objectives, newObj];
    setObjectives(updated);
    setFilteredObjectives(updated);
    setNewObjective({ name: "", type: "Revenue", amount: "", quantity: "", dms_doc_link: "", start: "", end: "" });
  };

  const countStatus = (status) => objectives.filter((o) => o.status === status).length;

  return (
    <div className="salesObjectivesPage">
      <div className="summaryBox">
        <h2>영업 목표 요약 대시보드</h2>
        <p>
          총 목표 수: {objectives.length} / 진행 중: {countStatus("진행중")} / 완료: {countStatus("완료")} / 지연: {countStatus("지연")}
        </p>
      </div>

      <div className="createObjectiveBox">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <input type="date" value={filters.start} onChange={(e) => setFilters({ ...filters, start: e.target.value })} />
          <span>~</span>
          <input type="date" value={filters.end} onChange={(e) => setFilters({ ...filters, end: e.target.value })} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
          <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
            <option value="">전체 유형</option>
            <option value="Revenue">Revenue</option>
            <option value="Sales Quantity">Sales Quantity</option>
            <option value="New Customer Acquisition">New Customer Acquisition</option>
            <option value="Market Share">Market Share</option>
            <option value="Repeat Customer">Repeat Customer</option>
            <option value="Cost Reduction">Cost Reduction</option>
            <option value="Profit Margin">Profit Margin</option>
            <option value="Sales Pipeline">Sales Pipeline</option>
            <option value="Other">Other</option>
          </select>
          <input
            style={{ marginLeft: '15px' }}
            type="text"
            placeholder="목표명, 설명 검색"
            value={filters.keyword}
            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
          />
          <button onClick={handleFilter}>검색</button>
        </div>
      </div>

      <div className="listTab">
        <h2>목표 리스트</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>목표 유형</th>
              <th>목표명</th>
              <th>금액</th>
              <th>수량</th>
              <th>기간</th>
              <th>상태</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredObjectives.map((obj) => (
              <tr key={obj.id}>
                <td>{obj.id}</td>
                <td>{obj.type}</td>
                <td>{obj.name}</td>
                <td>{obj.amount ? obj.amount.toLocaleString() + "원" : "-"}</td>
                <td>{obj.quantity || "-"}</td>
                <td>{obj.start} ~ {obj.end}</td>
                <td>{obj.status}</td>
                <td>
                  <button onClick={() => setSelectedObjective(obj)}>보기</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="createObjectiveBox">
        <h3>영업 목표 설정에 사용할 근거 자료</h3>
        <p>성과 평가 / 시장 조사 / 재무 데이터 / 고객 관리 등의 근거를 선택하거나 입력해 주세요.</p>
        <select>
          <option value="">근거 유형 선택</option>
          <option value="performance">성과평가</option>
          <option value="market">시장조사</option>
          <option value="finance">재무데이터분석</option>
          <option value="crm">고객관리</option>
          <option value="other">기타</option>
        </select>
        <input type="text" placeholder="추가 설명 또는 참고 링크 입력" style={{ marginLeft: '25px', width: '300px' }} />
      </div>

      <div className="createObjectiveBox">
        <h3>새 목표 등록</h3>
        <input
          placeholder="목표명"
          value={newObjective.name}
          onChange={(e) => setNewObjective({ ...newObjective, name: e.target.value })}
        />
        <select
          value={newObjective.type}
          onChange={(e) => setNewObjective({ ...newObjective, type: e.target.value })}
        >
          <option value="Revenue">Revenue</option>
          <option value="Sales Quantity">Sales Quantity</option>
          <option value="New Customer Acquisition">New Customer Acquisition</option>
          <option value="Market Share">Market Share</option>
          <option value="Repeat Customer">Repeat Customer</option>
          <option value="Cost Reduction">Cost Reduction</option>
          <option value="Profit Margin">Profit Margin</option>
          <option value="Sales Pipeline">Sales Pipeline</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="month"
          value={newObjective.start}
          onChange={(e) => setNewObjective({ ...newObjective, start: e.target.value })}
        />
        ~
        <input
          type="month"
          value={newObjective.end}
          onChange={(e) => setNewObjective({ ...newObjective, end: e.target.value })}
        />
        <input
          type="text"
          placeholder="DMS 문서 링크"
          value={newObjective.dms_doc_link}
          onChange={(e) => setNewObjective({ ...newObjective, dms_doc_link: e.target.value })}
        />
        <div>
          {/* 라디오 버튼 */}
          {/* ... (생략) */}
        </div>
        <input
          type="number"
          placeholder="목표 금액"
          value={newObjective.amount}
          onChange={(e) => setNewObjective({ ...newObjective, amount: e.target.value })}
        />
        <input
          type="number"
          placeholder="목표 수량"
          value={newObjective.quantity}
          onChange={(e) => setNewObjective({ ...newObjective, quantity: e.target.value })}
        />
        <button onClick={handleCreateObjective}>등록</button>
      </div>

      {selectedObjective && (
        <div className="modal">
          <div className="modalContent">
            <h3>{selectedObjective.name}</h3>
            <p>목표 유형: {selectedObjective.type}</p>
            <p>설명: {selectedObjective.description}</p>
            <p>금액: {selectedObjective.amount ? selectedObjective.amount.toLocaleString() + "원" : "-"}</p>
            <p>수량: {selectedObjective.quantity || "-"}</p>
            <p>기간: {selectedObjective.start} ~ {selectedObjective.end}</p>
            <p>상태: {selectedObjective.status}</p>
            <p>DMS 문서 링크: <a href={selectedObjective.dms_doc_link} target="_blank" rel="noopener noreferrer">바로가기</a></p>
            <p>생성일: {selectedObjective.createdAt}</p>
            <p>목표 종료일: {selectedObjective.end}</p>
            <p>실제 종료일: {selectedObjective.actualEndDate || '-'}</p>
            <p>최종 수정일: {selectedObjective.updatedAt}</p>
            <button onClick={() => setSelectedObjective(null)}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessTargetPage;