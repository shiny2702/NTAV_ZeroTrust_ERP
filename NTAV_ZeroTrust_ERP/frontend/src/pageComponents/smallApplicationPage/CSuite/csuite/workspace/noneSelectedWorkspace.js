import React, { Component } from "react";
import withRouter from "../../../../../hocs/withRouter";  

class NoneSelectedWorkspace extends Component {
    render() {
        return (
            <div style={styles.container}>
                <span style={styles.text}>Choose the project</span>
            </div>
        );
    }
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // 화면 전체 높이
        backgroundColor: 'rgba(0, 0, 0, 0.1)', // 반투명 배경
    },
    text: {
        fontSize: '2rem', // 글씨 크기
        fontStyle: 'italic', // 기울임꼴
        color: 'rgba(0, 0, 0, 0.7)', // 반투명 글씨색
        textAlign: 'center',
    }
};

export default withRouter(NoneSelectedWorkspace);