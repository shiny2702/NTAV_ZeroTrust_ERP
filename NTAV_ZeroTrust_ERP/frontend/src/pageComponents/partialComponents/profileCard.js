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
                    <h3>{user ? `${user.name} (ID :: ${user.employee_id})` : "사용자 이름"}</h3>
                    <div className="profileDetails">
                        <p>{user && user.department ? `Dept :: ${user.department.dept_name}` : "Dept :: 부서 정보"}</p>
                        <p>{user && user.team ? `Team :: ${user.team.team_name}` : "Team :: 팀 정보"}</p>
                        <p>{user ? `E-mail :: ${user.email}` : "E-mail :: 이메일 주소"}</p>
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