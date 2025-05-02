import React from "react";

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null; // 모달이 열리지 않으면 아무 것도 렌더링하지 않음

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
      }}
      onClick={onClose} // 배경 클릭 시 모달 닫기
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          minWidth: "300px",
          zIndex: 1001,
        }}
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 배경 클릭 방지
      >
        <button
          style={{ position: "absolute", top: "10px", right: "10px" }}
          onClick={onClose}
        >
          X
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;