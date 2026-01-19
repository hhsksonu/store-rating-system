import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Signup from './pages/Signup';

import AdminDashboard from './components/Admin/AdminDashboard';
import AdminUsers from './components/Admin/AdminUsers';
import AdminStores from './components/Admin/AdminStores';
import AddUser from './components/Admin/AddUser';
import AddStore from './components/Admin/AddStore';

import UserStores from './components/User/UserStores';
import UpdatePassword from './components/User/UpdatePassword';

import StoreOwnerDashboard from './components/StoreOwner/StoreOwnerDashboard';

import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!user) {
      return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUsers user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/stores"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminStores user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/add-user"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AddUser user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/add-store"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AddStore user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/stores"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserStores user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/update-password"
            element={
              <ProtectedRoute allowedRoles={['user', 'admin', 'store_owner']}>
                <UpdatePassword user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/store-owner/dashboard"
            element={
              <ProtectedRoute allowedRoles={['store_owner']}>
                <StoreOwnerDashboard user={user} />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;