const db = require('../config/db');

const roleGeneratingLogic = async (employeeIds) => {
  if (!employeeIds || !Array.isArray(employeeIds) || employeeIds.length === 0) return;
  
  const failedIds = [];

  const getTablesByApps = async (apps) => {
    if (!Array.isArray(apps) || apps.length === 0) return [];

    const placeholders = apps.map(() => '?').join(', ');
    const [rows] = await db.query(
        `SELECT DISTINCT table_no FROM app_table_mapping WHERE app_no IN (${placeholders})`, apps
    );
    return rows.map(row => row.table_no);
  };

  for (const empId of employeeIds) {
    try {
        // Step 1. 직접 맡은 주요업무 (main_apps)
        const [empJobsRows] = await db.query(
            `SELECT DISTINCT app_no FROM emp_app_mapping WHERE employee_id = ?`, [empId]
        );
        const mainApps = empJobsRows.map(row => row.app_no); 

        // Step 2. 참여한 프로젝트
        const [projectRows] = await db.query(
            `SELECT DISTINCT proj_no FROM proj_app_emp WHERE employee_id = ? and to_date IS NULL`, [empId]
        );
        const projectIds = projectRows.map(row => row.proj_no); 

        // Step 3. 프로젝트들의 할당 apps 목록
        let projectJobs = [];
        if (projectIds.length > 0) {
          const placeholders = projectIds.map(() => '?').join(', ');
          const [projAppRows] = await db.query(
            `SELECT DISTINCT app_no FROM proj_app_mapping WHERE proj_no IN (${placeholders})`, projectIds
        );
        projectJobs = projAppRows.map(row => row.app_no);
        }

        // Step 4. mainApps ∪ projectJobs
        const allRelatedApps = [...new Set([...mainApps, ...projectJobs])];

        // Step 5. 읽기 권한 앱들 추출
        let readableFromMapping = [];
        if (allRelatedApps.length > 0) {
            const placeholders = allRelatedApps.map(() => '?').join(', ');
            const [readMapRows] = await db.query(
              `SELECT DISTINCT readable_app_no FROM readable_app_mapping WHERE main_app_no IN (${placeholders})`, allRelatedApps
            );
            readableFromMapping = readMapRows.map(row => row.readable_app_no);
        }

        // Step 6. 읽기 가능한 앱 = mainApps ∪ projectJobs ∪ readableFromMapping
        const readableApps = [...new Set([...allRelatedApps, ...readableFromMapping])];

        // Step 7. read only apps = readableApps - mainApps
        const readOnlyApps = readableApps.filter(app => !mainApps.includes(app));


        // Step 8. app → table 매핑
        const rwTables = await getTablesByApps(mainApps);
        const readableTables = await getTablesByApps(readOnlyApps);

        const rTables = readableTables.filter(table => !rwTables.includes(table));


        // Step 9. roleInfo 결과 구조
        const permission_pages = {
            main_apps: mainApps,
            readable_apps: readOnlyApps
        };

        const permission_tables = {
            RW_tables: rwTables,
            R_tables: rTables
        };

        // roleInfo 객체 전체를 JSON으로 직렬화
        const roleInfo = {
            permission_pages,
            permission_tables
        };
    
        // Step 10. job, roleInfo 컬럼에 업데이트
        await db.query(`
            UPDATE employee
            SET job = ?, roleInfo = ?
            WHERE employee_id = ?
        `, [JSON.stringify(mainApps), JSON.stringify(roleInfo), empId]);
      } 
      catch (err) {
        console.error(`직원 ${empId} 처리 실패:`, err);
        failedIds.push(empId);
        continue;
      }
  }
  return failedIds;
};

// 공통 메시지 처리 함수
const generateResultResponse = (allIds, failedIds) => {
    if (failedIds.length === 0) {
      return {
        success: true,
        message: `전체 직원 role정보 최신 업데이트 및 동기화 완료.`,
      };
    } else if (failedIds.length === allIds.length) {
      return {
        success: false,
        message: `전 직원 roleInfo 업데이트 실패. 재시도 필요.`
      };
    } else {
      return {
        success: false,
        message: `일부 직원 roleInfo 업데이트 실패. 실패한 직원 IDs: [${failedIds.join(', ')}]).`,
        failed_employee_ids: failedIds
      };
    }
  };


// 전체 직원 roleInfo 재생성
exports.roleInfoWholeRegenerate = async (req, res) => {
    try {
      // 1. 활성화된 직원들의 ID 조회
      const [rows] = await db.execute(
        "SELECT employee_id FROM employee WHERE is_active = 1"
      );
  
      const employeeIdList = rows.map(row => row.employee_id);
  
      if (employeeIdList.length === 0) {
        return res.status(200).json({
          success: true,
          message: "활성화된 직원이 없습니다.",
        });
      }
  
      // 2. roleInfo 재계산 및 업데이트
      const failedIds = await roleGeneratingLogic(employeeIdList);
      const result = generateResultResponse(employeeIdList, failedIds);
      return res.status(result.success ? 200 : 207).json(result);

    } 
    catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "ERROR :: 전체 직원 role정보 최신 업데이트 및 동기화 실패. 재시도 필요",
      });
    }
  };


exports.roleInfoRegenerate = async (req, res) => {
    const { ids } = req.body;

    // 1. 유효성 검사
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
        success: false,
        message: 'roleInfo 재생성을 위한 직원 ID 목록이 유효하지 않습니다.',
        });
    }

    try {
        // is_active = 1인 직원만 필터링
        const placeholders = ids.map(() => '?').join(', ');
        const [activeEmployees] = await db.query(
            `SELECT employee_id FROM employee WHERE is_active = 1 AND id IN (${placeholders})`,
            ids
        );

      const activeIds = activeEmployees
        .filter(e => e && typeof e.id === 'number')
        .map(e => e.id);

      // 유효성 검사 추가
      if (!activeIds || !Array.isArray(activeIds) || activeIds.length === 0) {
          return res.status(400).json({
          success: false,
          message: '유효한 활성 직원이 존재하지 않습니다.',
          });
      }

      // roleInfo 재계산 및 업데이트
      const failedIds = await roleGeneratingLogic(activeIds);
      const result = generateResultResponse(activeIds, failedIds);
      return res.status(result.success ? 200 : 207).json(result);

    } 
    catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "ERROR :: 전체 직원 role정보 최신 업데이트 및 동기화 실패. 재시도 필요",
      });
    }
};






