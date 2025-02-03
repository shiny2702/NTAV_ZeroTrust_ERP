const { verifyDevice } = require("./deviceVerifier");
const { verifyUser } = require("./userVerifier");

//디바이스 토큰 - 유저 토큰 체이닝닝
function generateRole(deviceInfo, userInfo) {
    try {
        //디바이스 검증, 디바이스 토큰 발급
        const deviceToken = verifyDevice(deviceInfo);

        //유저 검증, 유저 토큰 발급
        const { userToken, role_id, role_name } = verifyUser(userInfo);

        //체이닝한 최종 결과 반환
        return {
            role_id,
            role_name,
            tokens: {
                deviceToken,
                userToken,
            },
        };
    } catch (error) {
        return { error: error.message };
    }
}

module.exports = { generateRole };
