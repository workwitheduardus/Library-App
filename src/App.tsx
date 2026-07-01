import './App.css'
import {Navigate, Route, Routes} from "react-router-dom";
import Login from './pages/auth/Login.tsx';

function App() {
return (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/books" element={<div>Books Page</div>} />
    <Route path="/admin" element={<div>Admin Page</div>} />
    <Route path="*" element={<Navigate to="/login" />} />
  </Routes>
);
}

export default App
