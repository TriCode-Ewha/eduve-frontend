import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MainPage.css";

const UserSettingsModal = ({ userId, onClose, onNameChange }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [newName, setNewName] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isNameValid, setIsNameValid] = useState(true);
  const [hasPendingChange, setHasPendingChange] = useState(false);

  const authHeader = localStorage.getItem("token") || "";

  // 유저 정보 조회
  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://api.eduve.r-e.kr/user/${userId}`, {
        headers: { Authorization: authHeader },
      })
      .then((res) => {
        setUserInfo(res.data);
        setNewName(res.data.name || "");        // 이름으로 초기화
        setOriginalName(res.data.name || "");
        setIsNameValid(true);
      })
      .catch(() => {
        setError("회원 정보를 불러오는데 실패했습니다.");
      })
      .finally(() => setLoading(false));
  }, [userId]);

  // 이름 변경 감지 및 유효성 검사 (여기선 중복 검사 제외, 필요시 추가)
  useEffect(() => {
    if (newName === originalName) {
      setHasPendingChange(false);
      setIsNameValid(true);
    } else {
      setHasPendingChange(true);
      setIsNameValid(newName.trim() !== "");
    }
  }, [newName, originalName]);

  // 이름 변경 요청
  const handleChangeName = async () => {
    if (!newName.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      // 이름 변경 API 호출
      const res = await axios.patch(
        `https://api.eduve.r-e.kr/user/${userId}`,
        { name: newName },
        { headers: { Authorization: authHeader } }
      );
      setUserInfo(res.data);
      alert("이름이 변경되었습니다.");
      setOriginalName(res.data.name);
      setIsNameValid(true);
      setHasPendingChange(false);
      if (onNameChange) onNameChange(res.data.name);
      localStorage.setItem("name", res.data.name);
    } catch (error) {
      alert("이름 변경 실패");
    } finally {
      setLoading(false);
    }
  };

  // 회원 탈퇴
  const handleDeleteAccount = () => {
    if (!window.confirm("정말 탈퇴하시겠습니까?")) return;
    setLoading(true);
    axios
      .delete("https://api.eduve.r-e.kr/user/${userId}", {
        headers: {
          Authorization: authHeader,
        },
      })
      .then(() => {
        alert("회원 탈퇴 완료");
        localStorage.clear();
        window.location.href = "/";
      })
      .catch(() => alert("회원 탈퇴 실패"))
      .finally(() => setLoading(false));
  };

  // 모달 닫기 전 확인
  const handleModalClose = () => {
    if (hasPendingChange && !isNameValid) {
      const confirmDiscard = window.confirm(
        "이름 변경이 저장되지 않았습니다. 변경을 취소하고 닫으시겠습니까?"
      );
      if (!confirmDiscard) return;
      setNewName(originalName);
      setHasPendingChange(false);
      setIsNameValid(true);
    }
    onClose();
  };

  if (loading)
    return (
      <div className="main-modal-overlay">
        <div className="main-modal-content">로딩 중...</div>
      </div>
    );

  if (error)
    return (
      <div className="main-modal-overlay">
        <div className="main-modal-content">
          <p>{error}</p>
          <button onClick={handleModalClose}>x</button>
        </div>
      </div>
    );

  return (
    <div className="main-modal-overlay" onClick={handleModalClose}>
      <div className="main-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>회원 설정</h2>
        {userInfo && (
          <div className="user-info">
            {/* 프로필 사진 */}
            {userInfo.role === "ROLE_Student" && (
              <img src="/student.png" className="profile-image" />
            )}
            {userInfo.role === "ROLE_Teacher" && (
              <img src="/teacher.png" className="profile-image" />
            )}

            <p><strong>이름:</strong></p>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="name-input"
            />
            <p><strong>ID:</strong> {userInfo.username}</p>
            <p><strong>email:</strong> {userInfo.email}</p>
            <p><strong>role:</strong> {userInfo.role === "ROLE_Teacher" ? "teacher" : userInfo.role === "ROLE_Student" ? "student" : userInfo.role}</p>

            <button
              onClick={handleChangeName}
              className="btn-primary"
              disabled={!isNameValid || !hasPendingChange}
              style={{
                backgroundColor: !isNameValid || !hasPendingChange ? "#ccc" : "#1B512D",
                cursor: !isNameValid || !hasPendingChange ? "not-allowed" : "pointer",
              }}
            >
              이름 변경
            </button>

            <hr />
            <button onClick={handleDeleteAccount} className="btn-danger">회원 탈퇴</button>
          </div>
        )}
        <button onClick={handleModalClose} className="btn-close">x</button>
      </div>
    </div>
  );
};


const MainPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");  const [userId, setUserId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleNameChange = (newName) => {
    setUsername(newName);
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedUserId = localStorage.getItem("userId");
    if (storedUsername) setUsername(storedUsername);
    if (storedUserId) setUserId(Number(storedUserId));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUsername("");
    setUserId(null);
    navigate("/");
  };

  return (
    <div className="main-container">
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
              <button className="user-button" onClick={() => setMenuOpen((open) => !open)}>
                {username} <span className="arrow">▼</span>
              </button>
              {menuOpen && (
                <div className="user-dropdown">
                  <button onClick={() => { setShowSettings(true); setMenuOpen(false); }}>설정</button>
                  <button onClick={handleLogout}>로그아웃</button>
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

      <div className="sub-header">
        Ask, Learn, Grow — Your personal learning AI, always here for you
      </div>

      <div className="hero-title">Edu’ve</div>

      <div className="hero-images">
        <img src="/dragon.png" alt="Dragon" className="dragon" />
        <img src="/potato.png" alt="Potato" className="potato" />
        <img src="/cat.png" alt="Cat" className="cat" />
      </div>

      {showSettings && userId && (
        <UserSettingsModal
          userId={userId}
          onClose={() => setShowSettings(false)}
          onNameChange={handleNameChange}
        />
      )}
    </div>
  );
};

export default MainPage;

