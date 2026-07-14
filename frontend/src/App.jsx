import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import TeamManagement from "./pages/TeamManagement";
import PersonalTasks from "./pages/PersonalTasks";
import TeamTasks from "./pages/TeamTasks";
import Profile from "./Profile";



function App() {
  return (
    <Routes>

      {/* Login */}
      <Route path="/" element={<Login />} />

      {/* Signup */}
      <Route path="/signup" element={<Signup />} />

      {/* Admin Dashboard */}
      <Route path="/admin" element={<AdminDashboard />} />

      {/* Manage Teams */}
      <Route path="/teams" element={<TeamManagement />} />

      {/* User Dashboard */}
      <Route path="/dashboard" element={<UserDashboard />} />

      {/* Invalid URL */}
      <Route path="*" element={<Navigate to="/" replace />} />

      <Route path="/personal-tasks" element={<PersonalTasks />} />
      <Route path="/team-tasks" element={<TeamTasks />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/team-tasks" element={<TeamTasks />} />
      <Route path="/personal-tasks" element={<PersonalTasks />} />  

    </Routes>
  );
}

export default App;