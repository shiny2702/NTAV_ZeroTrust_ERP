import React, { Component } from "react";
import { verifyPassword, updatePassword, updateInitialPasswordStatus } from "../api";
import "../css/passwordResetPage.css";
import withRouter from "../hocs/withRouter";

class PasswordResetPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      newPassword: "",
      confirmPassword: "",
      message: "",
      error: "",
      newPasswordError: "",
      confirmPasswordError: "",
      isNewPasswordValid: false,
      isPasswordVerified: false,
      modalMessage: "",
      showModal: false,
    };
  }

  userId = JSON.parse(localStorage.getItem("user"))?.id;

  handlePasswordChange = (e) => {
    this.setState({ password: e.target.value });
  };

  handleNewPasswordChange = (e) => {
    const value = e.target.value;
    this.setState({ newPassword: value });

    const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}:;"'<>,.?/\\|-]).{10,}$/;
    if (regex.test(value)) {
      this.setState({
        isNewPasswordValid: true,
        newPasswordError: "비밀번호 변경이 가능합니다.",
      });
    } else {
      this.setState({
        isNewPasswordValid: false,
        newPasswordError: "too weak!!",
      });
    }
  };

  handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    this.setState({ confirmPassword: value });

    if (value === this.state.newPassword) {
      this.setState({ confirmPasswordError: "비밀번호가 일치합니다." });
    } else {
      this.setState({ confirmPasswordError: "비밀번호가 일치하지 않습니다." });
    }
  };

  handleVerify = async () => {
    if (!this.userId) {
      this.setState({ error: "사용자 정보가 없습니다." });
      return;
    }

    try {
      const result = await verifyPassword(this.userId, this.state.password);

      if (result.success) {
        this.setState({ message: "비밀번호가 일치합니다.", error: "", isPasswordVerified: true });
      } else {
        this.setState({ message: "", error: "비밀번호가 일치하지 않습니다." });
      }
    } catch (err) {
      this.setState({ error: "서버와 연결할 수 없습니다." });
    }
  };

  handleNewPasswordClick = () => {
    if (!this.state.isPasswordVerified) {
      this.setState({ modalMessage: "새로운 비밀번호를 설정하려면 기존 비밀번호를 먼저 인증해주세요.", showModal: true });
    }
  };

  handleConfirmPasswordClick = () => {
    const { password, newPassword, isPasswordVerified, isNewPasswordValid } = this.state;

    if (!isPasswordVerified) {
      this.setState({ modalMessage: "새로운 비밀번호를 설정하려면 기존 비밀번호를 먼저 인증해주세요.", showModal: true });
    } else if (!isNewPasswordValid) {
      this.setState({ modalMessage: "새로운 비밀번호는 최소 10자 이상, 알파벳, 숫자 및 특수문자를 포함해야 합니다.", showModal: true });
    } else if (newPassword === password) {
      this.setState({ modalMessage: "기존 비밀번호와 동일한 비밀번호는 사용할 수 없습니다.", showModal: true });
    }
  };

  handlePasswordReset = async () => {
    if (!this.userId) {
      this.setState({ modalMessage: "사용자 정보를 찾을 수 없습니다.", showModal: true });
      return;
    }

    if (this.state.newPassword !== this.state.confirmPassword) {
      this.setState({ modalMessage: "새로운 비밀번호와 확인 비밀번호가 일치하지 않습니다.", showModal: true });
      return;
    }

    try {
      const result = await updatePassword(this.userId, this.state.newPassword);
      if (result.success) {
        // is_initial_password 값을 false로 업데이트
        await updateInitialPasswordStatus(this.userId);

        this.setState({ 
            modalMessage: "비밀번호가 성공적으로 변경되었습니다. 새로운 비밀번호로 재로그인 후 접속해 주세요.", 
            showModal: true 
        });
      } else {
        this.setState({ modalMessage: "비밀번호 변경에 실패했습니다.", showModal: true });
      }
    } catch (err) {
      this.setState({ modalMessage: "서버와 연결할 수 없습니다.", showModal: true });
    }
  };

  handleOkClick = () => {
    const { modalMessage } = this.state;
    const { navigate } = this.props;

    if (modalMessage === "비밀번호가 성공적으로 변경되었습니다. 새로운 비밀번호로 재로그인 후 접속해 주세요.") {
      navigate("/");  // 로그인 페이지로 이동
    } else {
      this.setState({ showModal: false });  // 실패 시 모달 닫기
    }
  };

  render() {
    const {
      password,
      newPassword,
      confirmPassword,
      message,
      error,
      newPasswordError,
      confirmPasswordError,
      isPasswordVerified,
      isNewPasswordValid,
      showModal,
      modalMessage,
    } = this.state;

    return (
      <div className={`password-reset-page ${showModal ? "modal-active" : ""}`}>
        <h1>NTAV</h1>
        <h2>비밀번호 변경 페이지</h2>
        <div className="dashed-line-container">
          <div className="dashed-line"></div>
        </div>

        <div className="password-reset-container">
          <h3>비밀번호 확인</h3>
          <input
            type="password"
            value={password}
            onChange={this.handlePasswordChange}
            placeholder="비밀번호를 입력하세요"
            disabled={isPasswordVerified}
            style={{
              backgroundColor: isPasswordVerified ? "#d3d3d3" : "white",
              cursor: isPasswordVerified ? "not-allowed" : "text",
            }}
          />
          <button
            onClick={this.handleVerify}
            disabled={isPasswordVerified}
            style={{
              backgroundColor: isPasswordVerified ? "green" : "#007bff",
              color: "white",
              cursor: isPasswordVerified ? "default" : "pointer",
            }}
          >
            {isPasswordVerified ? "Verified" : "Verify"}
          </button>
          {message && <div style={{ color: "green" }}>{message}</div>}
          {error && <div style={{ color: "red" }}>{error}</div>}

          <h3>새로운 비밀번호 설정</h3>
          <input
            type="password"
            value={newPassword}
            onChange={this.handleNewPasswordChange}
            placeholder="새로운 비밀번호를 입력하세요"
            onClick={this.handleNewPasswordClick}
          />
          <small style={{ fontSize: "12px", color: "gray" }}>
            ※ 비밀번호 조건 :: 최소 10자 이상, 알파벳, 숫자 및 특수문자 포함
          </small>
          {newPasswordError && (
            <div style={{ color: isNewPasswordValid ? "green" : "red" }}>
              {newPasswordError}
            </div>
          )}

          <h3>새로운 비밀번호 재입력</h3>
          <input
            type="password"
            value={confirmPassword}
            onChange={this.handleConfirmPasswordChange}
            placeholder="새로운 비밀번호를 재입력하세요"
            onClick={this.handleConfirmPasswordClick}
          />
          {confirmPasswordError && (
            <div style={{ color: confirmPasswordError === "비밀번호가 일치합니다." ? "green" : "red" }}>
              {confirmPasswordError}
            </div>
          )}
        </div>

        {/* 비밀번호 변경 버튼 */}
        <button
          onClick={this.handlePasswordReset}
          disabled={!isPasswordVerified || !isNewPasswordValid || confirmPasswordError !== "비밀번호가 일치합니다."}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: isPasswordVerified && isNewPasswordValid && confirmPasswordError === "비밀번호가 일치합니다."
              ? "#007bff"
              : "#d3d3d3",
            color: "white",
            border: "none",
            cursor: isPasswordVerified && isNewPasswordValid && confirmPasswordError === "비밀번호가 일치합니다."
              ? "pointer"
              : "not-allowed",
            fontSize: "16px",
            borderRadius: "5px",
          }}
        >
          비밀번호 변경
        </button>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>알림</h3>
              <p>{modalMessage}</p>
              <button onClick={this.handleOkClick}>OK</button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(PasswordResetPage);
















