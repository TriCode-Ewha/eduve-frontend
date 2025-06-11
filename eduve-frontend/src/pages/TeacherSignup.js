import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TeacherSignup.css";
import { signupTeacher, checkUsername, checkEmail } from "../api/SignupApi";

const TeacherSignup = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [academyApi, setAcademyApi] = useState("");

  const [usernameMessage, setUsernameMessage] = useState("");
  const [emailMessage, setEmailMessage] = useState("");

  const handleUsernameCheck = async () => {
    try {
      const res = await checkUsername(username);
      alert(res.message);
    } catch (error) {
      alert("아이디 중복 확인 중 오류 발생");
    }
  };

  const handleEmailCheck = async () => {
    try {
      const res = await checkEmail(email);
      alert(res.message);
    } catch (error) {
      alert("이메일 중복 확인 중 오류 발생");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const signupData = {
      username,
      password,
      name,
      email,
      academyApi
    };

    try {
      await signupTeacher(signupData);
      alert("회원가입이 완료되었습니다!");
      navigate("/login");
    } catch (error) {
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="teacher-signup-container">
      <h1 className="title" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
        <span className="edu">Edu</span><span className="ve">'ve</span><span className="com">.com</span>
      </h1>
      <h2>선생님 회원가입</h2>
      <form className="signup-form" onSubmit={handleSignup}>

        {/* 아이디 입력 + 중복확인 버튼 */}
        <div className="input-group">
          <label>아이디<span className="required">*</span></label>
          <div className="input-container with-button">
            <input
              type="text"
              placeholder="6자 이상의 영문 혹은 영문과 숫자 조합"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button type="button" onClick={handleUsernameCheck}>중복확인</button>
          </div>
          {usernameMessage && <p className="check-message">{usernameMessage}</p>}
        </div>

        {/* 비밀번호 입력 */}
        <div className="input-group">
          <label>비밀번호<span className="required">*</span></label>
          <div className="input-container">
            <input
              type="password"
              placeholder="비밀번호를 입력해주세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {/* 비밀번호 확인 */}
        <div className="input-group">
          <label>비밀번호 확인<span className="required">*</span></label>
          <div className="input-container">
            <input
              type="password"
              placeholder="비밀번호를 한번 더 입력해주세요"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        {/* 이름 입력 */}
        <div className="input-group">
          <label>이름<span className="required">*</span></label>
          <div className="input-container">
            <input
              type="text"
              placeholder="이름을 입력해주세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        {/* 이메일 입력 + 중복확인 버튼 */}
        <div className="input-group">
          <label>이메일<span className="required">*</span></label>
          <div className="input-container with-button">
            <input
              type="email"
              placeholder="이메일을 입력해주세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="button" onClick={handleEmailCheck}>중복확인</button>
          </div>
          {emailMessage && <p className="check-message">{emailMessage}</p>}
        </div>

        {/* 학원 API 입력 + API 확인 버튼 */}
        <div className="input-group">
          <label>학원 코드</label>
          <div className="input-container with-button">
            <input
              type="text"
              placeholder="학원 코드를 입력해주세요"
              value={academyApi}
              onChange={(e) => setAcademyApi(e.target.value)}
            />
            <button type="button">코드 확인</button>
          </div>
        </div>

        {/* 가입하기 버튼 */}
        <button type="submit" className="submit-btn">가입하기</button>

        {/* 로그인 링크 */}
        <p className="login-link">
          이미 계정이 있으신가요?
          <span className="login-button" onClick={() => navigate("/login", { state: { userType: "teacher" } })}>
            로그인하기
          </span>
        </p>
      </form>
    </div>
  );
};

export default TeacherSignup;




