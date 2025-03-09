import React from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";

// 클래스형 컴포넌트에서 useLocation, useNavigate, useOutletContext를 사용할 수 있도록 래핑
function withRouter(Component) {
  return function (props) {
    const location = useLocation();
    const navigate = useNavigate();
    const outletContext = useOutletContext(); // 🏆 Outlet에서 전달된 데이터 가져오기

    return <Component {...props} location={location} navigate={navigate} {...outletContext} />;
  };
}

export default withRouter;



  