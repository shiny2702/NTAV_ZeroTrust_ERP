import React, { Component } from 'react';
import withRouter from './hocs/withRouter';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      password: '',
      error: null,
    };
  }

  // ID와 Password 입력값을 상태에 저장
  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  // 로그인 버튼 클릭 시 실행
  handleLogin = () => {
    const { id, password } = this.state;

    if (!id || !password) {
      alert('ID와 비밀번호를 입력하세요.');
      return;
    }

    // 서버로 로그인 요청
    axios
      .post('https://192.168.100.51', { id, password })
      .then((response) => {
        const { user } = response.data; // 서버에서 반환된 사용자 데이터
        console.log('로그인 성공:', user);

        // 사용자 권한에 따라 페이지 리디렉션
        if (user.role === 'admin') {
          this.props.navigate('/admin', { state: { user } });
        } else if (user.role === 'employee') {
          this.props.navigate('/main', { state: { user } });
        } else {
          alert('권한이 없습니다.');
          this.props.navigate('/noPermPage');
        }
      })
      .catch((error) => {
        console.error('로그인 실패:', error);
        this.setState({ error: '로그인에 실패했습니다. 다시 시도해주세요.' });
      });
  };

  render() {
    const { error } = this.state;

    return (
      <div className="app">
        <div className="login-container">
          <div className="logo">NTAV</div>
          <div className="login-form">
            <h2>LOGIN</h2>
            <input
              type="text"
              name="id"
              placeholder="ID"
              onChange={this.handleInputChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={this.handleInputChange}
            />
            {error && <p className="error-message">{error}</p>}
            <div className="line" />
            <button className="login-button" onClick={this.handleLogin}>
              Login
            </button>
            <button className="signup-button">Sign-up</button>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(App);

  //   // 일단 백엔드와의 요청을 주석처리하고, 직접 user 객체를 만들어 전달
  //   const user = { name: 'NTAV_4',
  //                  email: "ntav4@gmail.com",
  //                  role: "employee",
  //                  dept: "Finance & Accounting",
  //                  projects: ["project_A", "project_B", "project_C", "project_D", "project_E", "project_F"]
  //    }; 
    
  //   // 페이지 리디렉션 및 사용자 데이터 전달
  //   this.props.navigate('/main', { state: { user: user } });
  // };
