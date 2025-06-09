import React, { Component } from 'react';
import withRouter from '../../hocs/withRouter';    
import '../../css/wholeHeaderBar.css';
import { clearUserCookie } from '../../api';

import MenuBar from "./menuBar";
import DeptHeadMenuBar from "./deptHeadMenuBar";
import CSuiteMenuBar from "./csuiteMenuBar";
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
    handleLogoutConfirmation = async (confirm) => {
        if (confirm) { // YES 클릭 시 로그인 페이지로 리디렉션
            try {
                // 백엔드 로그아웃 API 호출
                const success = await clearUserCookie(); // 서버에 user 쿠키 삭제 요청

                if (!success) {
                    alert('서버 쿠키 삭제 실패');
                    return;
                }
                
                localStorage.removeItem('user'); // 로컬 저장 정보 삭제
                this.props.navigate('/'); // 로그인 페이지로 이동
            } catch (error) {
                console.error('로그아웃 실패:', error);
                alert('로그아웃에 실패했습니다. 다시 시도해 주세요.');
            }
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
        '/deptHead': <DeptHeadMenuBar />,
        '/csuite': <CSuiteMenuBar />,
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