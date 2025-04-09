import React, { Component } from "react";
import { Outlet } from "react-router-dom";
import withRouter from "../hocs/withRouter";  // withRouter HOC 가져오기
import '../css/mainPage.css';  // 스타일 파일
import WholeHeaderBar from "./partialComponents/wholeHeaderBar";
import ProfileCard from "./partialComponents/profileCard";

// 일반 직원 페이지
class MainPage extends Component {
  state = {
    user: JSON.parse(localStorage.getItem('user')) || null,
  };

  handleLogoClick = () => {
    this.props.navigate('/main');
  };

  render() {
    const { user } = this.state;
    // `navigate`를 통해 전달된 사용자 데이터 받기
    console.log("받은 사용자 데이터:", user);

    return (
      <div className="mainPage">
        <WholeHeaderBar handleLogoClick={this.handleLogoClick} />

        <div className="mainContent"> 
          <ProfileCard/>

          <div className="contentArea">
            {/* <Outlet context={{ }} /> */}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(MainPage);  // withRouter로 감싸기