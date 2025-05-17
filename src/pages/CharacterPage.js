// components/CharacterPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CharacterPage.css";
import {
  fetchUserCharacter,
  updateUserCharacter,
} from "../api/CharacterApi";

const CharacterPage = () => {
  const navigate = useNavigate();
  const [tone, setTone] = useState("정중한 말투");
  const [level, setLevel] = useState(2);
  const [username, setUsername] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [customName, setCustomName] = useState("");
  const rangeRef = useRef(null);

  const characterList = [
    { characterId: 1, key: "dragon", name: "용용이", characterImgUrl: "https://eduve1.s3.ap-northeast-2.amazonaws.com/dragon.webp" },
    { characterId: 2, key: "dog", name: "멍멍이", characterImgUrl: "https://eduve1.s3.ap-northeast-2.amazonaws.com/dog.webp" },
    { characterId: 3, key: "squirrel", name: "다람이", characterImgUrl: "https://eduve1.s3.ap-northeast-2.amazonaws.com/squirrel.webp" },
    { characterId: 4, key: "cat", name: "냥냥이", characterImgUrl: "https://eduve1.s3.ap-northeast-2.amazonaws.com/cat.webp" },
    { characterId: 5, key: "potato", name: "감자", characterImgUrl: "https://eduve1.s3.ap-northeast-2.amazonaws.com/potato.webp" },
  ];

  const toneReverseMap = {
    FORMAL: "정중한 말투",
    FRIENDLY: "친근한 말투",
    KIND: "친절한 말투",
    TSUNDERE: "츤데레 말투",
  };

  const levelReverseMap = {
    LOW: 0,
    LOW_MID: 1,
    MID: 2,
    HIGH: 3,
    EXPERT: 4,
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!token) {
      alert("로그인이 필요합니다.");
      return navigate("/login");
    }

    if (storedUser) setUsername(storedUser);

    if (userId) {
      fetchUserCharacter(userId, token)
        .then((data) => {
          console.log("서버에서 받은 캐릭터 설정:", data);
          if (!data) return;

          const {
            characterId,
            tone: serverTone,
            descriptionLevel,
            userCharacterName,
          } = data;

          const foundIdx = characterList.findIndex((ch) => ch.characterId === characterId);
          if (foundIdx !== -1) {
            setSelectedIdx(foundIdx);
          }

          if (userCharacterName) {
            setCustomName(userCharacterName);
          }

          if (serverTone && toneReverseMap[serverTone]) {
            setTone(toneReverseMap[serverTone]);
          }

          if (descriptionLevel && levelReverseMap[descriptionLevel] !== undefined) {
            setLevel(levelReverseMap[descriptionLevel]);
          }
        })
        .catch((err) => {
          console.error("캐릭터 불러오기 실패:", err);
        });
    }
  }, []);

  useEffect(() => {
    const percentage = (level / 4) * 100;
    if (rangeRef.current) {
      rangeRef.current.style.background = `
        linear-gradient(to right,
          #CDD6A2 0%, #CDD6A2 ${percentage}%,
          #ddd ${percentage}%, #ddd 100%)
      `;
    }
  }, [level]);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    setUsername("");
    navigate("/");
  };

  const selectedCharacter = characterList[selectedIdx] || {};

  const handleSave = () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) return alert("로그인이 필요합니다.");

    const toneMap = {
      "정중한 말투": "FORMAL",
      "친근한 말투": "FRIENDLY",
      "친절한 말투": "KIND",
      "츤데레 말투": "TSUNDERE",
    };

    const levelMap = ["LOW", "LOW_MID", "MID", "HIGH", "EXPERT"];

    updateUserCharacter(userId, {
      characterId: selectedCharacter.characterId,
      userCharacterName: customName || selectedCharacter.name,
      tone: toneMap[tone],
      descriptionLevel: levelMap[level],
    }, token)
      .then(() => {
        alert("캐릭터 설정이 저장되었습니다.");
        setCustomName(customName || selectedCharacter.name);
      })
      .catch((err) => console.error("저장 실패:", err));
  };

  return (
    <div className="character-page-container">
      <nav className="navbar">
        <h1 className="logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
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
                  <button>
                    <span className="icon">⚙️</span> 설정
                  </button>
                  <button onClick={handleLogout}>
                    <span className="icon">🚪</span> 로그아웃
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

      <div className="character-content">
        <div className="character-image">
          <div className="character-image-inner">
            {selectedCharacter.characterImgUrl && (
              <img
                src={selectedCharacter.characterImgUrl?.replace(/^\[|\]$/g, "")}
                alt={selectedCharacter.name}
                className="main-image"
              />
            )}
            <p className="character-name">
              {customName !== "" ? customName : selectedCharacter.name}
            </p>

            <div className="thumbnail-list">
              {characterList.map((ch, i) => (
                <img
                  key={ch.characterId}
                  src={ch.characterImgUrl}
                  alt={ch.name}
                  className={"thumbnail" + (i === selectedIdx ? " selected" : "")}
                  onClick={() => {
                    setSelectedIdx(i);
                    setCustomName("");
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="character-settings">
          <div className="settings-box">
            <div className="setting-group">
              <div className="setting-item">
                <label>캐릭터 이름</label>
                <input
                  type="text"
                  placeholder="이름을 입력하세요"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                />
              </div>
              <div className="setting-item">
                <label>말투</label>
                <div className="tone-buttons">
                  {["정중한 말투", "친근한 말투", "친절한 말투", "츤데레 말투"].map((t) => (
                    <button
                      key={t}
                      className={tone === t ? "selected" : ""}
                      onClick={() => setTone(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="setting-item">
                <div className="level-label-wrapper">
                  <label>사용자 수준</label>
                  <span className="user-level-desc">
                    챗봇이 사용자 수준을 고려하여 답변을 생성합니다.
                  </span>
                </div>
                <div className="user-level-wrapper">
                  <input
                    type="range"
                    min="0"
                    max="4"
                    value={level}
                    onChange={(e) => setLevel(Number(e.target.value))}
                    ref={rangeRef}
                  />
                </div>
                <div className="level-labels">
                  <span>초등학생 수준</span>
                  <span>중학생 수준</span>
                  <span>고등학생 수준</span>
                  <span>대학생 수준</span>
                  <span>전문가 수준</span>
                </div>
              </div>
            </div>
          </div>
          <button className="save-button" onClick={handleSave}>
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterPage;
