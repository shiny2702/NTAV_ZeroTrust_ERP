const db = require('../config/db');
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt'); // register시 비밀번호 해시용

const sendEmailToEmployee = async (employeeId, password) => {
  try {
    const [rows] = await db.promise().query(
      "SELECT email FROM employee WHERE employee_id = ?",
      [employeeId]
    );

    if (rows.length === 0) {
      throw new Error("직원을 찾을 수 없습니다.");
    }

    const employeeEmail = rows[0].email;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "april4326@gmail.com",
        pass: "biwr zwzy dfzc kmfh",
      },
    });

    const mailOptions = {
      from: "april4326@gmail.com",
      to: employeeEmail,
      subject: "초기 비밀번호 안내",
      text: `안녕하세요,\n\n귀하의 초기 비밀번호는 다음과 같습니다: ${password}\n\n로그인 후 비밀번호를 변경해 주세요.`,
    };

    await transporter.sendMail(mailOptions);
    return true;

  } catch (err) {
    console.error("이메일 전송 실패:", err.message);
    return false;
  }
};


exports.getEmployees = (req, res) => {
  const query = `
    SELECT 
      a.employee_id,
      e.last_name,
      e.first_name,
      a.is_active,
      a.is_initial_password,
      e.email,
      e.phone_no,
      e.birth_date,
      e.hired_date,
      a.created_at,
      a.updated_at,
    FROM account a
    JOIN employee e ON a.employee_id = e.employee_id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('직원 목록 조회 중 오류 발생:', err);
      return res.status(500).json({ error: 'DB 오류' });
    }
    res.json(results);
  });
  };

// 직원 등록
exports.getRegisterableEmployees = (req, res) => {
  const query = `
    SELECT e.employee_id
    FROM employee e
    LEFT JOIN account a ON e.employee_id = a.employee_id
    WHERE e.is_active = 1 AND a.employee_id IS NULL
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('등록 가능한 직원 목록 조회 실패:', err);
      return res.status(500).json({ error: '직원 목록 조회 실패' });
    }
    res.json(results); // [{ employee_id: 1001 }, { employee_id: 1002 }, ...]
  });
};

