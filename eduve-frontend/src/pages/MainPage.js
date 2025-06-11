import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MainPage.css";

const MainPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) setUsername(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    setUsername("");
    navigate("/");
  };

  return (
    <div className="main-container">
      {/* 네비게이션 바 */}
      <nav className="navbar">
        <h1 className="logo">
          <span className="edu">Edu</span>
          <span className="ve">'ve</span>
          <span className="com">.com</span>
        </h1>
        <div className="nav-links">
          <span onClick={() => navigate("/character")}>캐릭터</span>
          <span onClick={() => navigate("/chat")}>채팅</span>
          <span onClick={() => navigate("/materials")}>학습자료</span>

          {username ? (
           <div className="user-menu">
             <button
               className="user-button"
               onClick={() => setMenuOpen(open => !open)}
             >
               {username} <span className="arrow">▼</span>
              </button>
             {menuOpen && (
               <div className="user-dropdown">
                 <button onClick={() => {/* 설정 페이지 이동 */}}>
                   <span className="icon"></span> 설정
                 </button>
                 <button onClick={handleLogout}>
                   <span className="icon"></span> 로그아웃
                 </button>
               </div>
             )}
           </div>
         ) : (
            <>
              <span onClick={() => navigate("/login")}>로그인</span>
              <span onClick={() => navigate("/signup")}>회원가입</span>
            </>
          )}
        </div>
      </nav>

      {/* 서브 헤더 */}
      <div className="sub-header">
        Ask, Learn, Grow — Your personal learning AI, always here for you
      </div>

      {/* 큰 타이틀 배너 */}
      <div className="hero-title">
        Edu’ve
      </div>

      {/* 3D 캐릭터 이미지 */}
      <div className="hero-images">
        <img src="/dragon.png" alt="Dragon" className="dragon" />
        <img src="/potato.png" alt="Potato" className="potato" />
        <img src="/cat.png" alt="Cat" className="cat" />
      </div>
    </div>
  );
};

export default MainPage;