import React, { Component } from 'react';
import withRouter from '../../hocs/withRouter';    
import '../../css/profileCard.css';

class ProfileCard extends Component {
    state = {
        user: JSON.parse(localStorage.getItem('user')) || null,
    };

    handlePasswordResetClick = () => {
        this.props.navigate('/passwordReset');
    };

    render() {
        const { user } = this.state;

        return (
            <div>
                <div className="profileCard">
                    <div className="profileImage"></div>
                    <h3>{user ? `${user.username}` : "사용자 이름"}</h3>
                    <div className="profileDetails">
                        <p>{user ? `E-mail :: ${user.email}` : "E-mail :: 이메일 주소"}</p>
                        <p>{user ? `Dept :: ${user.dept}` : "Dept :: 부서 정보"}</p>
                        <p>{user ? `Role :: ${user.role}` : "Role :: 직급"}</p>
                    </div>
                    <button className="passwordResetLink" onClick={this.handlePasswordResetClick}>
                        비밀번호 변경
                    </button>
                </div>
            </div>
        );

    }
}

export default withRouter(ProfileCard);