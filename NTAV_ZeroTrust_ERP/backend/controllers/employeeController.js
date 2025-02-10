const db = require('../config/db');
const nodemailer = require("nodemailer");

exports.getEmployees = (req, res) => {
  const query = 'SELECT id, username, role FROM account';

  db.query(query, (err, results) => {
    if (err) {
      console.error('직원 목록 조회 중 오류 발생:', err);
      return res.status(500).json({ error: 'DB 오류' });
    }
    res.json(results);
  });
  };

// 직원 등록
exports.registerEmployee = (req, res) => {
  console.log('요청 받은 데이터:', req.body);
  const { id, name, password } = req.body; // id, name, password를 받아옴

  if (!id || !name || !password) {
    return res.status(400).json({ error: '사번, 이름, 비밀번호를 모두 입력해주세요.' });
  }

  const query = 'INSERT INTO account (id, username, password, role) VALUES (?, ?, ?, ?)';
  const role = 'user'; // 기본 역할을 "employee"로 설정

  db.query(query, [id, name, password, role], (err, result) => {
    if (err) {
      console.error('직원 등록 중 오류 발생:', err);
      return res.status(500).json({ error: '직원 등록 중 오류 발생' });
    }
    res.status(201).json({ message: '직원 등록 성공', employeeId: result.insertId });
  });
};

// 직원 삭제
exports.deleteEmployees = (req, res) => {
  const { ids } = req.body;  // 삭제할 직원들의 ID 배열을 받음
  
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: '삭제할 직원 ID 목록을 제공해주세요.' });
  }

  const query = 'DELETE FROM account WHERE id IN (?)';

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

// 직원 정보 업데이트
exports.updateEmployee = async (req, res) => {
  const { id } = req.params;  // URL 파라미터에서 id 가져오기
  const { username, role } = req.body;  // 요청 본문에서 username, role 가져오기

  // 필수 값 체크
  if (!username || !role) {
    return res.status(400).json({ error: '이름과 역할을 입력해주세요.' });
  }

  try {
    // 직원 정보 찾기
    const [employeeRows] = await db.promise().query('SELECT * FROM account WHERE id = ?', [id]);
    
    if (employeeRows.length === 0) {
      return res.status(404).json({ error: '직원 정보를 찾을 수 없습니다.' });
    }

    // 직원 정보 업데이트
    await db.promise().query(
      'UPDATE account SET username = ?, role = ? WHERE id = ?',
      [username, role, id]
    );

    return res.status(200).json({ message: '직원 정보가 성공적으로 업데이트되었습니다.' });
  } catch (error) {
    console.error('직원 정보 업데이트 오류:', error);
    return res.status(500).json({ error: '직원 정보 업데이트에 실패했습니다.' });
  }
};

exports.sendEmployeeEmail = async (req, res) => {
  const { employeeId, password } = req.body;

  try {
    // 직원의 이메일 가져오기
    const [rows] = await db.promise().query("SELECT email FROM employee WHERE id = ?", [employeeId]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "직원을 찾을 수 없습니다." });
    }

    const employeeEmail = rows[0].email;

    // 이메일 전송 설정
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "april4326@gmail.com", // 실제 Gmail 계정
        pass: "biwr zwzy dfzc kmfh", // 앱 비밀번호 또는 OAuth 사용
      },
    });

    const mailOptions = {
      from: "april4326@gmail.com",
      to: employeeEmail,
      subject: "초기 비밀번호 안내",
      text: `안녕하세요,\n\n귀하의 초기 비밀번호는 다음과 같습니다: ${password}\n\n로그인 후 비밀번호를 변경해 주세요.`,
    };

    // 이메일 전송 실행
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "이메일 전송 성공" });
  } catch (error) {
    console.error("이메일 전송 오류:", error);
    res.status(500).json({ success: false, message: "이메일 전송 실패" });
  }
};
