import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/LoginApi";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await login({ username, password});
      const token = response.data.token;

      const userId = response.data.userId;

      // 토큰과 사용자명 저장
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      localStorage.setItem("userId", userId);

      // 메인 페이지로 이동
      navigate("/");
    } catch (err) {
      setError("로그인 실패. 아이디 또는 비밀번호를 확인하세요.");
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <h1 className="title" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
        <span className="edu">Edu</span><span className="ve">'ve</span><span className='com'>.com</span>
      </h1>
      <form className="login-form" onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="아이디"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input 
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button type="submit" className="login-btn">로그인</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Login;



