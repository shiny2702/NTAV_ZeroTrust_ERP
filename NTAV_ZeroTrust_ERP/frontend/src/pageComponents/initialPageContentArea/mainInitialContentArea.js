import React, { Component } from "react";
import withRouter from "../../hocs/withRouter";  
import '../../css/csuiteInitialContentArea.css';  

class MainInitialContentArea extends Component {
    handleProjectClick = () => {
        this.props.navigate('projectApproval');
    };

    render() {
        return (
            <div className="projectDashboard">
              <button className="projectButton" onClick={this.handleProjectApprovalClick}>
                프로젝트 현황 ‣
              </button>

            </div>
        )
}

}

export default withRouter(MainInitialContentArea);