exports.getEmployeeInfo = (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT last_name, first_name, email, phone_num, hired_date
    FROM employee
    WHERE employee_id = ?
  `;
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('직원 정보 조회 실패:', err);
      return res.status(500).json({ error: '직원 정보 조회 실패' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: '직원을 찾을 수 없습니다.' });
    }
    res.json(results[0]);
  });
};


exports.registerEmployee = async (req, res) => {
  const { employee_id } = req.body;

  if (!employee_id ) {
    return res.status(400).json({ success: false, message: '사번을 선택해주세요.' });
  }

  try {
    // 1. employee_id가 employee 테이블에 실제 존재하는지 확인
    const [employeeRows] = await db.promise().query(
      'SELECT * FROM employee WHERE employee_id = ?',
      [employee_id]
    );
    if (employeeRows.length === 0) {
      return res.status(400).json({ success: false, message: '존재하지 않는 직원입니다.' });
    }

    // 2. 이미 account 테이블에 등록된 사번인지 확인
    const [accountRows] = await db.promise().query(
      'SELECT * FROM account WHERE employee_id = ?',
      [employee_id]
    );
    if (accountRows.length > 0) {
      return res.status(409).json({ success: false, message: '이미 등록된 사번입니다.' });
    }

    // 3. 비밀번호 해시 생성
    const generatePassword = () => Math.random().toString(36).slice(-8);
    const rawPassword = generatePassword();

    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(rawPassword, saltRounds);

    // 4. account 테이블에 삽입
    await db.promise().query(
      `INSERT INTO account (employee_id, password_hash) VALUES (?, ?)`,
      [employee_id, passwordHash]
    );

    // 이메일 전송!
    const emailSent = await sendEmployeeEmail(employee_id, rawPassword);

    if (!emailSent) {
      return res.status(500).json({ success: false, message: '계정은 생성되었으나 이메일 전송에 실패했습니다.\n등록된 직원계정 리스트에서 재전송 혹은 수동처리 필요.' });
    }

    return res.status(201).json({ success: true, message: '직원 계정 등록 성공' });

  } 
  catch (err) {
    console.error('직원 등록 중 오류 발생:', err);
    return res.status(500).json({ success: false, message: '서버 오류로 인해 등록 실패' });
  }
};



// 직원 삭제
exports.deleteEmployees = (req, res) => {
  const { ids } = req.body;  // 삭제할 직원들의 ID 배열을 받음
  
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: '삭제할 직원 ID 목록을 제공해주세요.' });
  }

  const query = 'DELETE FROM account WHERE employee_id IN (?)';

  db.query(query, [ids], (err, result) => {
    if (err) {
      console.error('직원 삭제 중 오류 발생:', err);
      return res.status(500).json({ error: '직원 삭제 중 오류 발생' });
    }

    // 삭제된 직원 수를 확인하고, 결과를 클라이언트에 반환
    if (result.affectedRows > 0) {
      res.status(200).json({ message: `${result.affectedRows}명의 직원이 삭제되었습니다.` });
    } else {
      res.status(404).json({ message: '삭제할 직원이 없습니다.' });
    }
  });
};

// 직원 상태 업데이트 (is_active, is_initial_password만 수정)
exports.updateEmployee = async (req, res) => {
  const { id, is_active, is_initial_password } = req.body;

  // 필수 값 체크
  if (typeof is_active !== 'boolean' || typeof is_initial_password !== 'boolean') {
    return res.status(400).json({
      success: false,
      message: 'is_active와 is_initial_password는 true 또는 false여야 합니다.',
    });
  }

  try {
    // 직원 존재 여부 확인
    const [employeeRows] = await db.promise().query(
      'SELECT * FROM account WHERE employee_id = ?',
      [id]
    );

    if (employeeRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '직원 정보를 찾을 수 없습니다.',
      });
    }

    // 직원 상태 업데이트
    await db.promise().query(
      'UPDATE account SET is_active = ?, is_initial_password = ? WHERE employee_id = ?',
      [is_active, is_initial_password, id]
    );

    return res.status(200).json({
      success: true,
      message: '직원 상태가 성공적으로 업데이트되었습니다.',
    });
  } catch (error) {
    console.error('직원 상태 업데이트 오류:', error);
    return res.status(500).json({
      success: false,
      message: '직원 상태 업데이트에 실패했습니다.',
    });
  }
};



exports.resetInitPassword = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ success: false, message: '직원 ID가 필요합니다.' });
  }

  try {
    // 1. 비밀번호 해시 생성
    const generatePassword = () => Math.random().toString(36).slice(-8);
    const rawPassword = generatePassword();

    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(rawPassword, saltRounds);

    // 2. 해당 ID의 계정이 존재하는지 확인
    const [rows] = await db.query(`SELECT * FROM account WHERE id = ?`, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: '해당 ID의 계정을 찾을 수 없습니다.' });
    }

    // 3. password_hash 업데이트
    await db.query(`UPDATE account SET password_hash = ? WHERE id = ?`, [passwordHash, id]);

    // 4. is_initial_password 업데이트
    await db.query(`UPDATE account SET is_initial_password = 1 WHERE id = ?`, [id]);

    // 5. failed_attempts 초기화
    await db.query(`UPDATE account SET failed_attempts = 0 WHERE id = ?`, [id]);

    // 6. is_active 활성화
    await db.query(`UPDATE account SET is_active = 1 WHERE id = ?`, [id]);

    // 7. 이메일로 초기 비밀번호 발송
    const emailSent = await sendEmployeeEmail(id, rawPassword);

    if (!emailSent) {
      return res.status(500).json({ success: false, message: '비밀번호는 초기화되었으나나 이메일 전송에 실패했습니다.\n등록된 직원계정 리스트에서 재전송 혹은 수동처리 필요.' });
    }

    return res.status(201).json({ success: true, message: '비밀번호 초기화 및 이메일 전송 성공' });

  } catch (error) {
    console.error('초기 비밀번호 리셋 실패:', error);
    return res.status(500).json({ success: false, message: '서버 오류로 인해 초기화에 실패했습니다.' });
  }
};


exports.sendEmployeeEmail = async (req, res) => {
  const { employeeId, password } = req.body;

  const success = await sendEmailToEmployee(employeeId, password);

  if (success) {
    res.status(200).json({ success: true, message: "이메일 전송 성공" });
  } else {
    res.status(500).json({ success: false, message: "이메일 전송 실패" });
  }
};

