import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// 클래스형 컴포넌트에서 useLocation과 useNavigate를 사용할 수 있도록 래핑하는 HOC
function withRouter(Component) {
  function WithRouter(props) {
    const location = useLocation();
    const navigate = useNavigate();

    return <Component {...props} location={location} navigate={navigate} />;
  }

  // HOC 컴포넌트에 displayName 추가
  WithRouter.displayName = `WithRouter(${Component.displayName || Component.name})`;

  return WithRouter;
}

export default withRouter;
