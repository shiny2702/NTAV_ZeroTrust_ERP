const db = require('../config/db');
const sensitiveTables = require('../config/sensitiveDbs.json');

async function writeCheckWithMfa(req, res, next) {
    const isWrite = ['POST', 'PUT', 'DELETE'].includes(req.method);
    console.log(`[writeCheckWithMfa] 요청 메서드: ${req.method} / isWrite: ${isWrite}`);

    if (!isWrite) return next();

    const rawTables = req.body?.table;
    console.log(`[writeCheckWithMfa] 클라이언트 요청 테이블:`, rawTables);

    if (!rawTables || (Array.isArray(rawTables) && rawTables.length === 0)) {
        return next();
    }

    const tableNames = Array.isArray(rawTables) ? rawTables : [rawTables];

    try {
        // DB에서 테이블 번호 조회
        const placeholders = tableNames.map(() => '?').join(', ');
        const [rows] = await db.query(
            `SELECT table_name, table_no FROM tables WHERE table_name IN (${placeholders})`,
            tableNames
        );
        console.log(`[writeCheckWithMfa] DB 조회 결과:`, rows);

        // 조회 결과를 매핑: { employee: 1, dept_emp: 2, ... }
        const tableMap = {};
        rows.forEach(row => {
            tableMap[row.table_name] = row.table_no;
        });
        console.log(`[writeCheckWithMfa] 테이블 매핑 결과:`, tableMap);

        // 매핑 실패한 테이블명이 있을 경우 예외 처리
        const notFound = tableNames.filter(name => !(name in tableMap));
        if (notFound.length > 0) {
            console.warn(`[writeCheckWithMfa] 존재하지 않는 테이블명 감지:`, notFound);
            return res.status(400).json({
                message: `존재하지 않는 테이블명: ${notFound.join(', ')}`,
            });
        }

        const tableNumbers = tableNames.map(name => tableMap[name]);
        console.log(`[writeCheckWithMfa] 확인된 테이블 번호 목록:`, tableNumbers);

        const user = req.user;
        if (!user || !user.role || !user.role.permission_tables || !Array.isArray(user.role.permission_tables.RW_tables)) {
            return res.status(401).json({ message: '사용자 인증 정보 누락 또는 권한 정보 오류' });
        }

        console.log(`[writeCheckWithMfa] 사용자 쓰기 권한 테이블 번호:`, user.role.permission_tables.RW_tables);

        // 권한 확인
        const hasAllPermissions = tableNumbers.every(num => user.role.permission_tables.RW_tables.includes(num));
        if (!hasAllPermissions) {
            console.warn(`[writeCheckWithMfa] 쓰기 권한 부족. 요청 테이블: ${tableNumbers}, 사용자 권한: ${user.role.permission_tables.RW_tables}`);
            return res.status(403).json({ message: `일부 테이블에 대한 쓰기 권한이 없습니다.` });
        }

        // 민감한 테이블 확인 (table_no 기반)
        const isSensitive = tableNumbers.some(no => sensitiveTables.includes(no));
        if (isSensitive && req.user.mfa_verified !== true) {
            return res.status(403).json({
                error: 'MFA_REQUIRED',
                message: '민감한 DB 접근입니다. Google MFA 인증이 필요합니다.',
            });
        }

        // table을 tableNumbers로 교체하여 downstream에서 number 기반으로 활용 가능하게 함
        req.body.table = tableNumbers;

        next();
    } catch (err) {
        console.error('writeCheckWithMfa DB 오류:', err);
        return res.status(500).json({ message: '내부 서버 오류로 테이블 권한 확인에 실패했습니다.' });
    }
}

module.exports = writeCheckWithMfa;

