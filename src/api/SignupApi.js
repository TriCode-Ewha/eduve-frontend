// src/api/TeacherSignupApi.js
// src/api/StudentSignupApi.js
import axios from "axios";

const BASE_URL = "https://api.eduve.r-e.kr";

// 선생님 회원가입
export const signupTeacher = async (signupData) => {
  try {
    const response = await axios.post(`${BASE_URL}/join/teacher`, signupData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 학생생 회원가입
export const signupStudent = async (signupData) => {
  try {
    const response = await axios.post(`${BASE_URL}/join/student`, signupData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 아이디 중복 확인
export const checkUsername = async (username) => {
  try {
    const response = await axios.get(`${BASE_URL}/join/check-username`, {
      params: { username }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 이메일 중복 확인
export const checkEmail = async (email) => {
  try {
    const response = await axios.get(`${BASE_URL}/join/check-email`, {
      params: { email }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const UserSettingsModal = ({ userId, onClose }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 회원정보 조회
  useEffect(() => {
    setLoading(true);
    axios.post(`https://api.eduve.r-e.kr/user/${userId}`)
      .then(res => {
        setUserInfo(res.data);
        setNewName(res.data.name);
      })
      .catch(err => {
        setError("회원 정보를 불러오는데 실패했습니다.");
      })
      .finally(() => setLoading(false));
  }, [userId]);

  // 이름 변경
  const handleChangeName = () => {
    setLoading(true);
    axios.patch(`https://api.eduve.r-e.kr/user/${userId}`, { name: newName })
      .then(res => {
        setUserInfo(res.data);
        alert("이름이 변경되었습니다.");
      })
      .catch(() => alert("이름 변경에 실패했습니다."))
      .finally(() => setLoading(false));
  };

  // 회원 탈퇴
  const handleDeleteAccount = () => {
    if (!window.confirm("정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) return;
    setLoading(true);
    axios.delete(`https://api.eduve.r-e.kr/user/${userId}`)
      .then(() => {
        alert("회원 탈퇴가 완료되었습니다.");
        onClose();
        window.location.href = "/";  // 로그아웃 혹은 홈으로 이동
      })
      .catch(() => alert("회원 탈퇴에 실패했습니다."))
      .finally(() => setLoading(false));
  };

  if (loading) return <div className="modal-overlay"><div className="modal-content">로딩 중...</div></div>;

  if (error) return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{error}</p>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>회원 설정</h2>
        {userInfo && (
          <div className="user-info">
            <p><strong>아이디(userId):</strong> {userInfo.userId}</p>
            <p><strong>이름(name):</strong></p>
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="name-input"
            />
            <p><strong>사용자 이름(username):</strong> {userInfo.username}</p>
            <p><strong>이메일(email):</strong> {userInfo.email}</p>
            <p><strong>권한(role):</strong> {userInfo.role}</p>
            <button onClick={handleChangeName} className="btn-primary">이름 변경</button>
            <hr />
            <button onClick={handleDeleteAccount} className="btn-danger">회원 탈퇴</button>
          </div>
        )}
        <button onClick={onClose} className="btn-close">닫기</button>
      </div>
    </div>
  );
};
