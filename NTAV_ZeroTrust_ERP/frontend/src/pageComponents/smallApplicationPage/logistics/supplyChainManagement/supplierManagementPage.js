import React, { useState, useEffect } from 'react';
import '../../../../css/supplierManagementPage.css';

const SupplierManagementPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip_code: '',
    status: 'ACTIVE',
    supplier_tier: 'Gold',
    remarks: ''
  });
  const [newContract, setNewContract] = useState({
    supplier_id: '',
    start_date: '',
    expire_date: '',
    contract_value: '',
    contract_status: 'ACTIVE',
    contract_terms: '',
    dms_doc_link: ''
  });

  useEffect(() => {
    const dummySuppliers = [
        { supplier_id: 1, name: 'ABC Supplies', email: 'abc@example.com', address: '123 Main St', city: 'Seoul', zip_code: '12345', status: 'ACTIVE', supplier_tier: 'Gold', remarks: 'Trusted coffee bean supplier' },
        { supplier_id: 2, name: 'XYZ Ingredients', email: 'xyz@example.com', address: '456 Market St', city: 'Busan', zip_code: '67890', status: 'INACTIVE', supplier_tier: 'Silver', remarks: 'Seasonal bakery supplier' },
        { supplier_id: 3, name: 'Coffee Express', email: 'coffee@express.com', address: '789 Bean Blvd', city: 'Incheon', zip_code: '11011', status: 'ACTIVE', supplier_tier: 'Bronze', remarks: 'Fast coffee delivery' },
        { supplier_id: 4, name: 'Fresh Dairy Co', email: 'contact@freshdairy.co', address: '321 Milk Lane', city: 'Daegu', zip_code: '42000', status: 'ACTIVE', supplier_tier: 'Silver', remarks: 'Organic dairy products' },
        { supplier_id: 5, name: 'Logistics Ltd', email: 'info@logisticsltd.com', address: '654 Cargo Rd', city: 'Daejeon', zip_code: '34000', status: 'INACTIVE', supplier_tier: 'Gold', remarks: 'Cold chain logistics' }
      ];
  
      const dummyContracts = [
        { contract_id: 1, supplier_id: 1, start_date: '2025-01-01', expire_date: '2025-12-31', contract_value: 5000000, contract_status: 'ACTIVE', contract_terms: 'Yearly supply agreement', dms_doc_link: 'https://dms.example.com/docs/1' },
        { contract_id: 2, supplier_id: 2, start_date: '2025-03-01', expire_date: '2025-09-30', contract_value: 2500000, contract_status: 'EXPIRED', contract_terms: 'Seasonal supply contract', dms_doc_link: 'https://dms.example.com/docs/2' },
        { contract_id: 3, supplier_id: 3, start_date: '2025-02-15', expire_date: '2025-11-15', contract_value: 3000000, contract_status: 'PENDING', contract_terms: 'Express delivery services', dms_doc_link: 'https://dms.example.com/docs/3' }
      ];

    setSuppliers(dummySuppliers);
    setContracts(dummyContracts);
  }, []);

  const handleCreateSupplier = () => {
    const newId = suppliers.length + 1;
    setSuppliers([...suppliers, { ...newSupplier, supplier_id: newId }]);
    setNewSupplier({ name: '', email: '', address: '', city: '', zip_code: '', status: 'ACTIVE', supplier_tier: 'Gold', remarks: '' });
  };

  const handleCreateContract = () => {
    const newId = contracts.length + 1;
    setContracts([...contracts, { ...newContract, contract_id: newId }]);
    setNewContract({ supplier_id: '', start_date: '', expire_date: '', contract_value: '', contract_status: 'ACTIVE', contract_terms: '', dms_doc_link: '' });
  };

  return (
    <div className="supplier-management">
      <h2>공급업체 관리</h2>

      <div className="section">
        <h3>새로운 공급업체 등록</h3>
        <div className="form-row">
          <input placeholder="이름" value={newSupplier.name} onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })} />
          <input placeholder="이메일" value={newSupplier.email} onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })} />
          <input placeholder="주소" value={newSupplier.address} onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })} />
          <input placeholder="도시" value={newSupplier.city} onChange={(e) => setNewSupplier({ ...newSupplier, city: e.target.value })} />
          <input placeholder="우편번호" value={newSupplier.zip_code} onChange={(e) => setNewSupplier({ ...newSupplier, zip_code: e.target.value })} />
        </div>
        <div className="form-row">
          <select value={newSupplier.status} onChange={(e) => setNewSupplier({ ...newSupplier, status: e.target.value })}>
            <option value="ACTIVE">활성</option>
            <option value="INACTIVE">비활성</option>
          </select>
          <select value={newSupplier.supplier_tier} onChange={(e) => setNewSupplier({ ...newSupplier, supplier_tier: e.target.value })}>
            <option value="Gold">Gold</option>
            <option value="Silver">Silver</option>
            <option value="Bronze">Bronze</option>
          </select>
          <button onClick={handleCreateSupplier}>등록</button>
        </div>
      </div>

      <div className="section">
        <h3>등록된 공급업체</h3>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>이름</th>
              <th>이메일</th>
              <th>주소</th>
              <th>도시</th>
              <th>우편번호</th>
              <th>상태</th>
              <th>등급</th>
              <th>비고</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s) => (
              <tr key={s.supplier_id}>
                <td>{s.supplier_id}</td>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.address}</td>
                <td>{s.city}</td>
                <td>{s.zip_code}</td>
                <td>{s.status}</td>
                <td>{s.supplier_tier}</td>
                <td>{s.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="section">
        <h3>새로운 계약 등록</h3>
        <div className="form-row">
          <select value={newContract.supplier_id} onChange={(e) => setNewContract({ ...newContract, supplier_id: e.target.value })}>
            <option value="">공급업체 선택</option>
            {suppliers.map((s) => (
              <option key={s.supplier_id} value={s.supplier_id}>{s.name}</option>
            ))}
          </select>
          <input type="date" value={newContract.start_date} onChange={(e) => setNewContract({ ...newContract, start_date: e.target.value })} />
          <input type="date" value={newContract.expire_date} onChange={(e) => setNewContract({ ...newContract, expire_date: e.target.value })} />
        </div>
        <div className="form-row">
          <input type="number" placeholder="계약 금액" value={newContract.contract_value} onChange={(e) => setNewContract({ ...newContract, contract_value: e.target.value })} />
          <select value={newContract.contract_status} onChange={(e) => setNewContract({ ...newContract, contract_status: e.target.value })}>
            <option value="ACTIVE">활성</option>
            <option value="EXPIRED">만료</option>
            <option value="SUSPENDED">중지</option>
            <option value="TERMINATED">해지</option>
            <option value="PENDING">대기</option>
            <option value="RENEWING">갱신 중</option>
          </select>
        </div>
        <div className="form-row">
          <input placeholder="계약 조건" value={newContract.contract_terms} onChange={(e) => setNewContract({ ...newContract, contract_terms: e.target.value })} />
          <input placeholder="DMS 문서 링크" value={newContract.dms_doc_link} onChange={(e) => setNewContract({ ...newContract, dms_doc_link: e.target.value })} />
          <button onClick={handleCreateContract}>등록</button>
        </div>
      </div>

      <div className="section">
        <h3>등록된 계약</h3>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>공급업체 ID</th>
              <th>시작일</th>
              <th>만료일</th>
              <th>계약 금액</th>
              <th>상태</th>
              <th>계약 조건</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((c) => (
              <tr key={c.contract_id}>
                <td>{c.contract_id}</td>
                <td>{c.supplier_id}</td>
                <td>{c.start_date}</td>
                <td>{c.expire_date}</td>
                <td>{c.contract_value.toLocaleString()} 원</td>
                <td>{c.contract_status}</td>
                <td>{c.contract_terms}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupplierManagementPage;

