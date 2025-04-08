import React, { Component } from "react";
import { Outlet } from "react-router-dom";
import withRouter from "../hocs/withRouter"; 
import { roleInfoWholeRegenerate } from "../api"; 
import '../css/csuitePage.css';  
import WholeHeaderBar from "./partialComponents/wholeHeaderBar";
import ProfileCard from "./partialComponents/profileCard";

// 경영진 페이지
class CSuitePage extends Component {
  state = {
    approvedProjects: [
    ],
    unapprovedProjects: [
    ],
    showModal: false,
    isLoading: false
  };
  
  handleLogoClick = () => {
    this.props.navigate('/csuite');
  };


  handleOpenModal = () => {
    this.setState({ showModal: true });
  };

  handleCloseModal = () => {
    this.setState({ showModal: false });
  };

  handleConfirmRegenerate = async () => {
    this.setState({ showModal: false, isLoading: true });
    await this.handleRoleInfoRegenerate();  // 처리 위임
  };
  
  handleRoleInfoRegenerate = async () => {
    try {
      const response = await roleInfoWholeRegenerate();  // api.js 함수
  
      this.setState({ isLoading: false });
  
      if (response.success) {
        alert(response.message || "전체 직원 role정보 최신 업데이트 및 동기화 완료");
      } else {
        alert(response.message || "ERROR :: 전체 직원 role정보 최신 업데이트 및 동기화 실패. 재시도 필요");
      }
    } 
    catch (error) {
      console.error(error);
      this.setState({ isLoading: false });
      alert("ERROR :: 전체 직원 role정보 최신 업데이트 및 동기화 실패. 재시도 필요");
    }
  };
  

  render() {
    const { approvedProjects, unapprovedProjects, showModal, isLoading } = this.state;

    return (
      <div className="csuitePage">
        <WholeHeaderBar handleLogoClick={this.handleLogoClick} />

        <div className="csuiteContent">
          <ProfileCard/>

          <div className="syncButtonContainer">
            <button className="syncButton" onClick={this.handleOpenModal}>
              role정보 전체동기화
            </button>
          </div>

          <div className="contentArea">
            <Outlet context={{ approvedProjects, unapprovedProjects }} />
          </div>
        </div>

        {showModal && (
          <div className="modalOverlay">
            <div className="modalContent">
              <p>전체 직원의 role정보를 최신으로 업데이트 및 동기화 하시겠습니까?</p>
              <div className="modalButtons">
                <button onClick={this.handleConfirmRegenerate}>Yes</button>
                <button onClick={this.handleCloseModal}>No</button>
              </div>
            </div>
          </div>
        )}  

        {isLoading && (
          <div className="loadingOverlay">
            <div className="loadingSpinner">
              <div className="spinnerIcon" />
              업데이트 중...
            </div>
          </div>
        )}
            
      </div>
    );
  }
}

export default withRouter(CSuitePage);
