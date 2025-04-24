import React, { Component } from 'react';
import withRouter from '../../hocs/withRouter';    
import '../../css/wholeHeaderBar.css';

import MenuBar from "./menuBar";
import ItSecurityMenuBar from "./itSecurityMenuBar";
import ERPManagementMenuBar from "./erpManagementMenuBar";
import ItDeptHeadMenuBar from "./itDeptHeadMenuBar";

class WholeHeaderBar extends Component {
    state = {
        user: JSON.parse(localStorage.getItem('user')) || null,
        showLogoutModal: false,
    };

    handleLogoutClick = () => {
        this.setState({ showLogoutModal: true });
    };

      // 로그아웃 확인 후 동작
    handleLogoutConfirmation = (confirm) => {
        if (confirm) { // YES 클릭 시 로그인 페이지로 리디렉션
            localStorage.removeItem('user'); // 로그아웃 시 localStorage에서 사용자 정보 삭제
            localStorage.removeItem('token');
            this.props.navigate('/');
        } else { // NO 클릭 시 모달을 닫음
            this.setState({ showLogoutModal: false });
        }
    };

    // MenuBar 매핑 정의
    menuBarMap = {
        '/itSecurity': <ItSecurityMenuBar />,
        '/erpManagement': <ERPManagementMenuBar />,
        '/itDeptHead': <ItDeptHeadMenuBar />,
        '/main': <MenuBar />,
        '/deptHead': <MenuBar />,
        '/csuite': <MenuBar />,
    };

    // 현재 경로에 따라 MenuBar 결정
    renderMenuBar = () => {
        const { pathname } = this.props.location;
        const path = Object.keys(this.menuBarMap).find(p => pathname.startsWith(p));
        const menuBar = this.menuBarMap[path];
      
        // onMenuSelect prop을 주입해서 MenuBar에 전달
        return menuBar ? React.cloneElement(menuBar, {
          onMenuSelect: this.props.onMenuSelect
        }) : null;
      };      


    render() {
        const { showLogoutModal } = this.state;

        return (
            <div>
                <div className="header">
                    <div className="logo" onClick={this.props.handleLogoClick}>NTAV</div>
                    <nav className="menu">
                        {this.renderMenuBar()}
                    </nav>
                    <button className="logoutButton" onClick={this.handleLogoutClick}>
                        Logout
                    </button>
                </div>

                {showLogoutModal && (
                    <div className="logoutModal">
                        <div className="modalContent">
                            <p>로그아웃 하시겠습니까?</p>
                            <button onClick={() => this.handleLogoutConfirmation(true)}>YES</button>
                            <button onClick={() => this.handleLogoutConfirmation(false)}>NO</button>
                        </div>
                    </div>
                )}
            </div>
        );

    }
}

export default withRouter(WholeHeaderBar);