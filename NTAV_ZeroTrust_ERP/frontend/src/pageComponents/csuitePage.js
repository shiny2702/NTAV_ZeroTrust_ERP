import React, { Component } from "react";
import { Outlet } from "react-router-dom";
import withRouter from "../hocs/withRouter";  
import '../css/csuitePage.css';  
import WholeHeaderBar from "./partialComponents/wholeHeaderBar";
import ProfileCard from "./partialComponents/profileCard";

// 경영진 페이지
class CSuitePage extends Component {
  state = {
    approvedProjects: [
      { id: 1, name: '프로젝트 A', approvalDate: '2025-03-01' },
      { id: 2, name: '프로젝트 B', approvalDate: '2025-02-20' }
    ],
    unapprovedProjects: [
      { id: 3, name: '프로젝트 C', approvalDate: null },
      { id: 4, name: '프로젝트 D', approvalDate: null }
    ]
  };

  handleLogoClick = () => {
    this.props.navigate('/csuite');
  };

  render() {
    const { approvedProjects, unapprovedProjects } = this.state;

    return (
      <div className="csuitePage">
        <WholeHeaderBar handleLogoClick={this.handleLogoClick} />

        <div className="csuiteContent">
          <ProfileCard/>
          <div className="contentArea">
            <Outlet context={{ approvedProjects, unapprovedProjects }} />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(CSuitePage);
