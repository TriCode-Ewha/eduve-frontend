// src/pages/ArchivePage.js

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  uploadFile,
  fetchFile,
  renameFile,
  createFolder,
  fetchUserFolders,
  fetchFolderContents,
  moveFile,
  deleteFile
} from '../api/fileApi';
import { v4 as uuidv4 } from 'uuid';
import { jwtDecode } from 'jwt-decode';
import './ArchivePage.css';

export default function ArchivePage() {
  const navigate = useNavigate();

  // — 사용자 & 메뉴 상태
  const [username, setUsername] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  // — 검색 상태
  const [searchText, setSearchText] = useState('');
  const [searchActive, setSearchActive] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // — Add 메뉴 상태
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // — 정렬 상태
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState(null);

  // — 자료(폴더/파일) 상태
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [previewFileUrl, setPreviewFileUrl] = useState(null);
  // import 하단부나 useEffect 위쪽에 추가
  const [dropdownOpenId, setDropdownOpenId] = useState(null);

  // — 현재 로그인된 user 정보 (userId, role)
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);

  // — 이름 변경 모달 상태
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [renameTargetFile, setRenameTargetFile] = useState(null);
  const [renameInput, setRenameInput] = useState('');

  // 삭제 모달 상태
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetFileId, setDeleteTargetFileId] = useState(null);

  // 이동 폴더 선택 모달
  const [fileMoveModalOpen, setFileMoveModalOpen] = useState(false);
  const [moveCurrentFolderId, setMoveCurrentFolderId] = useState(null);
  const [moveFolders, setMoveFolders] = useState([]);
  const [moveFolderStack, setMoveFolderStack] = useState([]);

  const [moveTargetFileId, setMoveTargetFileId] = useState(null);

  // — 사이드바 트리 확장 상태
  const [expandedPaths, setExpandedPaths] = useState([]);
  const toggleExpand = pathKey => {
    setExpandedPaths(prev =>
      prev.includes(pathKey)
        ? prev.filter(k => k !== pathKey)
        : [...prev, pathKey]
    );
  };
  const isExpanded = pathKey => expandedPaths.includes(pathKey);

  const handleMoveClick = async (fileId) => {
    setMoveTargetFileId(fileId);
    setMoveFolderStack([]); // 탐색 경로 초기화
    setFileMoveModalOpen(true);
    await loadMoveFolderContents(null); // 루트에서 시작
  };

  const loadMoveFolderContents = async (folderId) => {
    try {
      const res = await fetchFolderContents(currentUserId, folderId ?? null, 'name');
      const foldersOnly = (Array.isArray(res.data) ? res.data : []).filter(item => item.type === 'folder');
      setMoveFolders(foldersOnly);
      setMoveCurrentFolderId(folderId ?? null);
    } catch (err) {
      console.error('폴더 불러오기 실패', err);
    }
  };

  const confirmFileMove = async (targetFolderId) => {
    if (!moveTargetFileId || targetFolderId == null) return;
    try {
      const res = await moveFile(moveTargetFileId, targetFolderId);
      const updated = res.data;
      const updatedPath = getFolderPathById(targetFolderId);
  
      const next = files.map(f =>
        f.id === updated.fileId ? { ...f, path: updatedPath } : f
      );
  
      setFiles(next);
      localStorage.setItem('files', JSON.stringify(next));
      alert('이동 완료');
    } catch (err) {
      console.error('이동 실패', err);
      alert('파일 이동에 실패했습니다.');
    } finally {
      setFileMoveModalOpen(false);
      setMoveTargetFileId(null);
    }
  };

  // 파일 이동
  const handleMoveFile = async (fileId, targetFolderId) => {
    try {
      await moveFile(fileId, targetFolderId);
      const updated = files.map(f =>
        f.id === fileId ? { ...f, path: getFolderPathById(targetFolderId) } : f
      );
      setFiles(updated);
      localStorage.setItem('files', JSON.stringify(updated));
      alert('이동 완료되었습니다.');
    } catch (err) {
      console.error('파일 이동 실패:', err);
      alert('파일 이동에 실패했습니다.');
    }
  };

  // 삭제 클릭 핸들러 
  const handleDeleteClick = (fileId) => {
    setDeleteTargetFileId(fileId);
    setDeleteModalOpen(true);
  };

  // — 이름 변경 모달 토글
  const handleRenameClick = file => {
    setRenameTargetFile(file);
    setRenameInput(file.name);
    setRenameModalOpen(true);
    setDropdownOpenId(null);
  };

  // — 이름 변경 확인
  const confirmRename = async () => {
    if (!renameInput || renameInput === renameTargetFile.name) {
      setRenameModalOpen(false);
      return;
    }
    try {
      const res = await renameFile(renameTargetFile.id, renameInput);
      const updated = res.data;
      const next = files.map(f =>
        f.id === updated.fileId ? { ...f, name: updated.fileName } : f
      );
      setFiles(next);
      localStorage.setItem('files', JSON.stringify(next));
    } catch (err) {
      alert('이름 변경 실패');
    } finally {
      setRenameModalOpen(false);
    }
  };

  // - 삭제 확인 
  const confirmDelete = async () => {
    try {
      await deleteFile(deleteTargetFileId);
      const next = files.filter(f => f.id !== deleteTargetFileId);
      setFiles(next);
      localStorage.setItem('files', JSON.stringify(next));
    } catch (err) {
      console.error('삭제 실패', err);
      alert('삭제에 실패했습니다.');
    } finally {
      setDeleteModalOpen(false);
      setDeleteTargetFileId(null);
    }
  };

  // — 컴포넌트 마운트 시: localStorage → state로 불러오기 + 토큰 디코딩
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUserId(decoded.userId);
        setCurrentUserRole(decoded.role);
        setUsername(decoded.username || localStorage.getItem('username') || '');
      } catch {
        console.warn('토큰 디코딩 실패');
      }
    }

    const sf = localStorage.getItem('folders');
    if (sf) {
      try {
        setFolders(JSON.parse(sf));
      } catch {
        localStorage.removeItem('folders');
      }
    }

    const sF = localStorage.getItem('files');
    if (sF) {
      try {
        setFiles(JSON.parse(sF));
      } catch {
        localStorage.removeItem('files');
      }
    }
  }, []);

  // 캐시 초기화: currentUserId가 바뀌면 로컬스토리지와 state 비우기
  useEffect(() => {
    if (!currentUserId) return;

    localStorage.removeItem('folders');
    localStorage.removeItem('files');
    setFolders([]);
    setFiles([]);
  }, [currentUserId]);


  // — **API 호출: 현재 userId가 세팅되면 최상위 폴더 목록 불러오기**
  useEffect(() => {
    if (!currentUserId) return;

    // (A) 최상위 폴더 목록
    fetchUserFolders(currentUserId, null)
      .then(res => {
        const fetchedFolders = res.data
        .filter(item => item.type === 'folder')
        .map(f => ({
          id: f.folderId,
          name: f.folderName,
          path: []
        }));

        let existing = [];
        try{
          existing = JSON.parse(localStorage.getItem('folders'))|| [];
        } catch { existing= [];}
        const merged = [
          ...existing,
          ...fetchedFolders.filter(fNew =>
            !existing.some(e=>e.id===fNew.id)
          )
        ];

        setFolders(merged);
        localStorage.setItem('folders', JSON.stringify(merged));
      })
      .catch(err => console.error('최상위 폴더 목록 실패', err));

    // (B) 최상위 폴더(홈) 파일 목록
    (async () => {
      try {
        const res2 = await fetchFolderContents(currentUserId, null, null);
    
        // 응답에서 파일만 필터링
        const rootFiles = res2.data.filter(item => item.type === 'file');
    
        const mapped = rootFiles.map(ff => ({
          id:           ff.fileId,
          name:         ff.fileName,
          path:         [],
          fileUrl:      ff.fileUrl,
          uploaderId:   ff.userId,
          uploaderRole: ff.role,
          uploaderName: ff.username,
        }));
    
        let existingFiles = [];
        try {
          existingFiles = JSON.parse(localStorage.getItem('files')) || [];
        } catch {
          existingFiles = [];
        }
    
        const mergedFiles = [
          ...existingFiles,
          ...mapped.filter(fNew =>
            !existingFiles.some(e => e.id === fNew.id)
          )
        ];
    
        if (sortOrder === 'name') {
          mergedFiles.sort((a, b) =>
            a.name.localeCompare(b.name, 'ko')
          );
        }
    
        setFiles(mergedFiles);
        localStorage.setItem('files', JSON.stringify(mergedFiles));
      } catch (err) {
        console.error('루트 파일 목록 가져오기 실패', err);
      }
    })();
  }, [currentUserId, sortOrder]);

  // — 로그아웃
  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    navigate('/');
  };

  // — 폴더 클릭: breadcrumb 이동 + 하위 폴더·파일 조회 API 호출
  const handleFolderClick = useCallback(
    async folder => {
      // 1) 메인 화면을 해당 폴더 안으로 바꾸기 위해 currentPath 갱신
      const newPath = [...currentPath, folder.name];
      setCurrentPath(newPath);

      // 2) API에서 하위 폴더/파일 불러와서 state에 병합
      try {
        const res = await fetchFolderContents(currentUserId, folder.id, sortOrder);
        const { folders: subFolders = [], files: subFiles = [] } = res.data;

        // ── 하위 폴더 state에 추가 ──
        const newFetchedFolders = subFolders.map(sf => ({
          id: sf.id,
          name: sf.name,
          path: newPath
        }));
        setFolders(prev => {
          const merged = [...prev, ...newFetchedFolders];
          localStorage.setItem('folders', JSON.stringify(merged));
          return merged;
        });

        // ── 하위 파일 state에 추가 ──
        const newFetchedFiles = subFiles.map(ff => ({
          id: ff.fileId,
          name: ff.fileName,
          path: newPath,
          fileUrl: ff.fileUrl,
          uploaderId: ff.userId,
          uploaderRole: ff.role,
          uploaderName: ff.username
        }));
        setFiles(prev => {
          const merged = [...prev, ...newFetchedFiles];
          localStorage.setItem('files', JSON.stringify(merged));
          return merged;
        });
      } catch (err) {
        console.error('하위 폴더 및 파일 가져오기 실패', err);
      }
    },
    [currentPath, currentUserId, sortOrder]
  );

  // — Add 메뉴 토글
  const handleAddFolderStart = () => {
    setIsAddingFolder(true);
    setAddMenuOpen(false);
  };

  // — 폴더 생성 API 호출 (예: 현재 위치에 생성)
  const handleAddFolder = useCallback(async () => {
    const name = newFolderName.trim();
    if (!name) return alert('폴더 이름을 입력해주세요.');
    let userId;
    try {
      userId = jwtDecode(localStorage.getItem('token')).userId;
    } catch {
      return alert('토큰이 유효하지 않습니다.');
    }
    // ── 수정 포인트: 현재 화면(currentPath)에 따라 parentId 지정
    const parentId = currentPath.length
      ? folders.find(f => JSON.stringify(f.path) === JSON.stringify(currentPath))?.id
      : null;

    const payload = { folderName: name, userId };
    if (parentId !== null) {
      payload.parentId = parentId;
    }


    try {
      const res = await createFolder({ folderName: name, userId, parentId });
      const { folderId, folderName: createdName } = res.data;
      const newFolderItem = {
        id: folderId,
        name: createdName,
        path: [...currentPath],  // 현재 위치가 path로 저장됨
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

  // — 파일 업로드 핸들러 (현재 위치에 파일 업로드)
  const handleFileSelect = async e => {
    const file = e.target.files[0];
    if (!file) return;
    let userId, uploader;
    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      userId = decoded.userId;
      uploader = decoded.username || decoded.email || 'Unknown';
    } catch {
      return alert('토큰이 유효하지 않습니다.');
    }

    // 지금 보고 있는 폴더의 ID 구하기
    const parentFolder = folders.find(
      f => JSON.stringify(f.path) === JSON.stringify(currentPath)
    );
    const folderIdToUse = parentFolder ? parentFolder.id : null;

    const fd = new FormData();
    fd.append('file', file);
    fd.append('userId', userId);
    fd.append('username', uploader);
    if (folderIdToUse != null) {
      fd.append('folderId', folderIdToUse);
    }

    try {
      const res = await uploadFile(fd);
      const infoArr = res.data.fileInfo;
      const info = Array.isArray(infoArr) ? infoArr[0] : infoArr;

      const newFileObj = {
        id: info.fileId || uuidv4(),
        name: info.fileName,
        path: [...currentPath],    // 현재 화면 위치에 저장
        fileUrl: info.fileUrl,
        uploaderId: info.userId,
        uploaderRole: info.role,
        uploaderName: info.username,
      };

      setFiles(prev => {
        const merged = [...prev, newFileObj];
        localStorage.setItem('files', JSON.stringify(merged));
        return merged;
      });
    } catch (err) {
      console.error('파일 업로드 실패', err);
      alert('파일 업로드에 실패했습니다.');
    } finally {
      setAddMenuOpen(false);
    }
  };

  // — PDF 미리보기
  const handleFileDoubleClick = file =>
    file.fileUrl ? setPreviewFileUrl(file.fileUrl) : alert('URL이 없습니다.');
  const closePreview = () => setPreviewFileUrl(null);

  const getFolderPathById = (id) => {
    const folder = folders.find(f => f.id === id);
    return folder ? folder.path : [];
  };

  // — 삭제 / 이름 변경
  const handleDeleteFolder = id => {
    if (!window.confirm('삭제하시겠습니까?')) return;
    const next = folders.filter(f => f.id !== id);
    setFolders(next);
    localStorage.setItem('folders', JSON.stringify(next));
  };
  const handleRenameFile = async file => {
    const newName = prompt('새 이름을 입력하세요', file.name);
    if (!newName || newName === file.name) return;
    try {
      const res = await renameFile(file.id, newName);
      const updatedFileInfo = res.data;
      const next = files.map(f =>
        f.id === updatedFileInfo.fileId ? { ...f, name: updatedFileInfo.fileName } : f
      );
      setFiles(next);
      localStorage.setItem('files', JSON.stringify(next));
    } catch {
      alert('이름 변경 실패');
    }
  };

  // — 검색 (클라이언트)
  const handleSearch = () => {
    if (!searchText.trim()) {
      setSearchResults([]);
      setSearchActive(false);
      return;
    }

    let candidates;
    if (currentUserRole === 'ROLE_Teacher') {
      candidates = files.filter(f => f.uploaderRole === 'ROLE_Teacher');
    } else if (currentUserRole === 'ROLE_Student') {
      candidates = files.filter(f => {
        if (f.uploaderRole === 'ROLE_Teacher') return true;
        if (f.uploaderRole === 'ROLE_Student' && f.uploaderId === currentUserId) return true;
        return false;
      });
    } else {
      candidates = files;
    }

    const results = candidates.filter(
      f => typeof f.name === 'string' && f.name.includes(searchText.trim())
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

  // — 현재 경로에 해당하는 “화면에 뿌릴 파일” 필터링
  const displayFolders = folders.filter(
    f => JSON.stringify(f.path) === JSON.stringify(currentPath) && Boolean(f.name)
  );

  const displayFiles = files.filter(f => {
    if (JSON.stringify(f.path) !== JSON.stringify(currentPath)) {
      return false;
    }
    if (f.uploaderRole === 'ROLE_Teacher') {
      return true;
    }
    if (f.uploaderRole === 'ROLE_Student') {
      return currentUserRole === 'ROLE_Student' && f.uploaderId === currentUserId;
    }
    return true;
  });

  const sortedFolders = sortOrder === 'name'
    ? [...displayFolders].sort((a, b) => a.name.localeCompare(b.name, 'ko'))
    : displayFolders;

  const sortedFiles = sortOrder === 'name'
    ? [...displayFiles].sort((a, b) => a.name.localeCompare(b.name, 'ko'))
    : displayFiles;

  // ── 사이드바 재귀 렌더링 함수 (수정됨) ──
  const renderTree = (path = [], depth = 0) => {
    const key = JSON.stringify(path);
    const subsF = folders.filter(f => JSON.stringify(f.path) === key&&Boolean(f.name));
    const subsI = files.filter(f => JSON.stringify(f.path) === key&&Boolean(f.name));
    if (!subsF.length && !subsI.length) return null;

    return (
      <ul>
        {subsF.map(f => {
          const childKey = JSON.stringify([...path, f.name]);
          return (
            <li key={f.id} className="folder-node" style={{paddingLeft: depth *16+'px'}}>
              <div
                onClick={() => {
                  toggleExpand(childKey);   // → “폴더 아래 드롭다운 펼치기/접기”
                  handleFolderClick(f);     // → “메인 화면을 해당 폴더(경로)로 이동”
                }}
              >
                <img src="/mini_folder.png" className="sidebar-icon" alt="folder" />
                <span>{f.name}</span>
              </div>

              {/* → isExpanded(childKey)이면 재귀적으로 하위 트리 그리기 */}
              {isExpanded(childKey) && renderTree([...path, f.name], depth + 1)}
            </li>
          );
        })}

        {subsI.map(fi => (
          <li
            key={fi.id}
            className="file-node"
            style={{ paddingLeft: depth*16+'px'}}
            onClick={() => handleFileDoubleClick(fi)}
          >
            <img src="/mini_file.png" className="sidebar-icon" alt="file" />
            <span>{fi.name}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="archive-container">
      {/* 네비게이션 바 */}
      <nav className="navbar">
        <h1 className="logo" onClick={() => navigate('/')}>
          <span className="edu">Edu</span>
          <span className="ve">'ve</span>
          <span className="com">.com</span>
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

      {/* 본문: 사이드바 + 메인 */}
      <div className="archive-body">
        {/* 사이드바 */}
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

          { !searchActive && (
            // ↓ “전체 트리”를 처음부터 재귀적으로 렌더링
            <div className="folder-tree">
              {renderTree()}  
            </div>
          )}
        </aside>

        {/* 메인 영역 */}
        <main className="archive-main">
          {/* breadcrumb + 정렬 */}
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
                    onClick={() => setCurrentPath(path => path.slice(0, i + 1))}
                  >
                    {' / '}{p}
                  </span>
                ))}
              </>
            )}
            <button className="sort-toggle" onClick={() => setSortMenuOpen(o => !o)}>정렬 ▼</button>
            {sortMenuOpen && (
              <div className="sort-dropdown">
                <button onClick={() => { setSortOrder(null); setSortMenuOpen(false); }}>
                  {sortOrder === null ? '✔ ' : ''}기본순
                </button>
                <button onClick={() => { setSortOrder('latest'); setSortMenuOpen(false); }}>
                  {sortOrder === 'latest' ? '✔ ' : ''}최신순
                </button>
                <button onClick={() => { setSortOrder('name'); setSortMenuOpen(false); }}>
                  {sortOrder === 'name' ? '✔ ' : ''}가나다순
                </button>
              </div>
            )}
          </div>

          {/* 메인: 현재 경로에 속한 “폴더” 목록 */}
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

            {sortedFolders.map(f => (
              <div
                key={f.id}
                className="folder-box"
                onClick={() => handleFolderClick(f)}
                onContextMenu={e => { e.preventDefault(); handleDeleteFolder(f.id); }}
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

          {/* 메인: 현재 경로에 속한 “파일” 목록 */}
          <div className="file-list">
            {displayFiles.length === 0 && displayFolders.length === 0 && !searchActive && (
              <div className="no-results"></div>
            )}
            {sortedFiles.map(file => (
              <div key={file.id} className="file-box" >
                <img src="/pdf-thumbnail.png" className="file-thumbnail" alt="file" />

                <div className="file-name-with-toggle">
                  <div className="file-name">{file.name}</div>

                  <div className="file-actions">
                  <button
                    className="dropdown-toggle clean-toggle"
                    onClick={() =>
                      setDropdownOpenId(dropdownOpenId === file.id ? null : file.id)
                    }
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      marginLeft: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    aria-label="더보기"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      style={{
                        width: '18px',
                        height: '18px',
                        color: '#444',
                      }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </button>


                    {dropdownOpenId === file.id && (
                      <div className="dropdown-menu">
                        <button onClick={() => handleRenameClick(file)}> 이름 변경</button>
                        <button onClick={() => handleMoveClick(file.id, null)}> 이동</button>
                        <button onClick={() => handleDeleteClick(file.id)}> 삭제</button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="file-uploader">
                  {file.uploaderName}님 업로드
                </div>
              </div>
            ))}
          </div>

          {/* PDF 미리보기 모달 */}
          {previewFileUrl && (
            <div className="archive-modal-overlay" onClick={closePreview}>
              <div className="archive-modal-content" onClick={e => e.stopPropagation()}>
                <iframe src={previewFileUrl} title="PDF Preview" style={{ border: 'none' }} />
                <button className="archive-close-btn" onClick={closePreview}>닫기</button>
              </div>
            </div>
          )}

          {fileMoveModalOpen && (
            <div className="modal-overlay" onClick={() => setFileMoveModalOpen(false)}>
              <div className="modal-content move-modal" onClick={e => e.stopPropagation()}>
                <h3>이동할 폴더 선택</h3>
                
                <ul className="folder-selection-list">
                  {moveFolders.map(folder => (
                    <li key={folder.folderId} className="folder-item">
                      <div
                        onClick={() => {
                          setMoveFolderStack(prev => [...prev, {
                            id: folder.folderId,
                            name: folder.folderName
                          }]);
                          loadMoveFolderContents(folder.folderId);
                        }}
                        className="folder-name-clickable folder-flex-row"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="move-folder-icon" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" />
                        </svg>
                        <span>{folder.folderName}</span>
                      </div>
                      <button
                        className="move-confirm-btn"
                        onClick={() => confirmFileMove(folder.folderId)}
                      >
                        이동
                      </button>
                    </li>
                  ))}
                </ul>

                {moveFolderStack.length > 0 && (
                  <div className="move-path">
                    현재 경로: /
                    {moveFolderStack.map(p => p.name).join(' / ')}
                  </div>
                )}

                <button className="modal-close-btn" onClick={() => setFileMoveModalOpen(false)}>
                  닫기
                </button>
              </div>
            </div>
          )}

          {/* ✅ 삭제 확인 모달 */}
          {deleteModalOpen && (
            <div className="modal-overlay" onClick={() => setDeleteModalOpen(false)}>
              <div className="modal-content delete-modal small" onClick={e => e.stopPropagation()}>
                <h3> 정말 삭제할까요? 🗑️</h3>
                <p>이 작업은 되돌릴 수 없습니다.</p>
                <div className="modal-actions">
                  <button onClick={confirmDelete}>삭제하기</button>
                  <button onClick={() => setDeleteModalOpen(false)}>취소</button>
                </div>
              </div>
            </div>
          )}

          {/* ✅ 이름 변경 모달 추가 위치 */}
          {renameModalOpen && (
            <div className="modal-overlay" onClick={() => setRenameModalOpen(false)}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h3>이름 변경</h3>
                <input
                  className="rename-input"
                  value={renameInput}
                  onChange={e => setRenameInput(e.target.value)}
                />
                <div className="modal-actions">
                  <button onClick={confirmRename}>확인</button>
                  <button onClick={() => setRenameModalOpen(false)}>취소</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
