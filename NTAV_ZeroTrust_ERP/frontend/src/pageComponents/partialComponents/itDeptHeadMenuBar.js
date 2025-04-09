import React, { Component } from 'react';
import withRouter from '../../hocs/withRouter';    
import '../../css/menuBar.css';  

class ItDeptHeadMenuBar extends Component {
  handleMenuClick = (menu) => {
    if (menu === "salesStrategy") {
        this.props.navigate("/salesStrategy");
      } else if (menu === "accountManagement") {
        this.props.navigate("/accountManagement");
      } 
    };
  
render() {
    return (
    <ul>
        <li className="dropdown">경영 ▾
        <div className="dropdown-menu">
            <div className="dropdown-column">
            <h3>영업</h3>
            <ul>
                <li onClick={() => this.handleMenuClick("salesStrategy")}>영업목표</li>
                <li onClick={() => this.handleMenuClick("salesStrategy")}>성과평가</li>
                <li onClick={() => this.handleMenuClick("salesStrategy")}>고객(B2B)관리</li>
            </ul>
            </div>
            <div className="dropdown-divider"></div>
            <div className="dropdown-column">
            <h3>기획</h3>
            <ul>
                <li onClick={() => this.handleMenuClick("salesStrategy")}>영업전략기획</li>
                <li onClick={() => this.handleMenuClick("salesStrategy")}>신제품/서비스기획</li>
                <li onClick={() => this.handleMenuClick("salesStrategy")}>시장조사</li>
                <li onClick={() => this.handleMenuClick("salesStrategy")}>비용처리</li>
            </ul>
            </div>
            <div className="dropdown-divider"></div>
            <div className="dropdown-column">
            <h3>운영</h3>
            <ul>
                <li onClick={() => this.handleMenuClick("directOperation")}>직영점관리</li>
                <li onClick={() => this.handleMenuClick("directOperation")}>메뉴관리</li>
                <li onClick={() => this.handleMenuClick("salesStrategy")}>비용처리</li>
                <li onClick={() => this.handleMenuClick("salesStrategy")}>매출분석및보고</li>
            </ul>
            </div>
        </div>
        </li>
        <li className="dropdown">재무회계 ▾
        <div className="dropdown-menu">
            <div className="dropdown-column">
            <h3>재무</h3>
            <ul>
                <li onClick={() => this.handleMenuClick("salesStrategy")}>재무계획수립</li>
                <li onClick={() => this.handleMenuClick("salesStrategy")}>예산관리</li>
                <li onClick={() => this.handleMenuClick("salesStrategy")}>재무데이터분석</li>
                <li onClick={() => this.handleMenuClick("salesStrategy")}>재무요청</li>
            </ul>
            </div>
            <div className="dropdown-divider"></div>
            <div className="dropdown-column">
            <h3>회계</h3>
            <ul>
                <li onClick={() => this.handleMenuClick("directOperation")}>회계기록유지</li>
                <li onClick={() => this.handleMenuClick("salesStrategy")}>세무관리</li>
            </ul>
            </div>
        </div>
        </li>
        <li className="dropdown">인사 ▾
        <div className="dropdown-menu">
            <div className="dropdown-column">
            <h3>HR정책</h3>
            <ul>
                <li onClick={() => this.handleMenuClick("salesStrategy")}>인사정책수립</li>
                <li onClick={() => this.handleMenuClick("salesStrategy")}>휴가정책수립</li>
                <li onClick={() => this.handleMenuClick("salesStrategy")}>조직구성관리</li>
                <li onClick={() => this.handleMenuClick("salesStrategy")}>직원교육</li>
            </ul>
            </div>
            <div className="dropdown-divider"></div>
            <div className="dropdown-column">
            <h3>인사관리</h3>
            <ul>
                <li onClick={() => this.handleMenuClick("directOperation")}>채용관리</li>
                <li onClick={() => this.handleMenuClick("salesStrategy")}>인력지원</li>
                <li onClick={() => this.handleMenuClick("salesStrategy")}>급여관리</li>
                <li onClick={() => this.handleMenuClick("salesStrategy")}>근태관리</li>
                <li onClick={() => this.handleMenuClick("salesStrategy")}>성과평가</li>
                <li onClick={() => this.handleMenuClick("salesStrategy")}>비용처리</li>
            </ul>
            </div>
        </div>
        </li>
        <li className="dropdown">마케팅 ▾
        <div className="dropdown-menu">
            <div className="dropdown-column">
            <h3>마케팅</h3>
            <ul>
                <li onClick={() => this.handleMenuClick("salesStrategy")}>마케팅시장조사</li>
                <li onClick={() => this.handleMenuClick("salesStrategy")}>마케팅전략개발</li>
                <li onClick={() => this.handleMenuClick("salesStrategy")}>마케팅캠페인</li>
                <li onClick={() => this.handleMenuClick("salesStrategy")}>마케팅성과평가</li>
                <li onClick={() => this.handleMenuClick("salesStrategy")}>비용처리</li>
            </ul>
            </div>
        </div>
        </li>
        <li className="dropdown">고객관리 ▾
        <div className="dropdown-menu">
            <div className="dropdown-column">
            <h3>고객서비스</h3>
            <ul>
                <li onClick={() => this.handleMenuClick("directOperation")}>서비스정책수립</li>
                <li onClick={() => this.handleMenuClick("salesStrategy")}>회원관리</li>
                <li onClick={() => this.handleMenuClick("directOperation")}>고객요청및피드백수집</li>
                <li onClick={() => this.handleMenuClick("salesStrategy")}>고객요청및피드백분석</li>
                <li onClick={() => this.handleMenuClick("salesStrategy")}>비용처리</li>
            </ul>
            </div>
        </div>
        </li>
        <li className="dropdown">물류 ▾
        <div className="dropdown-menu">
            <div className="dropdown-column">
            <h3>공급망관리</h3>
            <ul>
                <li onClick={() => this.handleMenuClick("salesStrategy")}>공급업체관리</li>
                <li onClick={() => this.handleMenuClick("directOperation")}>배송업체관리</li>
                <li onClick={() => this.handleMenuClick("salesStrategy")}>구매전략수립</li>
                <li onClick={() => this.handleMenuClick("salesStrategy")}>비용처리</li>
            </ul>
            </div>
            <div className="dropdown-divider"></div>
            <div className="dropdown-column">
            <h3>물류</h3>
            <ul>
                <li onClick={() => this.handleMenuClick("directOperation")}>제품관리</li>
                <li onClick={() => this.handleMenuClick("directOperation")}>주문/배송관리</li>
                <li onClick={() => this.handleMenuClick("directOperation")}>품질/재고관리</li>
            </ul>
            </div>
        </div>
        </li>
    </ul>
    );
  }
}

export default withRouter(ItDeptHeadMenuBar);