// src/components/MenuBar.js
import React, { Component } from 'react';
import withRouter from '../../hocs/withRouter';
import '../../css/menuBar.css';
import { MENU_STRUCTURE } from './menuStructure'; // MENU_STRUCTURE import

class CSuiteMenuBar extends Component {
  state = {
    user: JSON.parse(localStorage.getItem('user')) || null,
  };

  handleMenuClick = (item) => {
    this.props.navigate(`/csuite/${item.key}`);
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
      <ul className="menu">
        {MENU_STRUCTURE.map(menu => (
          <li className="dropdown" key={menu.category}>
            {menu.category} ▾
            <div className="dropdown-menu">
              {menu.sections.map((section, i) => (
                <React.Fragment key={i}>
                  <div className="dropdown-column">
                    <h3>{section.title}</h3>
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
                  {i < menu.sections.length - 1 && <div className="dropdown-divider"></div>}
                </React.Fragment>
              ))}
            </div>
          </li>
        ))}
      </ul>
    );
  }
}

export default withRouter(CSuiteMenuBar);