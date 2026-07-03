import './App.css'
import {Navigate, Route, Routes} from "react-router-dom";
import Login from './pages/auth/Login.tsx';
import UserList from './pages/admin/UserList.tsx';
import BookList from './pages/admin/BookList.tsx';
import ProtectedRoute from "@/components/ProtectedRoute";
import BorrowedList from './pages/admin/BorrowsList.tsx';

function App() {
return (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/admin/users" element={<UserList />} />
    <Route path="/admin/books" element={<BookList />} />
    <Route path="/books" element={<div>Loans (coming soon)</div>} />
    < Route path="admin/loans" element={<ProtectedRoute><BorrowedList /></ProtectedRoute>} />
    <Route path="/admin" element={<Navigate to="/admin/users" replace />} />
    <Route path="*" element={<Navigate to="/login" replace />} />
    <Route
      path="/admin/users"
      element={
        <ProtectedRoute>
          <UserList />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/books"
      element={
        <ProtectedRoute>
          <BookList />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/loans"
      element={
        <ProtectedRoute>
          <div>Loans coming soon</div>
        </ProtectedRoute>
      }
    />
  </Routes>
);
}

export default App
