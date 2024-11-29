import React, { Component } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import withRouter from './hocs/withRouter'; 
import axios from 'axios';
import './App.css';

class App extends Component {
  // 로그인 성공 처리
  handleLoginSuccess = (response) => {
    console.log('로그인 성공:', response);
    const token = response.credential;  // Google OAuth 토큰

    // 일단 백엔드와의 요청을 주석처리하고, 직접 user 객체를 만들어 전달
    const user = { name: 'NTAV',
                   email: "ntav1234@gmail.com",
                   role: "user",
                   dept: "CyberSecurity",
                   projects: ["project1", "project2", "project3", "project4"]
     }; 
    
    // 페이지 리디렉션 및 사용자 데이터 전달
    this.props.navigate('/main', { state: { user: user } });
  };
  

// handleLoginSuccess = (response) => {
//   console.log('로그인 성공:', response);
//   const token = response.credential;  // Google OAuth 토큰

//    // 백엔드로 토큰 전송 (HTTPS)
//    axios.post('https://localhost:5000', { token })
//    .then((res) => {
//      // 백엔드에서 사용자 데이터와 권한 정보 받아오기
//      const user = res.data.user;
//      console.log('서버 응답:', res.data);
     
//      // 사용자 권한에 맞는 페이지로  
//      // (db 응답 데이터와 함께 ; 얼마나 어떤 형식으로 보낼건지 서버측에서 범위 지정 가능)
//      if (user.role === 'admin') {
//        this.props.navigate('/admin', { state: { user: user } });
//      } else if (user.role === 'user') {
//        this.props.navigate('/main', { state: { user: user } });
//      } else { // 권한이 없는 사용자 (user: null로 반환되도록 함,, --> 서버측에서 명시적 처리 필요)는 /noPermPage로 리디렉션
//        this.props.navigate('/noPermPage');
//      }
//    })
//    // 구글 인증은 되었지만 토큰 인증과정에서 문제가 있는 상태
//    .catch((error) => {
//      console.error('서버 요청 실패:', error);
//      alert('로그인에 실패했습니다. 다시 시도해주세요.');
//    });
// };

  // 로그인 실패 처리 (아예 구글 인증조차 되지 않은 상태)
  handleLoginFailure = (error) => {
    console.log('구글 로그인 실패:', error);
    alert('로그인에 실패했습니다. 다시 시도해주세요.');

    this.props.navigate('/');
  };

  render() {
    return (
      <div className="app">
        <div className="login-container">
          <div className="logo">NTAV</div>
          <div className="login-form">
            <h2>LOGIN</h2>
            <input type="text" placeholder="ID" />
            <input type="password" placeholder="password" />
            <div className="line" />
            <button className="login-button">Login</button>
            <button className="signup-button">Sign-up</button>
            <div className="google-login">
              <GoogleLogin
                onSuccess={this.handleLoginSuccess}
                onError={this.handleLoginFailure}
                useOneTap
                clientId="105774342869-f21hqi363lkuo4m7ec9cc6fisgc1vpfu.apps.googleusercontent.com" // 구글에서 발급받은 클라이언트 ID
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// withRouter를 사용하여 navigate prop을 전달
export default withRouter(App);

