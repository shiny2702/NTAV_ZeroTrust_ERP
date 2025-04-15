const db = require('../config/db');
const dayjs = require('dayjs');
const { roleInfoRegenerate } = require('./roleController'); // 내부용 함수 추가 필요

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
        pae.proj_emp_no,
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
        const existingEmpIndex = app.employees.findIndex(e => e.employee_id === row.employee_id);

        if (existingEmpIndex === -1) {
          // 아직 등록되지 않은 직원이면 추가
          app.employees.push({
            employee_id: row.employee_id,
            employee_name: row.employee_name,
            from_date: row.from_date,
            to_date: row.to_date
          });
        } else {
          // 이미 등록된 직원이면 조건 비교해서 교체할지 결정
          const existingEmp = app.employees[existingEmpIndex];
          const existingToDate = existingEmp.to_date;
          const newToDate = row.to_date;

          const isExistingNull = !existingToDate;
          const isNewNull = !newToDate;

          const shouldReplace =
            // 새로운 row의 to_date가 null이면 우선 적용
            (isNewNull && !isExistingNull) ||
            // 둘 다 null이 아니면 더 나중 날짜 선택
            (!isNewNull && !isExistingNull && new Date(newToDate) > new Date(existingToDate));

          if (shouldReplace) {
            app.employees[existingEmpIndex] = {
              employee_id: row.employee_id,
              employee_name: row.employee_name,
              from_date: row.from_date,
              to_date: row.to_date
            };
          }
        }
      }


      // 프로젝트 매니저 설정
      if (row.is_manager === 1) {
        if (
          !project.projectManager ||
          new Date(row.from_date) > new Date(project.projectManager.from_date) ||
          (new Date(row.from_date).getTime() === new Date(project.projectManager.from_date).getTime() &&
          row.proj_emp_no > project.projectManager.proj_emp_no)
        ) {
          project.projectManager = {
            employee_id: row.employee_id,
            employee_name: row.employee_name,
            from_date: row.from_date,
            proj_emp_no: row.proj_emp_no
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


exports.updateProjectTitleSection = async (req, res) => {
  const { proj_no, security_level, remark } = req.body;

  console.log('body:', req.body);

  try {
    // 1. 업데이트 실행
    await db.query(
      'UPDATE project SET security_level = ?, remark = ? WHERE proj_no = ?',
      [security_level, remark, proj_no]
    );

    // 2. 업데이트된 데이터 다시 가져오기 (선택적)
    const [updatedProjectRows] = await db.query(
      'SELECT * FROM project WHERE proj_no = ?',
      [proj_no]
    );

    if (updatedProjectRows.length === 0) {
      return res.status(404).json({ message: '프로젝트를 찾을 수 없습니다.' });
    }

    res.status(200).json(updatedProjectRows[0]);
  } catch (error) {
    console.error('프로젝트 업데이트 오류:', error);
    res.status(500).json({ message: '프로젝트 업데이트 실패' });
  }
};


exports.updateProjectManager = async (req, res) => {
    const { proj_no, original_manager_id, new_manager_id } = req.body;
    const today = dayjs().format('YYYY-MM-DD');
    const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD');

    console.log('body:', req.body);

    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        // 1. 기존 담당자 처리
        const [oldRecords] = await conn.query(
            `SELECT * FROM proj_app_emp 
             WHERE proj_no = ? AND employee_id = ? AND to_date IS NULL`,
            [proj_no, original_manager_id]
        );

        for (const rec of oldRecords) {
            await conn.query(
                `UPDATE proj_app_emp SET to_date = ? WHERE proj_emp_no = ?`,
                [today, rec.proj_emp_no]
            );
        }

        for (const rec of oldRecords) {
            await conn.query(
                `INSERT INTO proj_app_emp (proj_no, app_no, employee_id, from_date, to_date, is_manager)
                 VALUES (?, ?, ?, ?, NULL, 0)`,
                [proj_no, rec.app_no, rec.employee_id, tomorrow]
            );
        }

        // 2. 새 담당자 처리
        const [newRecords] = await conn.query(
            `SELECT * FROM proj_app_emp 
             WHERE proj_no = ? AND employee_id = ? AND to_date IS NULL`,
            [proj_no, new_manager_id]
        );

        for (const rec of newRecords) {
            await conn.query(
                `UPDATE proj_app_emp SET to_date = ? WHERE proj_emp_no = ?`,
                [today, rec.proj_emp_no]
            );
        }

        for (const rec of newRecords) {
            await conn.query(
                `INSERT INTO proj_app_emp (proj_no, app_no, employee_id, from_date, to_date, is_manager)
                 VALUES (?, ?, ?, ?, NULL, 1)`,
                [proj_no, rec.app_no, rec.employee_id, tomorrow]
            );
        }

        console.log('oldRecords:', oldRecords);
        console.log('newRecords:', newRecords);

        await conn.commit();
        res.status(200).json({ message: '담당자 변경 완료' });

    } catch (err) {
        await conn.rollback();
        console.error(err);
        res.status(500).send('서버 에러');
    } finally {
        conn.release();
    }
};


exports.deleteEmployeesFromProject = async (req, res) => {
  const { proj_no, removed_employees } = req.body;

  if (!proj_no || !Array.isArray(removed_employees) || removed_employees.length === 0) {
    return res.status(400).json({ message: "Invalid request payload." });
  }

  const now = dayjs().format('YYYY-MM-DD');

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    for (const { app_no, employee_id } of removed_employees) {
      const [result] = await conn.query(
        `UPDATE proj_app_emp 
         SET to_date = ?
         WHERE proj_no = ? AND app_no = ? AND employee_id = ? AND to_date IS NULL`,
        [now, proj_no, app_no, employee_id]
      );

      // 업데이트된 행이 0개인 경우 롤백
      if (result.affectedRows === 0) {
        throw new Error(`No updatable record found for employee_id: ${employee_id}`);
      }
    }

    await conn.commit();

    // 직원 ID 배열 추출
    const employeeIds = removed_employees.map(e => e.employee_id);

    // roleInfo 재생성 함수 내부 호출 (API로 안 부르고)
    const roleResult = await roleInfoRegenerate(employeeIds);

    if (!roleResult.success) {
      return res.status(207).json({
        message: "직원은 삭제되었으나 일부 roleInfo 재생성에 실패했습니다.",
        details: roleResult,
      });
    }

    return res.status(200).json({ message: "Employees removed and roleInfo updated." });
  } 
  catch (error) {
    await conn.rollback();
    console.error("Error during employee removal:", error);
    return res.status(500).json({ message: "Failed to remove employees. All changes reverted." });
  } 
  finally {
    conn.release();
  }
};



