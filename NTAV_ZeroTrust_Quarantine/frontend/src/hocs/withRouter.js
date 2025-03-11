import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// 클래스형 컴포넌트에서 useLocation과 useNavigate를 사용할 수 있도록 래핑하는 HOC
function withRouter(Component) {
  return function(props) {
    const location = useLocation();
    const navigate = useNavigate();
    
    return <Component {...props} location={location} navigate={navigate} />;
  };
}

export default withRouter;