import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import MainPage from "./pages/MainPage";
import Signup from "./pages/Signup";
import TeacherSignup from "./pages/TeacherSignup";
import StudentSignup from "./pages/StudentSignup";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import ChatPage from "./pages/ChatPage";
import ArchivePage from "./pages/ArchivePage";
import CharacterPage from "./pages/CharacterPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />

        {/* 그 외의 정상적인 경로 */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup/teacher" element={<TeacherSignup />} />
        <Route path="/signup/student" element={<StudentSignup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/materials" element={<ArchivePage />} />
        <Route path="/character" element={<CharacterPage />} />

        {/* ✅ 마지막에만 와일드카드 리다이렉트 추가 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;





