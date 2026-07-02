import './App.css'
import {Navigate, Route, Routes} from "react-router-dom";
import Login from './pages/auth/Login.tsx';
import UserList from './pages/admin/UserList.tsx';

function App() {
return (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/admin/users" element={<UserList />} />
    <Route path="/books" element={<div>Books Page</div>} />
    <Route path="/admin" element={<div>Admin Page</div>} />
    <Route path="*" element={<Navigate to="/login" />} />
  </Routes>
);
}

export default App
