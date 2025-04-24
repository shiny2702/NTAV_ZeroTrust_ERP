// src/components/MenuBar.js
import React, { Component } from 'react';
import withRouter from '../../hocs/withRouter';
import '../../css/menuBar.css';
import { IT_MANAGEMENT_MENU_STRUCTURE } from './menuStructure'; // MENU_STRUCTURE import

class ItDeptHeadMenuBar extends Component {
  state = {
    user: JSON.parse(localStorage.getItem('user')) || null,
  };

  handleMenuClick = (item) => {
    this.props.navigate(`/main/${item.key}`);
    if (this.props.onMenuSelect) {
      this.props.onMenuSelect(item);
    }
  };

  render() {
    const { user } = this.state;
    let allowedAppNos = new Set();

    if (user?.roleInfo?.permission_pages) {
      const { main_apps = [], readable_apps = [] } = user.roleInfo.permission_pages;
      allowedAppNos = new Set([...main_apps, ...readable_apps]);
    }

    return (
        <ul className="itDeptHeadMenu">
          {IT_MANAGEMENT_MENU_STRUCTURE.map(menu => (
            menu.sections.map((section, i) => (
              <li className="dropdown" key={`${menu.category}-${section.title}`}>
                {section.title} ▾
                <div className="dropdown-menu">
                  <React.Fragment key={i}>
                    <div className="dropdown-column">
                      <ul>
                        {section.items
                          .filter(item => allowedAppNos.has(item.app_no))
                          .map(item => (
                            <li key={item.app_no} onClick={() => this.handleMenuClick(item)}>
                              {item.name}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </React.Fragment>
                </div>
              </li>
            ))
          ))}
        </ul>
      );
  }
}

export default withRouter(ItDeptHeadMenuBar);