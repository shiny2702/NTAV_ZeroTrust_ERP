const jwt = require("jsonwebtoken");

const SECRET_KEY = "your_secret_key"; // 환경 변수 사용 권장

// 팀별 기능별 권한 정의
const role_name = {
    "영업전략팀": {
        "팀장": {
            "고객데이터분석": "editor",
            "판매예측": "editor",
            "전략기획": "editor"
        },
        "팀원": {
            "고객데이터분석": "writer",
            "판매예측": "writer"
        }
    },
    "직영점운영팀": {
        "팀장": {
            "지점운영관리": "editor",
            "직원스케줄관리": "editor",
            "재고점검": "editor"
        },
        "팀원": {
            "지점운영관리": "writer",
            "재고점검": "reader"
        }
    },
    "재무팀": {
        "팀장": {
            "현금흐름분석": "editor",
            "투자전략": "editor",
            "예산기획": "editor"
        },
        "팀원": {
            "현금흐름분석": "writer",
            "예산기획": "writer"
        }
    },
    "회계팀": {
        "팀장": {
            "재무보고검토": "editor",
            "세무관리": "editor",
            "재무감사": "editor"
        },
        "팀원": {
            "재무보고작성": "writer",
            "세금신고": "writer"
        }
    },
    "IT보안팀": {
        "팀장": "admin"
    }
};

/**
 * 사용자 정보를 검증하고 역할을 할당
 */
function verifyUser(userInfo) {
    const { emp_id, name, age, gender, contact, department, team, is_leader, project } = userInfo;
    
    if (!role_name[team]) {
        throw new Error("유효하지 않은 팀입니다.");
    }
    
    const roleType = is_leader ? "팀장" : "팀원";
    if (!role_name[team][roleType]) {
        throw new Error("유효하지 않은 역할입니다.");
    }
    
    const userRole = {
        emp_id,
        name,
        department,
        team,
        role: roleType,
        features: role_name[team][roleType] // 기능별 권한 포함
    };

    // 사용자 토큰 발행
    const userToken = jwt.sign(userRole, SECRET_KEY, { expiresIn: "7d" });

    return userToken;
}

module.exports = { verifyUser };
