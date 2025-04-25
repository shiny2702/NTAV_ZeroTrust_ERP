import React, { Component } from 'react';
import { login } from '../api'; // 로그인 API 호출 함수
import '../css/loginPage.css'; // 스타일링 파일
import withRouter from '../hocs/withRouter'; // withRouter HOC 가져오기

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: null,
      showPasswordResetModal: false, // 초기 비밀번호 변경 모달 상태
    };
  }

  // 페이지 로드 후 바로 새로 고침
  componentDidMount() {
    const hasReloaded = sessionStorage.getItem("hasReloaded");

    if (!hasReloaded || hasReloaded !== "true") { // && window.navigation?.type !== 'reload'
      sessionStorage.setItem("hasReloaded", "true");
      window.location.reload();
    }
  }

  // 입력값 변경 처리
  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  // 로그인 버튼 클릭 처리
  handleLogin = async () => {
    const { username, password } = this.state;

    // 필수 입력값 체크
    if (!username || !password) {
      this.setState({ error: 'Username and password are required!' });
      return;
    }

    try {
      // 로그인 API 호출
      const data = await login(username, password);
      console.log('Login success:', data);

      // 로그인 응답에서 user와 token 추출
      const { user, token } = data;

      // 로그인 성공 시 localStorage에 저장
      if (user && token) {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);

        sessionStorage.setItem("hasReloaded", "false");  // url접근 차단을 위한 code
        sessionStorage.setItem("fromApp", "true");
      } else {
        console.error('로그인 정보가 잘못되었습니다.');
      }

      // 초기 비밀번호 여부 확인
      if (user.is_initial_password) {
        this.setState({ showPasswordResetModal: true });
        return;
      }

      // 역할에 따라 페이지 이동
      const { department, team } = user;

      if (department?.dept_no === 8) {
        this.props.navigate('/csuite');
      } else if (department?.dept_no === 7 && department?.is_manager === 1) {
        this.props.navigate('/itDeptHead');
      } else if (team?.team_no === 12) {
        this.props.navigate('/itSecurity');
      } else if (team?.team_no === 13) {
        this.props.navigate('/erpManagement');
      } else if (department?.is_manager === 1) {
        this.props.navigate('/deptHead');
      } else {
        this.props.navigate('/main');
      }
      
    } catch (error) {
      console.error('Login failed:', error);
      this.setState({ error: error.response?.data?.message || 'Login failed' });
    }
  };

  // 모달 닫기 및 비밀번호 변경 페이지로 이동
  handleCloseModal = () => {
    this.setState({ showPasswordResetModal: false }, () => {
      this.props.navigate('/passwordReset');
    });
  };

  render() {
    const { username, password, error, showPasswordResetModal } = this.state;

    return (
      <div className="app">
        <div className="login-container">
          <div className="logo">NTAV</div>
          <div className="login-form">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={username}
              onChange={this.handleInputChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={this.handleInputChange}
            />
            <div className="line" />
            <button className="login-button" onClick={this.handleLogin}>
              Login
            </button>
            {error && <p className="error-message">{error}</p>}
          </div>
        </div>

        {/* 초기 비밀번호 변경 모달 */}
        {showPasswordResetModal && (
          <div className="modal">
            <div className="modal-content">
              <p>초기 비밀번호로 로그인하셨습니다. 비밀번호를 변경해야 합니다.</p>
              <button className="modal-button" onClick={this.handleCloseModal}>
                확인
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

// withRouter를 통해 navigate와 location 주입
export default withRouter(LoginPage);



