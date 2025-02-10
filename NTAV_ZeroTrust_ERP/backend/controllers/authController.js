const db = require('../config/db');
const jwt = require('jsonwebtoken');

// 로그인
exports.login = (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM account WHERE username = ? AND password = ?';
  console.log(username, password);

  db.query(query, [username, password], (err, results) => {
    if (err) return res.status(500).json({ error: 'DB 오류' });

    if (results.length === 0) {
      return res.status(401).json({ message: '잘못된 사용자 이름 또는 비밀번호' });
    }

    const user = results[0];
    console.log('로그인 성공, 사용자 정보:', user);
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // 프론트엔드에서 기대하는 형식으로 데이터 반환
    res.json({ user: { id: user.id, username: user.username, role: user.role, init: user.is_initial_password }, token });
  });
};

// 비밀번호 확인
exports.verifyPassword = (req, res) => {
  const { userId, password } = req.body;

  const query = 'SELECT * FROM account WHERE id = ?';

  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'DB 오류' });

    if (results.length === 0) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    const user = results[0];

    // 비밀번호 비교
    if (user.password === password) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  });
};

// 비밀번호 변경
exports.updatePassword = async (req, res) => {
  const { userId, newPassword } = req.body;

  try {
    // userId로 DB에서 사용자 레코드 조회
    const [result] = await db.promise().query('SELECT * FROM account WHERE id = ?', [userId]);

    if (result.length === 0) {
      return res.status(404).json({ success: false, message: "사용자를 찾을 수 없습니다." });
    }

    // 비밀번호 업데이트 쿼리 실행
    await db.promise().query('UPDATE account SET password = ? WHERE id = ?', [newPassword, userId]);

    return res.status(200).json({ success: true, message: "비밀번호가 성공적으로 변경되었습니다." });
  } catch (err) {
    return res.status(500).json({ success: false, message: "서버 오류가 발생했습니다." });
  }
};

// is_initial_password 값을 false로 업데이트
exports.updateInitialPasswordStatus = async (req, res) => {
  const { userId } = req.body;

  try {
    await db.promise().query("UPDATE account SET is_initial_password = false WHERE id = ?", [userId]);

    res.json({ success: true, message: "초기 비밀번호 상태 업데이트 완료" });

  } catch (error) {
    res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
};





