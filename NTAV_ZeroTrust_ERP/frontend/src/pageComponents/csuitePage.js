import React, { Component } from "react";
import { Outlet } from "react-router-dom";
import withRouter from "../hocs/withRouter";  
import '../css/csuitePage.css';  
import WholeHeaderBar from "./partialComponents/wholeHeaderBar";
import ProfileCard from "./partialComponents/profileCard";

// 경영진 페이지
class CSuitePage extends Component {
  state = {
    approvedProjects: [
      { 
        no: 1, name: '프로젝트 A', startDate: '2025-03-01', 
        leadDeptTeam: { dept: 'IT', team: 'Core Development', applications: { 
          'System Architecture': { employees: [{ id: 'E001', name: 'Alice' }, { id: 'E003', name: 'Charlie' }] }, 
          'Backend Development': { employees: [{ id: 'E002', name: 'Bob' }, { id: 'E003', name: 'Charlie' }] } } }, 
        collabDeptTeam: [
          { dept: 'HR', team: 'Team Alpha', applications: { 
              'Recruitment': { employees: [{ id: 'E004', name: 'David' }] }, 
              'Training': { employees: [{ id: 'E005', name: 'Eve' }, { id: 'E004', name: 'David' }] } } },
          { dept: 'IT', team: 'Team Beta', applications: { 
              'UI/UX Design': { employees: [{ id: 'E006', name: 'Frank' }] }, 
              'Frontend Development': { employees: [{ id: 'E007', name: 'Grace' }] } } }
        ],
        securityLevel: '4', goalEndDate: '2025-12-31'
      },
      { 
        no: 2, name: '프로젝트 B', startDate: '2025-02-20', 
        leadDeptTeam: { dept: 'Finance', team: 'Risk Management', applications: { 
          'Financial Analysis': { employees: [{ id: 'E008', name: 'Helen' }] }, 
          'Fraud Detection': { employees: [{ id: 'E009', name: 'Ivy' }] } } }, 
        collabDeptTeam: [
          { dept: 'Finance', team: 'Team Gamma', applications: { 
              'Investment Planning': { employees: [{ id: 'E010', name: 'Jack' }] }, 
              'Budget Forecasting': { employees: [{ id: 'E011', name: 'Kara' }] } } },
          { dept: 'Marketing', team: 'Team Delta', applications: { 
              'Market Research': { employees: [{ id: 'E012', name: 'Leo' }] }, 
              'Brand Strategy': { employees: [{ id: 'E013', name: 'Mia' }, { id: 'E012', name: 'Leo' }] } } }
        ],
        securityLevel: '3', goalEndDate: '2025-11-30'
      }
    ],
    unapprovedProjects: [
      { 
        no: 3, name: '프로젝트 C', startDate: null, 
        leadDeptTeam: { dept: 'Legal', team: 'Compliance', applications: { 
          'Regulatory Compliance': { employees: [{ id: 'E014', name: 'Nina' }] }, 
          'Contract Review': { employees: [{ id: 'E015', name: 'Oscar' }] } } }, 
        collabDeptTeam: [
          { dept: 'Legal', team: 'Team Epsilon', applications: { 
              'Policy Drafting': { employees: [{ id: 'E016', name: 'Paul' }] }, 
              'Litigation Support': { employees: [{ id: 'E017', name: 'Quincy' }] } } },
          { dept: 'R&D', team: 'Team Zeta', applications: { 
              'Product Innovation': { employees: [{ id: 'E018', name: 'Rachel' }] }, 
              'Prototype Testing': { employees: [{ id: 'E019', name: 'Steve' }] } } }
        ],
        securityLevel: '5', goalEndDate: '2026-01-15'
      },
      { 
        no: 4, name: '프로젝트 D', startDate: null, 
        leadDeptTeam: { dept: 'Security', team: 'Incident Response', applications: { 
          'Threat Monitoring': { employees: [{ id: 'E020', name: 'Tom' }] }, 
          'Incident Handling': { employees: [{ id: 'E021', name: 'Uma' }] } } }, 
        collabDeptTeam: [
          { dept: 'Security', team: 'Team Theta', applications: { 
              'Penetration Testing': { employees: [{ id: 'E022', name: 'Vera' }] }, 
              'Forensics Analysis': { employees: [{ id: 'E023', name: 'Wendy' }] } } }
        ],
        securityLevel: '5', goalEndDate: '2026-06-30'
      }
    ]
  };
  

  handleLogoClick = () => {
    this.props.navigate('/csuite');
  };

  render() {
    const { approvedProjects, unapprovedProjects } = this.state;

    return (
      <div className="csuitePage">
        <WholeHeaderBar handleLogoClick={this.handleLogoClick} />

        <div className="csuiteContent">
          <ProfileCard/>
          <div className="contentArea">
            <Outlet context={{ approvedProjects, unapprovedProjects }} />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(CSuitePage);
