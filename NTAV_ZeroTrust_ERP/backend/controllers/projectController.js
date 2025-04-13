const db = require('../config/db');

exports.getProjects = async (req, res) => {
  try {
    // 1. 프로젝트 기본 정보 가져오기
    const [projectRows] = await db.query(`
      SELECT 
        p.*, 
        DATE_FORMAT(p.start_date, '%Y-%m-%d') AS start_date,
        DATE_FORMAT(p.actual_end_date, '%Y-%m-%d') AS actual_end_date,
        DATE_FORMAT(p.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
        DATE_FORMAT(p.updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at,
        CONCAT(p.expected_duration_month, 'm') AS expected_duration_month,
        ld.dept_name AS lead_dept_name,
        lt.team_name AS lead_team_name
      FROM project p
      LEFT JOIN department ld ON p.lead_dept_no = ld.dept_no
      LEFT JOIN team lt ON p.lead_team_no = lt.team_no
    `);

    const projects = {};

    for (const row of projectRows) {
      projects[row.proj_no] = {
        proj_no: row.proj_no,
        proj_name: row.proj_name,
        security_level: row.security_level,
        status: row.status,
        start_date: row.start_date,
        expected_duration_month: row.expected_duration_month,
        actual_end_date: row.actual_end_date,
        description: row.description,
        dms_report_link: row.dms_report_link,
        remark: row.remark,
        created_at: row.created_at,
        updated_at: row.updated_at,
        leadDeptTeam: {
          dept_no: row.lead_dept_no,
          dept_name: row.lead_dept_name,
          team_no: row.lead_team_no,
          team_name: row.lead_team_name,
          applications: []
        },
        collabDeptTeam: [], // 여기에 협력 부서/팀들이 추가됨
        projectManager: null
      };
    }

    // 2. 협력 부서/팀 가져오기
    const [collabRows] = await db.query(`
      SELECT pc.proj_no, d.dept_no, d.dept_name, t.team_no, t.team_name
      FROM project_collab_dept_team pc
      JOIN department d ON pc.collab_dept_no = d.dept_no
      JOIN team t ON pc.collab_team_no = t.team_no
    `);

    for (const row of collabRows) {
      const project = projects[row.proj_no];
      if (!project) continue;

      project.collabDeptTeam.push({
        dept_no: row.dept_no,
        dept_name: row.dept_name,
        team_no: row.team_no,
        team_name: row.team_name,
        applications: []
      });
    }

    // 3. app, employee 정보 가져오기
    const [appEmpRows] = await db.query(`
      SELECT 
        pae.proj_no,
        a.app_no, a.app_name, a.related_dept_no AS app_dept_no, a.related_team_no AS app_team_no,
        e.employee_id, CONCAT(e.last_name, e.first_name) AS employee_name,
        DATE_FORMAT(pae.from_date, '%Y-%m-%d') AS from_date,
        DATE_FORMAT(pae.to_date, '%Y-%m-%d') AS to_date,
        pae.is_manager
      FROM proj_app_emp pae
      JOIN application a ON pae.app_no = a.app_no
      LEFT JOIN employee e ON pae.employee_id = e.employee_id
    `);

    for (const row of appEmpRows) {
      const project = projects[row.proj_no];
      if (!project) continue;

      // app 소속이 lead인지 collab인지 판단
      let targetTeam = null;

      const isLead =
        row.app_dept_no === project.leadDeptTeam.dept_no &&
        row.app_team_no === project.leadDeptTeam.team_no;

      if (isLead) {
        targetTeam = project.leadDeptTeam;
      } else {
        // 협력팀 중 찾기
        targetTeam = project.collabDeptTeam.find(
          t => t.dept_no === row.app_dept_no && t.team_no === row.app_team_no
        );
      }

      if (!targetTeam) continue; // 어떤 팀에도 속하지 않으면 skip

      // application 넣기
      let app = targetTeam.applications.find(a => a.app_no === row.app_no);
      if (!app) {
        app = { app_no: row.app_no, app_name: row.app_name, employees: [] };
        targetTeam.applications.push(app);
      }

      // 직원 넣기
      if (row.employee_id) {
        const exists = app.employees.find(e => e.employee_id === row.employee_id);
        if (!exists) {
          app.employees.push({
            employee_id: row.employee_id,
            employee_name: row.employee_name,
            from_date: row.from_date,
            to_date: row.to_date
          });
        }
      }

      // 프로젝트 매니저 설정
      if (row.is_manager === 1) {
        if (
          !project.projectManager ||
          new Date(row.from_date) > new Date(project.projectManager.from_date)
        ) {
          project.projectManager = {
            employee_id: row.employee_id,
            employee_name: row.employee_name
          };
        }
      }
    }

    res.status(200).json(Object.values(projects));
  } catch (err) {
    console.error('Error fetching project details:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
