const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// 로그인  >>  sql injection 안전한 버전
exports.login = async (req, res) => {
  const { username, password } = req.body;

  // 입력값 형식 검증 (사번은 숫자여야 함)
  const employeeId = Number(username);
  if (isNaN(employeeId)) {
    return res.status(400).json({ message: '잘못된 사용자 ID 형식입니다.' });
  }

  try {
    // 1. 계정 정보 조회
    const [accountResult] = await db.query(
      'SELECT * FROM account WHERE employee_id = ?',
      [employeeId]
    );
    if (accountResult.length === 0) {
      return res.status(401).json({ message: '잘못된 사용자 이름 또는 비밀번호' });
    }

    const account = accountResult[0];

    // 1-1. 계정이 잠겨 있는지 확인
    if (account.is_active === 0) {
      return res.status(403).json({
        message: '계정 잠금 상태. 관리자에게 문의하세요.'
      });
    }


    // 2. 비밀번호 확인
    const isMatch = await bcrypt.compare(password, account.password_hash);

    if (!isMatch) {
      const failedAttempts = (account.failed_attempts || 0) + 1;

      
      // 실패 횟수 5 이상이면 계정 잠금
      if (failedAttempts >= 5) {
        await db.query(
          `UPDATE account SET failed_attempts = ?, is_active = 0 WHERE employee_id = ?`,
          [failedAttempts, account.employee_id]
        );

        return res.status(403).json({
          message: '5회 이상 로그인 실패. 계정이 잠겼습니다. 관리자에게 문의하세요.'
        });
      }

      // 아직 5회 미만이면 실패 횟수만 증가
      await db.query(
        'UPDATE account SET failed_attempts = ? WHERE employee_id = ?',
        [failedAttempts, account.employee_id]
      );

      return res.status(401).json({
        message: `로그인 ${failedAttempts}회 실패. 5회 이상 로그인 실패 시 계정 잠금`,
        failed_attempts: failedAttempts
      });
    }

    // 로그인 성공 시 실패 횟수 초기화
    if (account.failed_attempts > 0) {
      await db.query(
        'UPDATE account SET failed_attempts = 0 WHERE employee_id = ?',
        [account.employee_id]
      );
    }


    // 3. employee 정보 조회
    const [employeeResult] = await db.query(
      'SELECT employee_id, first_name, last_name, email, roleInfo FROM employee WHERE employee_id = ?',
      [account.employee_id]
    );
    const employee = employeeResult[0];

    // 4. 부서 정보
    const [deptResult] = await db.query(
      `SELECT d.dept_no, d.dept_name, de.is_manager
       FROM dept_emp de
       JOIN department d ON de.dept_no = d.dept_no
       WHERE de.employee_id = ? AND de.is_active = 1`,
      [account.employee_id]
    );
    const department = deptResult[0] || null;

    // 5. 팀 정보
    const [teamResult] = await db.query(
      `SELECT t.team_no, t.team_name, te.is_manager
       FROM team_emp te
       JOIN team t ON te.team_no = t.team_no
       WHERE te.employee_id = ? AND te.is_active = 1`,
      [account.employee_id]
    );
    const team = teamResult[0] || null;

    // 6. 프로젝트 정보 (부서 번호에 따라 조건부 조회)
    let projects = [];
    if (department && [1, 2, 3, 4, 5, 6].includes(department.dept_no)) {
      const [projResult] = await db.query(
        `SELECT DISTINCT
            pae.proj_no, pae.from_date, pae.to_date, pae.is_manager,
            p.proj_name, p.status,
            d.dept_name AS lead_dept_name,
            t.team_name AS lead_team_name
         FROM proj_app_emp pae
         JOIN project p ON pae.proj_no = p.proj_no
         LEFT JOIN department d ON p.lead_dept_no = d.dept_no
         LEFT JOIN team t ON p.lead_team_no = t.team_no
         WHERE pae.employee_id = ?`,
        [account.employee_id]
      );
      projects = projResult;
    }

    // 7. 토큰 발급
    const token = jwt.sign(
      { id: account.employee_id, 
        role: employee.roleInfo,
        is_initial_password: account.is_initial_password, 
        department: department,
        team: team },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 8. 응답
    res.json({
      token,
      user: {
        employee_id: employee.employee_id,
        name: `${employee.last_name}${employee.first_name}`,
        email: employee.email,
        roleInfo: employee.roleInfo,
        is_initial_password: account.is_initial_password,
        department,
        team,
        projects,
      },
    });
  } 
  catch (err) {
    console.error('로그인 오류:', err);
    res.status(500).json({ error: '서버 오류' });
  }
};



// 비밀번호 확인
exports.verifyPassword = async (req, res) => {
  const { userId, password } = req.body;

  const query = 'SELECT * FROM account WHERE employee_id = ?';

  try {
    const [results] = await db.query(query, [userId]);

    if (results.length === 0) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    const account = results[0];

    const isMatch = await bcrypt.compare(password, account.password_hash);

    if (isMatch) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    console.error('[비밀번호 확인 중 오류]', err);
    res.status(500).json({ error: '서버 오류' });
  }
};



// 비밀번호 변경
exports.updatePassword = async (req, res) => {
  const { userId, newPassword } = req.body;

  try {
    // userId로 DB에서 사용자 레코드 조회
    const [result] = await db.query('SELECT * FROM account WHERE employee_id = ?', [userId]);

    if (result.length === 0) {
      return res.status(404).json({ success: false, message: "사용자를 찾을 수 없습니다." });
    }

    // 비밀번호 해시
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // 해시된 비밀번호로 DB 업데이트
    await db.query(
      'UPDATE account SET password_hash = ? WHERE employee_id = ?',
      [hashedPassword, userId]
    );

    return res.status(200).json({ success: true, message: "비밀번호가 성공적으로 변경되었습니다." });
  } 
  catch (err) {
    console.error('비밀번호 변경 오류:', err);
    return res.status(500).json({ success: false, message: "서버 오류가 발생했습니다." });
  }
};


// is_initial_password 값을 false로 업데이트
exports.updateInitialPasswordStatus = async (req, res) => {
  const { userId } = req.body;

  try {
    await db.query("UPDATE account SET is_initial_password = false WHERE employee_id = ?", [userId]);

    res.json({ success: true, message: "초기 비밀번호 상태 업데이트 완료" });

  } catch (error) {
    res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
};





