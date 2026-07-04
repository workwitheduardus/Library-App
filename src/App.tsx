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
import Category from './pages/user/Category.tsx';
import BookByAuthor from './pages/user/BookByAuthor.tsx';
import Checkout from './pages/user/Checkout.tsx';
import Success from './pages/user/Success.tsx';

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
    <Route path="/books" element={<Category />} />
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
    <Route path="/authors/:id/books" element={<BookByAuthor />} />
    <Route
      path="/checkout"
      element={
        <ProtectedRoute>
          <Checkout />
        </ProtectedRoute>
      }
    />
    <Route
      path="/success"
      element={
        <ProtectedRoute>
          <Success />
        </ProtectedRoute>
      }
    />
    <Route
      path="/loans"
      element={
        <ProtectedRoute>
          <BorrowedList />
        </ProtectedRoute>
      }
    />

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

