import React, { Component } from 'react';
import withRouter from '../../hocs/withRouter';    
import '../../css/menuBar.css';  
import { IT_MANAGEMENT_MENU_STRUCTURE } from './menuStructure';

class ItSecurityMenuBar extends Component {
  state = {
    user: JSON.parse(localStorage.getItem('user')) || null,
  };

  handleMenuClick = (key) => {
    this.props.navigate(`/${key}`);
  };

  render() {
    const { user } = this.state;
    let allowedAppNos = new Set();
  
    if (user?.roleInfo?.permission_pages) {
      const { main_apps = [], readable_apps = [] } = user.roleInfo.permission_pages;
      allowedAppNos = new Set([...main_apps, ...readable_apps]);
    }
  
    const securityItems = IT_MANAGEMENT_MENU_STRUCTURE.find(menu => menu.category === "IT 관리")
      ?.sections.find(section => section.title === "IT 보안")
      ?.items || [];
  
    return (
      <ul className="itSecurityMenu">
        {securityItems
          .filter(item => allowedAppNos.has(item.app_no))
          .map(item => (
            <li key={item.app_no} onClick={() => this.handleMenuClick(item.key)}>
              {item.name}
            </li>
          ))}
      </ul>
    );
  }
  
}

export default withRouter(ItSecurityMenuBar);