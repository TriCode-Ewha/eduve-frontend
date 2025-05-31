// src/pages/ArchivePage.js

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadFile, renameFile, createFolder } from '../api/fileApi';
import { v4 as uuidv4 } from 'uuid';
import { jwtDecode } from 'jwt-decode';
import './ArchivePage.css';

export default function ArchivePage() {
  const navigate = useNavigate();

  // — 사용자 정보 (username, userId, userRole)
  const [username, setUsername] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);

  // — 검색, 폴더/파일, 모달 등 상태
  const [searchText,    setSearchText   ] = useState('');
  const [searchActive,  setSearchActive ] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [addMenuOpen,   setAddMenuOpen  ] = useState(false);
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [sortMenuOpen,  setSortMenuOpen ] = useState(false);
  const [sortOrder,     setSortOrder    ] = useState('past'); // past, recent, alpha 등
  const [menuOpen, setMenuOpen] = useState(false);
  const [folders,       setFolders      ] = useState([]);
  const [files,         setFiles        ] = useState([]);
  const [currentPath,   setCurrentPath  ] = useState([]);    // 문자열 배열(폴더 트리 경로)
  const [previewFileUrl, setPreviewFileUrl] = useState(null);
  const [expandedPaths, setExpandedPaths] = useState([]);    // 사이드바 트리 확장 상태

  // — 사이드바 트리 확장/축소 헬퍼
  const toggleExpand = pathKey => {
    setExpandedPaths(prev =>
      prev.includes(pathKey)
        ? prev.filter(k => k !== pathKey)
        : [...prev, pathKey]
    );
  };
  const isExpanded = pathKey => expandedPaths.includes(pathKey);

  // — 컴포넌트 마운트 시: 토큰 디코딩 + localStorage에 저장된 폴더/파일 불러오기
  useEffect(() => {
    // 1) 토큰 받아와서 디코딩 후 userId, userRole, username 세팅
    const rawToken = localStorage.getItem('token');
    if (rawToken) {
      const jwtString = rawToken.startsWith('Bearer ') ? rawToken.substring(7) : rawToken;
      try {
        const payload = jwtDecode(jwtString);
        // 예: { username: "teacher01", userId: 5, role: "ROLE_Teacher", iat: ..., exp: ... }
        console.log('▶ 디코딩된 페이로드:', payload);
        setCurrentUserId(payload.userId);
        setCurrentUserRole(payload.role);   // "ROLE_Teacher" 또는 "ROLE_Student"
        setUsername(payload.username);       // 확실히 username도 JWT 페이로드에서 가져오기
      } catch (e) {
        console.warn('토큰 디코딩 실패:', e);
      }
    }

    // 2) localStorage에 저장된 폴더/파일 불러오기
    const sf = localStorage.getItem('folders');
    if (sf) {
      try { setFolders(JSON.parse(sf)); }
      catch { localStorage.removeItem('folders'); }
    }
    const sF = localStorage.getItem('files');
    if (sF) {
      try { setFiles(JSON.parse(sF)); }
      catch { localStorage.removeItem('files'); }
    }
  }, []);

  // — 로그아웃
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
  };

  // — 폴더 트리: 클릭 시 currentPath 업데이트
  const handleFolderClick = name => setCurrentPath(p => [...p, name]);
  const handlePathClick   = idx  => setCurrentPath(p => p.slice(0, idx + 1));

  // — 새 폴더 추가 시작
  const handleAddFolderStart = () => {
    setIsAddingFolder(true);
    setAddMenuOpen(false);
  };

  // — 새 폴더 생성 API 호출
  const handleAddFolder = useCallback(async () => {
    const name = newFolderName.trim();
    if (!name) return alert('폴더 이름을 입력해주세요.');
    let userId;
    try {
      const payload = jwtDecode(localStorage.getItem('token').substring(7));
      userId = payload.userId;
    } catch {
      return alert('토큰이 유효하지 않습니다.');
    }
    const parentId = currentPath.length
      ? folders.find(f => JSON.stringify(f.path) === JSON.stringify(currentPath))?.id
      : null;

    try {
      const res = await createFolder({ folderName: name, userId, parentId });
      const { folderId, folderName: createdName } = res.data;
      const newFolderItem = {
        id: folderId,
        name: createdName,
        path: [...currentPath],
      };
      const updated = [...folders, newFolderItem];
      setFolders(updated);
      localStorage.setItem('folders', JSON.stringify(updated));
      setNewFolderName('');
      setIsAddingFolder(false);
    } catch (err) {
      console.error('폴더 생성 에러', err);
      alert('폴더 생성에 실패했습니다.');
    }
  }, [newFolderName, currentPath, folders]);

  // — 파일 업로드 핸들러
  const handleFileSelect = async e => {
    const file = e.target.files[0];
    if (!file) return;

    let userId, uploaderName, uploaderRole;
    try {
      const rawToken = localStorage.getItem('token');
      const jwtString = rawToken.startsWith('Bearer ') ? rawToken.substring(7) : rawToken;
      const decoded = jwtDecode(jwtString);
      userId       = decoded.userId;
      uploaderName = decoded.username || decoded.email || 'Unknown';
      uploaderRole = decoded.role; // "ROLE_Teacher" 또는 "ROLE_Student"
    } catch {
      return alert('토큰이 유효하지 않습니다.');
    }

    const fd = new FormData();
    fd.append('file', file);
    fd.append('userId', userId);
    fd.append('folderId', 1);

    try {
      const res = await uploadFile(fd);
      const infoArr = res.data.fileInfo;
      const info = Array.isArray(infoArr) ? infoArr[0] : infoArr;

      // 프론트엔드에서 파일 객체에 uploader 정보를 붙인다
      const nf = {
        id:            uuidv4(),
        name:          info.fileName,
        path:          [...currentPath],
        fileUrl:       info.fileUrl,
        uploaderId:    userId,
        uploaderName,      
        uploaderRole    // "ROLE_Teacher" 또는 "ROLE_Student"
      };
      const updated = [...files, nf];
      setFiles(updated);
      localStorage.setItem('files', JSON.stringify(updated));
    } catch (err) {
      console.error('파일 업로드 실패', err);
      alert('파일 업로드에 실패했습니다.');
    } finally {
      setAddMenuOpen(false);
    }
  };

  // — 파일 더블클릭 시 PDF 미리보기
  const handleFileDoubleClick = file =>
    file.fileUrl ? setPreviewFileUrl(file.fileUrl) : alert('파일 URL이 없습니다.');
  const closePreview = () => setPreviewFileUrl(null);

  // — 폴더/파일 삭제, 이름 변경
  const handleDeleteFolder = id => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    const next = folders.filter(f => f.id !== id);
    setFolders(next);
    localStorage.setItem('folders', JSON.stringify(next));
  };
  const handleDeleteFile = id => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    const next = files.filter(f => f.id !== id);
    setFiles(next);
    localStorage.setItem('files', JSON.stringify(next));
  };
  const handleRenameFile = async file => {
    const newName = prompt('새 이름을 입력하세요', file.name);
    if (!newName || newName === file.name) return;
    try {
      const res = await renameFile(file.id, newName);
      const updated = res.data;
      const next = files.map(f =>
        f.id === updated.fileId ? { ...f, name: updated.fileName } : f
      );
      setFiles(next);
      localStorage.setItem('files', JSON.stringify(next));
    } catch {
      alert('이름 변경 실패');
    }
  };

  // — 검색 (클라이언트 사이드)
  const handleSearch = () => {
    if (!searchText.trim()) {
      setSearchResults([]);
      setSearchActive(false);
      return;
    }
    let candidates;

    if (currentUserRole === 'ROLE_Teacher') {
      // 선생님인 경우: 본인이 올린 파일만
      candidates = files.filter(
        f => f.uploaderRole === 'ROLE_Teacher' && f.uploaderId === currentUserId
      );
    } else {
      // 학생(ROLE_Student)이나 기타(ROLE_Admin 등) → 모든 파일 검색 가능
      candidates = files;
    }

    const results = candidates.filter(f =>
      typeof f.name === 'string' && f.name.includes(searchText.trim())
    );
    setSearchResults(results);
    setSearchActive(true);
  };

  useEffect(() => {
    if (!searchText.trim()) {
      setSearchActive(false);
      setSearchResults([]);
    }
  }, [searchText]);

  // — 현재 경로에 해당하는 폴더/파일만 골라내기
  const displayFolders = folders.filter(f =>
    JSON.stringify(f.path) === JSON.stringify(currentPath)
  );

  const displayFiles = files.filter(f => {
    // 1) 같은 경로
    if (JSON.stringify(f.path) !== JSON.stringify(currentPath)) return false;

    // 2) teacher라면 “본인이 올린 teacher 파일만”
    if (currentUserRole === 'ROLE_Teacher') {
      return (
        f.uploaderRole === 'ROLE_Teacher' &&
        f.uploaderId === currentUserId
      );
    }

    // 3) student라면 “teacher가 올린 파일 + 본인이 올린 student 파일”
    if (currentUserRole === 'ROLE_Student') {
      return (
        f.uploaderRole === 'ROLE_Teacher' ||
        (f.uploaderRole === 'ROLE_Student' && f.uploaderId === currentUserId)
      );
    }

    // 4) 그 외(admin 등)은 모든 파일 보기
    return true;
  });

  // — 정렬 (기본순(past) / 최신순(recent) / 가나다순(alpha))
  if (sortOrder === 'recent') {
    displayFolders.reverse();
    displayFiles.reverse();
  } else if (sortOrder === 'alpha') {
    displayFolders.sort((a, b) => a.name.localeCompare(b.name));
    displayFiles.sort((a, b) => a.name.localeCompare(b.name));
  }

  // — 사이드바 트리 재귀 렌더링
  const renderTree = (path = []) => {
    const key = JSON.stringify(path);
    const subsF = folders.filter(f => JSON.stringify(f.path) === key);
    const subsI = files.filter(f => JSON.stringify(f.path) === key);
    if (!subsF.length && !subsI.length) return null;

    return (
      <ul>
        {subsF.map(f => {
          const childKey = JSON.stringify([...path, f.name]);
          return (
            <li key={f.id} className="folder-node">
              <div onClick={() => toggleExpand(childKey)}>
                <img src="/mini_folder.png" className="sidebar-icon" alt="folder" />
                {f.name}
              </div>
              {isExpanded(childKey) && renderTree([...path, f.name])}
            </li>
          );
        })}
        {subsI.map(fi => (
          <li key={fi.id} className="file-node" onClick={() => handleFileDoubleClick(fi)}>
            <img src="/mini_file.png" className="sidebar-icon" alt="file" />
            {fi.name}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="archive-container">
      {/* 네비게이션 */}
      <nav className="navbar">
        <h1 className="logo" onClick={() => navigate('/')}>
          <span className="edu">Edu</span><span className="ve">'ve</span><span className="com">.com</span>
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
                  <button onClick={() => navigate('/settings')}>설정</button>
                  <button onClick={handleLogout}>로그아웃</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <span className="nav-item" onClick={() => navigate('/login')}>로그인</span>
              <span className="nav-item" onClick={() => navigate('/signup')}>회원가입</span>
            </>
          )}
        </div>
      </nav>

      {/* 본문: 사이드바 + 메인 영역 */}
      <div className="archive-body">
        {/* ────────────────────────────────────────
            사이드바
        ──────────────────────────────────────── */}
        <aside className="sidebar">
          <div className="search-wrapper">
            <input
              className="archive-search"
              type="text"
              placeholder="Search"
              value={searchText}
              onFocus={() => setSearchActive(true)}
              onBlur={() => setSearchActive(false)}
              onChange={e => setSearchText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            <button className="search-btn" onMouseDown={handleSearch} aria-label="검색">
              <img src="/search-button.png" alt="돋보기" />
            </button>

            {searchActive && (
              <div className="search-panel">
                {searchResults.length > 0 ? (
                  searchResults.map(f => (
                    <div
                      key={f.id}
                      className="search-item"
                      onMouseDown={() => handleFileDoubleClick(f)}
                    >
                      <img src="/mini_file.png" className="sidebar-icon" alt="file" />
                      <span className="search-item-text">{f.name}</span>
                    </div>
                  ))
                ) : (
                  <div className="no-results-sidebar">검색 결과가 없습니다.</div>
                )}
              </div>
            )}
          </div>

          {!searchActive && <div className="folder-tree">{renderTree()}</div>}
        </aside>

        {/* ────────────────────────────────────────
            메인 영역
        ──────────────────────────────────────── */}
        <main className="archive-main">
          {/* breadcrumb + 정렬 버튼 */}
          <div className="path-display">
            {currentPath.length === 0 ? (
              <span className="path-link">홈</span>
            ) : (
              <>
                <span className="path-link" onClick={() => setCurrentPath([])}>홈</span>
                {currentPath.map((p, i) => (
                  <span
                    key={i}
                    className="path-link"
                    onClick={() => handlePathClick(i)}
                  >
                    {' / '}{p}
                  </span>
                ))}
              </>
            )}
            <button className="sort-toggle" onClick={() => setSortMenuOpen(o => !o)}>
              정렬 ▼
            </button>
            {sortMenuOpen && (
              <div className="sort-dropdown">
                <button onClick={() => { setSortOrder('past');   setSortMenuOpen(false); }}>
                  {sortOrder === 'past' ? '✔ ' : ''}기본순
                </button>
                <button onClick={() => { setSortOrder('recent'); setSortMenuOpen(false); }}>
                  {sortOrder === 'recent' ? '✔ ' : ''}최신순
                </button>
                <button onClick={() => { setSortOrder('alpha');  setSortMenuOpen(false); }}>
                  {sortOrder === 'alpha' ? '✔ ' : ''}가나다순
                </button>
              </div>
            )}
          </div>

          {/* ────────────────────────────────────────
               폴더 리스트 & “+” 추가 버튼
          ──────────────────────────────────────── */}
          <div className="folder-list">
            <div
              className="folder-box add-placeholder"
              onClick={() => { setAddMenuOpen(o => !o); setIsAddingFolder(false); }}
            >
              <img src="/add.png" className="folder-icon" alt="추가" />
              {addMenuOpen && (
                <div className="add-dropdown under-add-placeholder">
                  <button
                    onMouseDown={e => {
                      e.stopPropagation();
                      document.getElementById('file-upload').click();
                    }}
                  >
                    파일추가
                  </button>
                  <button
                    onMouseDown={e => {
                      e.stopPropagation();
                      handleAddFolderStart();
                    }}
                  >
                    폴더추가
                  </button>
                </div>
              )}
            </div>
            {displayFolders.map(f => (
              <div
                key={f.id}
                className="folder-box"
                onClick={() => handleFolderClick(f.name)}
                onContextMenu={e => {
                  e.preventDefault();
                  handleDeleteFolder(f.id);
                }}
              >
                <img src="/folder.png" className="folder-icon" alt="folder" />
                <div className="folder-name">{f.name}</div>
              </div>
            ))}
            {isAddingFolder && (
              <div className="folder-box new-folder">
                <img src="/folder.png" className="folder-icon" alt="new folder" />
                <input
                  className="folder-name-input"
                  placeholder="폴더 이름"
                  value={newFolderName}
                  onChange={e => setNewFolderName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddFolder()}
                  autoFocus
                />
              </div>
            )}
          </div>

          {/* 숨겨진 파일 업로드 input */}
          <input
            id="file-upload"
            type="file"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />

          {/* ────────────────────────────────────────
               파일 리스트
          ──────────────────────────────────────── */}
          <div className="file-list">
            {displayFiles.length === 0 && displayFolders.length === 0 && !searchActive && (
              <div className="no-results"></div>
            )}
            {displayFiles.map(file => (
              <div
                key={file.id}
                className="file-box"
                onDoubleClick={() => handleFileDoubleClick(file)}
                onContextMenu={e => {
                  e.preventDefault();
                  const action = window.confirm('이름 변경: OK, 삭제: Cancel') ? 'rename' : 'delete';
                  if (action === 'rename') handleRenameFile(file);
                  else handleDeleteFile(file.id);
                }}
              >
                <img src="/pdf-thumbnail.png" className="file-thumbnail" alt="file" />
                <div className="file-name">{file.name}</div>
                <div className="file-uploader">
                  {file.uploaderName}님 업로드  (
                  {file.uploaderRole === 'ROLE_Teacher' ? '선생님' : '학생'}
                  )
                </div>
              </div>
            ))}
          </div>

          {/* ────────────────────────────────────────
               PDF 미리보기 모달
          ──────────────────────────────────────── */}
          {previewFileUrl && (
            <div className="archive-modal-overlay" onClick={closePreview}>
              <div className="archive-modal-content" onClick={e => e.stopPropagation()}>
                <iframe src={previewFileUrl} title="PDF Preview" style={{ border: 'none' }} />
                <button className="archive-close-btn" onClick={closePreview}>닫기</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
