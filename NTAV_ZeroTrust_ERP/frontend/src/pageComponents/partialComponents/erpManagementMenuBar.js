import React, { Component } from 'react';
import withRouter from '../../hocs/withRouter';    
import '../../css/menuBar.css';  
import { IT_MANAGEMENT_MENU_STRUCTURE } from './menuStructure';

class ERPManagementMenuBar extends Component {
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
  
    const erpItems = IT_MANAGEMENT_MENU_STRUCTURE.find(menu => menu.category === "IT 관리")
      ?.sections.find(section => section.title === "ERP 관리")
      ?.items || [];
  
    return (
      <ul className="erpManagementMenu">
        {erpItems
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

export default withRouter(ERPManagementMenuBar);