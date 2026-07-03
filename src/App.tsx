import './App.css'
import {Navigate, Route, Routes} from "react-router-dom";
import Login from './pages/auth/Login.tsx';
import Register from './pages/auth/Register.tsx';
import Home from './pages/user/Home.tsx';
import UserList from './pages/admin/UserList.tsx';
import BookList from './pages/admin/BookList.tsx';
import ProtectedRoute from "@/components/ProtectedRoute";
import BorrowedList from './pages/admin/BorrowsList.tsx';
import UserLayout from './layouts/UserLayout.tsx';
import DetailBook from './pages/user/DetailBook.tsx';

function Books() {
  return (
    <UserLayout>
      <div className="p-8">Books coming soon</div>
    </UserLayout>
  );
}
function Cart() {
  return (
    <UserLayout>
      <div className="p-8">Cart coming soon</div>
    </UserLayout>
  );
}
function Profile() {
  return (
    <UserLayout>
      <div className="p-8">Profile coming soon</div>
    </UserLayout>
  );
}


export default function App() {
return (
  <Routes>
    {/* Auth */}
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    {/* User Page */}
    <Route path="/" element={<Home />} />
    <Route path="/books" element={<Books />} />
    <Route
      path="/cart"
      element={
        <ProtectedRoute>
          {" "}
          <Cart />{" "}
        </ProtectedRoute>
      }
    />
    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          {" "}
          <Profile />
        </ProtectedRoute>
      }
    />
    <Route path="/books/:id" element={<DetailBook />} />

    {/* Admin Page */}
    <Route path="/admin/users" element={<UserList />} />
    <Route path="/admin/books" element={<BookList />} />
    <Route
      path="admin/loans"
      element={
        <ProtectedRoute>
          {" "}
          <BorrowedList />{" "}
        </ProtectedRoute>
      }
    />
    <Route path="/admin" element={<Navigate to="/admin/loans" replace />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
}

