const db = require('../config/db');

exports.getProjects = async (req, res) => {
  const query = `
    SELECT 
      p.proj_no,
      p.proj_name,
      p.lead_dept_no,
      d.dept_name AS lead_dept_name,
      p.lead_team_no,
      t.team_name AS lead_team_name,
      p.security_level,
      p.status,
      DATE_FORMAT(p.start_date, '%Y-%m-%d') AS start_date,
      CONCAT(p.expected_duration_month, 'm') AS expected_duration_month,
      DATE_FORMAT(p.actual_end_date, '%Y-%m-%d') AS actual_end_date,
      p.description,
      p.dms_report_link,
      p.remark,
      DATE_FORMAT(p.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
      DATE_FORMAT(p.updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at
    FROM project p
    JOIN department d ON p.lead_dept_no = d.dept_no
    JOIN team t ON p.lead_team_no = t.team_no
    ORDER BY p.proj_no
  `;

  try {
    const [results] = await db.query(query);
    res.json(results);
  } catch (err) {
    console.error('프로젝트 목록 조회 중 오류 발생:', err);
    res.status(500).json({ error: 'DB 오류' });
  }
};
