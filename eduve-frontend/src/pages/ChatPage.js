// src/pages/ChatPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatArea from './ChatArea';
import './ChatPage.css';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../api/axiosInstance';

const ChatPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState([]); // 대화 목록: id + title + messages
  const [selectedConvId, setSelectedConvId] = useState(null); // 선택된 대화 ID
  const [messages, setMessages] = useState([]);

  // 토큰에서 userId 추출
    const token = localStorage.getItem('token');
    const { userId } = token ? jwtDecode(token) : {};

  // 사용자명 로드
  // 1. 유저이름과 로컬 채팅 불러오기
  useEffect(() => {
    const u = localStorage.getItem('username');
    if (u) setUsername(u);

    // 초기 메시지 로드 (로컬 또는 API)
    //const saved = localStorage.getItem('chatMessages');
    //if (saved) {
    //  setMessages(JSON.parse(saved));
    //} else {
      // 최초 Jackson 인사
      //setMessages([{ sender: '잭슨', text: '안녕하세요! 저에게 궁금한 점이 있다면 무엇이든 물어보세요😊' }]);
    //}
  }, []);

  const [characterId, setCharacterId] = useState(null);
  const [characterName, setCharacterName] = useState('');
  const [characterImgUrl, setCharacterImgUrl] = useState('');

  // 사이드바 열릴 때 과거 대화 주제 불러오기
  useEffect(() => {
    if (sidebarOpen && userId) {
      axiosInstance.get(`/conversations/user/${userId}`)
        .then(response => {
          console.log('Conversations API Response:', response.data);
          
          const data = response.data;
          
          // 각 대화 데이터 매핑
          const convs = data.map(conv => ({
            id: conv.conversationId,
            title: conv.conversationName || '새로운 대화', 
            createdAt: conv.createTime
              ? new Date(conv.createTime).toLocaleString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })
              : '',
            messageCount: conv.messages?.length || 0
          }));
          
          console.log('Processed conversations:', convs);
          setConversations(convs);
        })
        .catch(err => {
          console.error('대화 목록 로딩 실패:', err.response?.data || err.message);
          if (err.response) {
            console.error('Error status:', err.response.status);
            console.error('Error headers:', err.response.headers);
          }
          setConversations([]); // 에러 시 빈 배열로 초기화
        });
    } 
  }, [sidebarOpen, userId]);

  // 사이드바 닫혀있을 때 캐릭터 조회
  useEffect(() => {
    if (!sidebarOpen && userId) {
      console.log('Fetching character info for userId:', userId); // 디버깅용 로그
      axiosInstance.get(`/userCharacter/${userId}`)
        .then(response => {
          console.log('Character API Response:', response.data); // 디버깅용 로그
          const characterData = response.data;
          console.log('Character data:', characterData); // 디버깅용 로그
          if (characterData) {
            setCharacterId(characterData.characterId);
            setCharacterName(characterData.userCharacterName);
            setCharacterImgUrl(characterData.userCharacterImgUrl);
            console.log('Character data set:', { // 디버깅용 로그
              name: characterData.userCharacterName,
              img: characterData.userCharacterImgUrl
            });
          }
        })
        .catch(err => {
          console.error('캐릭터 정보 로딩 실패:', err.response || err);
          setCharacterName('Unknown');
          setCharacterImgUrl('/default-character.png');
        });
    }
  }, [sidebarOpen, userId]);

  // 대화주제 클릭시 채팅창에 메시지들 표시
  const handleConversationClick = (conversationId) => {
    axiosInstance.get(`/conversations/${conversationId}/messages`)
      .then(response => {
        const data = response.data;
        const messagesData = data.messageList || [];
  
        const msgs = messagesData.map((msg) => ({
          id: msg.messageId,
          sender: msg.userMessage ? 'user' : '잭슨', // 'user'로 변경하여 CSS 클래스와 매칭
          text: msg.content,
          createdTime: new Date(msg.createdTime).toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }),
          isLiked: msg.isLiked || false,
          userMessage: msg.userMessage // userMessage 플래그 추가
        }));
  
        setMessages(msgs);
        setSelectedConvId(conversationId);
      })
      .catch(err => {
        console.error('대화 메시지 불러오기 실패:', err.response?.data || err.message);
      });
  };


  // 5. 로그아웃 처리 함수
  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/');
  };

  return (
    <div className="chat-page">
      {/* 네비게이션 */}
      <nav className="navbar">
        <h1 className="logo"
        onClick={() => navigate("/")}
        style={{ cursor: "pointer" }}>
          <span className="edu">Edu</span><span className="ve">'ve</span>.com
        </h1>
        <div className="nav-links">
          <span className="nav-item" onClick={() => navigate('/character')}>캐릭터</span>
          <span className="nav-item" onClick={() => navigate('/chat')}>채팅</span>
          <span className="nav-item" onClick={() => navigate('/materials')}>학습자료</span>
          {username ? (
            <div className="user-menu">
              <button className="user-button" onClick={() => setMenuOpen(o => !o)}>
                {username} <span className="arrow">▼</span>
              </button>
              {menuOpen && (
                <div className="user-dropdown">
                  <button onClick={() => navigate('/settings')}><span className="icon"></span> 설정</button>
                  <button onClick={handleLogout}><span className="icon"></span> 로그아웃</button>
                </div>
              )}
            </div>
          ) : (
            <> <span className="nav-item" onClick={() => navigate('/login')}>로그인</span>
               <span className="nav-item" onClick={() => navigate('/signup')}>회원가입</span> </>
          )}
        </div>
      </nav>

      {/* 본문 */}
      <div className={`chat-body ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {/* 사이드바 */}
        <aside className={`chat-sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
          {!sidebarOpen ? (
            <> 
              <img
                src={characterImgUrl || '/default-character.png'} // 이미지 URL이 없을 경우 기본 이미지 대체
                alt={`캐릭터 ${characterName}`}
                className="character-thumb"
              />
              <p className="character-name">{characterName || 'defaultName'}</p>
              <button className="sidebar-toggle" onClick={() => setSidebarOpen(true)}>&gt;&gt;</button>
            </>
          ) : (
            <>
              <button className="sidebar-toggle" onClick={() => setSidebarOpen(false)}>&lt;&lt;</button>
              <div className="history-container">
                <h2 className="history-title">지난 대화 주제</h2>
                <ul className="history-list">
                  {conversations.length > 0 ? (
                    conversations.map((conv) => (
                      <li
                        key={conv.id}
                        className={`conversation-item ${selectedConvId === conv.id ? 'selected' : ''}`}
                        onClick={() => handleConversationClick(conv.id)}
                      >
                        <div className="conversation-title">{conv.title}</div>
                        <div className="conversation-meta">
                          <span className="conversation-date">{conv.createdAt}</span>
                          <span className="conversation-count">{conv.messageCount}개의 메시지</span>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="no-conversations">대화 내역이 없습니다</li>
                  )}
                </ul>
              </div>
            </>
          )}
        </aside>

        {/* 채팅 메인 */}
        <main className="chat-main">
          <div className="chat-box">
            <ChatArea 
              messages={messages} 
              setMessages={setMessages} 
              //onLikeMessage={handleLikeMessage}   // 좋아요 핸들러
              //onSendMessage={handleSendMessage}   // 메시지 전송 핸들러
              username={username}                  // 현재 사용자명
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChatPage;