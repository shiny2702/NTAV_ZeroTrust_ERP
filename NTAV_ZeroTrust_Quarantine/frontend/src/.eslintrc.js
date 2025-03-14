module.exports = {
    "env": {
      "browser": true,
      "es2021": true
    },
    "extends": [
      "react-app",
      "eslint:recommended",
      "plugin:react/recommended"
    ],
    "parserOptions": {
      "ecmaVersion": "latest",
      "sourceType": "module"
    },
    "plugins": [
      "react"
    ],
    "rules": {
      "react/react-in-jsx-scope": "off",
      "react/jsx-no-undef": "off", // jsx-no-undef 규칙을 꺼서 오류가 발생하지 않도록 설정
      "no-undef": "off" // 변수 정의 오류도 꺼주기
    },
    "settings": {
      "react": {
        "version": "detect" // React 버전 자동 감지
      }
    }
  };
  