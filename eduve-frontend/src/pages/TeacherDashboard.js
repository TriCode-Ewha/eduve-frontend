import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./TeacherDashboard.css";

const TeacherDashboard = () => {
  const location = useLocation();
  const teacherName = location.state?.name || "선생님"; // 기본값 "선생님"

  // 선택된 수업 상태 관리 (한 번에 하나만 선택 가능)
  const [selectedLesson, setSelectedLesson] = useState(null);

  // 최근 업로드한 수업 목록 (예제)
  const lessons = [
    { id: 1, name: "수학 - 미적분" },
    { id: 2, name: "과학 - 물리 법칙" },
    { id: 3, name: "영어 - 독해 연습" },
  ];

  // 수업 클릭 시 색상 변경 (한 번에 하나만 선택 가능)
  const handleLessonClick = (id) => {
    setSelectedLesson(id);
  };

  return (
    <div className="dashboard-container">
      <h1 className="title">
        <span className="edu">Edu</span><span className="ve">'ve</span>
      </h1>
      <p className="welcome-text">
        안녕하세요, <strong>{teacherName}</strong>님!
      </p>
      <p className="description">
        학생들의 학습을 돕기 위해 강의 자료를 업로드하고, 질문을 확인해 보세요.<br />
        어떤 수업을 확인할까요?
      </p>

      <h3 className="recent-title">최근 업로드한 수업</h3>
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

export default TeacherDashboard;

