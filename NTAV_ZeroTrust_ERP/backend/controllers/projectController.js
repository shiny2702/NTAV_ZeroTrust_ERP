const db = require('../config/db');

exports.getProjects = async (req, res) => {
  const query = `
    SELECT 
      p.proj_no, 
      p.proj_name, 
      p.security_level, 
      p.status, 
      DATE_FORMAT(p.start_date, '%Y-%m-%d') AS start_date,
      CONCAT(p.expected_duration_month, 'm') AS expected_duration_month,
      DATE_FORMAT(p.actual_end_date, '%Y-%m-%d') AS actual_end_date,
      p.description,
      p.dms_report_link,
      p.remark,
      DATE_FORMAT(p.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
      DATE_FORMAT(p.updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at,
      
      ld.dept_no AS lead_dept_no, ld.dept_name AS lead_dept_name,
      lt.team_no AS lead_team_no, lt.team_name AS lead_team_name,
      
      cd.dept_no AS collab_dept_no, cd.dept_name AS collab_dept_name,
      ct.team_no AS collab_team_no, ct.team_name AS collab_team_name,
      
      a.app_no, a.app_name,
      e.employee_id, CONCAT(e.last_name, e.first_name) AS employee_name,
      DATE_FORMAT(pae.from_date, '%Y-%m-%d') AS from_date,
      DATE_FORMAT(pae.to_date, '%Y-%m-%d') AS to_date,
      pae.is_manager

    FROM project p
    LEFT JOIN department ld ON p.lead_dept_no = ld.dept_no
    LEFT JOIN team lt ON p.lead_team_no = lt.team_no
    
    LEFT JOIN project_collab_dept_team pc ON p.proj_no = pc.proj_no
    LEFT JOIN department cd ON pc.collab_dept_no = cd.dept_no
    LEFT JOIN team ct ON pc.collab_team_no = ct.team_no

    LEFT JOIN proj_app_emp pa ON p.proj_no = pa.proj_no
    LEFT JOIN application a ON pa.app_no = a.app_no

    LEFT JOIN proj_app_emp pae ON pa.proj_no = pae.proj_no AND pa.app_no = pae.app_no
    LEFT JOIN employee e ON pae.employee_id = e.employee_id

    ORDER BY p.proj_no
  `;

  try {
    const [rows] = await db.query(query);
    const projects = {};

    for (const row of rows) {
      const projNo = row.proj_no;

      if (!projects[projNo]) {
        projects[projNo] = {
          proj_no: projNo,
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
          collabDeptTeam: [],
          projectManager: null
        };
      }

      const project = projects[projNo];

      if (row.collab_dept_no && row.collab_team_no) {
        const exists = project.collabDeptTeam.find(
          t => t.dept_no === row.collab_dept_no && t.team_no === row.collab_team_no
        );
        if (!exists) {
          project.collabDeptTeam.push({
            dept_no: row.collab_dept_no,
            dept_name: row.collab_dept_name,
            team_no: row.collab_team_no,
            team_name: row.collab_team_name,
            applications: []
          });
        }
      }

      const teamArray =
        row.lead_dept_no === row.collab_dept_no &&
        row.lead_team_no === row.collab_team_no
          ? [project.leadDeptTeam]
          : project.collabDeptTeam.filter(
              t => t.dept_no === row.collab_dept_no && t.team_no === row.collab_team_no
            );

      for (const team of teamArray) {
        let app = team.applications.find(a => a.app_no === row.app_no);
        if (!app && row.app_no) {
          app = { app_no: row.app_no, app_name: row.app_name, employees: [] };
          team.applications.push(app);
        }

        if (row.employee_id) {
          const already = app.employees.find(e => e.employee_id === row.employee_id);
          if (!already) {
            app.employees.push({
              employee_id: row.employee_id,
              employee_name: row.employee_name,
              from_date: row.from_date,
              to_date: row.to_date
            });
          }
        }
      }
    }

    for (const project of Object.values(projects)) {
      const managerRows = rows.filter(
        r => r.proj_no === project.proj_no && r.is_manager === 1
      );

      if (managerRows.length > 0) {
        const latestManager = managerRows.reduce((latest, current) =>
          new Date(current.from_date) > new Date(latest.from_date) ? current : latest
        );
        project.projectManager = {
          employee_id: latestManager.employee_id,
          employee_name: latestManager.employee_name
        };
      }
    }

    res.status(200).json(Object.values(projects));
  } catch (err) {
    console.error('Error fetching project details:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

