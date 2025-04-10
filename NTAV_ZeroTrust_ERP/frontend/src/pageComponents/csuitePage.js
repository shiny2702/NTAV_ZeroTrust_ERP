import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { roleInfoWholeRegenerate, fetchProjects } from "../api";
import "../css/csuitePage.css";
import WholeHeaderBar from "./partialComponents/wholeHeaderBar";
import ProfileCard from "./partialComponents/profileCard";

// 경영진 페이지
const CSuitePage = () => {
  const [waitingForApprovalProjects, setWaitingForApprovalProjects] = useState([]);
  const [approvedOngoingProjects, setApprovedOngoingProjects] = useState([]);
  const [approvedEndedProjects, setApprovedEndedProjects] = useState([]);
  const [rejectedProjects, setRejectedProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/csuite");
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmRegenerate = async () => {
    setShowModal(false);
    setIsLoading(true);
    await handleRoleInfoRegenerate();
  };

  const handleRoleInfoRegenerate = async () => {
    try {
      const response = await roleInfoWholeRegenerate();
      setIsLoading(false);

      if (response.success) {
        alert(response.message || "전체 직원 role정보 최신 업데이트 및 동기화 완료");
      } else {
        alert(response.message || "ERROR :: 전체 직원 role정보 최신 업데이트 및 동기화 실패. 재시도 필요");
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      alert("ERROR :: 전체 직원 role정보 최신 업데이트 및 동기화 실패. 재시도 필요");
    }
  };

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const projects = await fetchProjects();

        console.log("백엔드에서 받아온 프로젝트 데이터:", projects); 

        const waiting = [];
        const ongoing = [];
        const ended = [];
        const rejected = [];

        projects.forEach((project) => {
          switch (project.status) {
            case "waiting for approval":
              waiting.push(project);
              break;
            case "approved":
            case "planning":
            case "in progress":
            case "paused":
              ongoing.push(project);
              break;
            case "completed":
            case "canceled":
              ended.push(project);
              break;
            case "rejected":
              rejected.push(project);
              break;
            default:
              console.warn("알 수 없는 프로젝트 상태:", project.status);
          }
        });

        setWaitingForApprovalProjects(waiting);
        setApprovedOngoingProjects(ongoing);
        setApprovedEndedProjects(ended);
        setRejectedProjects(rejected);
      } catch (error) {
        console.error("프로젝트 데이터를 분류하는 중 오류 발생:", error);
      }
    };

    loadProjects();
  }, []);

  return (
    <div className="csuitePage">
      <WholeHeaderBar handleLogoClick={handleLogoClick} />

      <div className="csuiteContent">
        <div>
          <ProfileCard />
          <div className="syncButtonContainer">
            <button className="syncButton" onClick={handleOpenModal}>
              role정보 전체동기화
            </button>
          </div>
        </div>

        <div className="contentArea">
          <Outlet
            context={{
              waitingForApprovalProjects,
              approvedOngoingProjects,
              approvedEndedProjects,
              rejectedProjects,
            }}
          />
        </div>
      </div>

      {showModal && (
        <div className="modalOverlay">
          <div className="modalContent">
            <p>전체 직원의 role정보를 최신으로 업데이트 및 동기화 하시겠습니까?</p>
            <div className="modalButtons">
              <button onClick={handleConfirmRegenerate}>Yes</button>
              <button onClick={handleCloseModal}>No</button>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="loadingOverlay">
          <div className="loadingSpinner">
            <div className="spinnerIcon" />
            업데이트 및 동기화 중...
          </div>
        </div>
      )}
    </div>
  );
};

export default CSuitePage;

