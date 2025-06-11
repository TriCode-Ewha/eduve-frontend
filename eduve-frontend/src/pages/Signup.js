import React from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();

  return (
    <div className="signup-container">
      <h1>회원가입</h1>
      <p>아래 중 회원 유형을 선택하신 후 회원가입을 진행해주세요.</p>
      <div className="signup-options">
        {/* 선생님 회원가입 박스 */}
        <div className="signup-box" onClick={() => navigate("/signup/teacher")}>
          <img src="/teacher.png" alt="선생님 회원가입" />
          <p>선생님 회원가입</p>
        </div>

        {/* 학생 회원가입 박스 */}
        <div className="signup-box" onClick={() => navigate("/signup/student")}>
          <img src="/student.png" alt="학생 회원가입" />
          <p>학생 회원가입</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

