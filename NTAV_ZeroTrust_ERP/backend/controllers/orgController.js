const db = require('../config/db');

exports.fetchEmployeeLists = async (req, res) => {
    try {
      const query = `
      SELECT 
      e.employee_id,
      e.first_name,
      e.last_name,
      d.dept_no,
      d.dept_name,
      t.team_no,
      t.team_name,
      e.is_active,
      CASE 
        WHEN e.is_active = 1 THEN '재직'
        ELSE '퇴직'
      END AS status
    FROM employee e
    JOIN dept_emp de ON e.employee_id = de.employee_id 
    JOIN team_emp te ON e.employee_id = te.employee_id 
    JOIN team t ON te.team_no = t.team_no
    JOIN department d ON de.dept_no = d.dept_no
      `;
      const [rows] = await db.query(query);
      res.json(rows);
    } catch (err) {
      console.error("직원 목록 불러오기 실패:", err);
      res.status(500).json({ message: "서버 오류" });
    }
  };
  
  exports.fetchDepartment = async (req, res) => {
      try {
        const [rows] = await db.query("SELECT dept_name FROM department");
        res.json(rows);
      } catch (err) {
        console.error("부서 목록 불러오기 실패:", err);
        res.status(500).json({ message: "서버 오류" });
      }
    }
  
  exports.fetchTeam = async (req, res) => {
    try {
      const [rows] = await db.query('SELECT team_name FROM team');  // team 테이블에서 team_name을 가져오는 쿼리
      const teams = rows.map((row) => row.team_name); // 팀 이름만 추출
      res.json(teams); // 팀 목록 반환
    } catch (err) {
      console.error('팀 목록 조회 실패:', err);
      res.status(500).json({ error: '팀 목록을 가져오는 데 실패했습니다.' });
    }
  }
  
  exports.fetchDeptHead = async (req, res) => {
      try {
        const [rows] = await db.query(`
          SELECT 
            dh.dept_no,
            d.dept_name,
            dh.head
          FROM dept_head dh
          JOIN department d ON dh.dept_no = d.dept_no
          LEFT JOIN employee e ON dh.head = e.employee_id
        `);
        res.json(rows);
      } catch (err) {
        console.error("부서장 정보 불러오기 실패:", err);
        res.status(500).json({ error: "서버 오류로 부서장 정보를 불러오지 못했습니다." });
      }
    }
  
  exports.fetchTeamHead = async (req, res) => {
      try {
        const [rows] = await db.query(`
          SELECT 
            th.team_no,
            t.team_name,
            th.head,
            e.first_name,
            e.last_name
          FROM team_head th
          JOIN team t ON th.team_no = t.team_no
          LEFT JOIN employee e ON th.head = e.employee_id
        `);
        res.json(rows);
      } catch (err) {
        console.error("팀장 정보 불러오기 실패:", err);
        res.status(500).json({ error: "서버 오류로 팀장 정보를 불러오지 못했습니다." });
      }
    }
  
  exports.employeeDetail = async (req, res) => {
    const { employeeId } = req.body;
    
    const query = `
      SELECT 
        e.employee_id, 
        e.first_name, 
        e.last_name, 
        e.phone_no, 
        e.email,
        e.job,
        e.roleInfo,
        e.salary_account, 
        e.birth_date,
        e.hire_date, 
        e.end_date
      FROM employee e
      WHERE e.employee_id = ?
    `;
  
    try {
      const [results] = await db.query(query, [employeeId]);
  
      if (results.length === 0) {
        return res.status(404).json({ error: "해당 직원을 찾을 수 없습니다." });
      }
  
      res.json(results[0]);
    } catch (err) {
      console.error("직원 상세 조회 실패:", err);
      res.status(500).json({ error: "서버 오류" });
    }
  }
  
  exports.updateEmployeeDetail = async (req, res) => {
    const { id, dept_name, team_name, status } = req.body;
  
    try {
      // 부서 번호 가져오기
      const [deptRows] = await db.query(
        "SELECT dept_no FROM department WHERE dept_name = ?",
        [dept_name]
      );
      if (deptRows.length === 0) return res.status(400).json({ message: "부서 없음" });
  
      const dept_no = deptRows[0].dept_no;
  
      // 팀 번호 가져오기
      const [teamRows] = await db.query(
        "SELECT team_no FROM team WHERE team_name = ?",
        [team_name]
      );
      if (teamRows.length === 0) return res.status(400).json({ message: "팀 없음" });
  
      const team_no = teamRows[0].team_no;
  
      // employee 테이블의 is_active 업데이트
      await db.query(
        "UPDATE employee SET is_active = ? WHERE employee_id = ?",
        [status === "재직" ? 1 : 0, id]
      );
  
      // dept_emp 테이블 업데이트
      await db.query(
        "UPDATE dept_emp SET dept_no = ? WHERE employee_id = ?",
        [dept_no, id]
      );
  
      // team_emp 테이블 업데이트
      await db.query(
        "UPDATE team_emp SET team_no = ? WHERE employee_id = ?",
        [team_no, id]
      );
  
      res.json({
        employee_id: id,
        dept_name,
        team_name,
        status,
      });
    } catch (err) {
      console.error("직원 수정 실패:", err);
      res.status(500).json({ message: "수정 중 서버 오류 발생" });
    }
  }