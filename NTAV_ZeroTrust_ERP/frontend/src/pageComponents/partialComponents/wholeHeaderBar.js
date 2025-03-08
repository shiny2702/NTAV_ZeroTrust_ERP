import React, { Component } from 'react';
import withRouter from '../../hocs/withRouter';    
import '../../css/wholeHeaderBar.css';
import MenuBar from "./menuBar";

class WholeHeaderBar extends Component {
    state = {
        showLogoutModal: false
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

    render() {
        const { showLogoutModal } = this.state;

        return (
            <div>
                <div className="header">
                    <div className="logo" onClick={this.handleLogoClick}>NTAV</div>
                    <nav className="menu">
                        <MenuBar/>
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