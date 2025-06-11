import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userType = location.state?.userType; // 로그인한 유저 타입 (student / teacher)
  const studentName = location.state?.name || "학생"; // 기본값 "학생"

  const [selectedLesson, setSelectedLesson] = useState(null);

  const lessons = [
    { id: 1, name: "수학 - 함수" },
    { id: 2, name: "과학 - 화학 반응" },
    { id: 3, name: "영어 - 문법 연습" },
  ];

  if (userType === "teacher") {
    navigate("/teacher-dashboard"); 
    return null;
  }

  // 수업 클릭 시 색상 변경 (하나만 선택 가능)
  const handleLessonClick = (id) => {
    setSelectedLesson(id);
  };

  return (
    <div className="dashboard-container">
      <h1 className="title">
        <span className="edu">Edu</span><span className="ve">'ve</span>
      </h1>
      <p className="welcome-text">
        <strong>{studentName}</strong>님, 반가워요!
      </p>
      <p className="description">
        배움에는 질문이 중요하죠. 궁금한 점이 있으면 언제든지 물어보세요!<br />
        어떤 수업을 공부해 볼까요?
      </p>

      <h3 className="recent-title">최근 공부한 수업</h3>
      <div className="lesson-list">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className={`lesson-box ${selectedLesson === lesson.id ? "active" : ""}`}
            onClick={() => handleLessonClick(lesson.id)}
          >
            {lesson.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;

