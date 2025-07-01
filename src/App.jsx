import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import VendorList from './pages/VendorList'
import VendorDetail from './pages/VendorDetail'
import AddEditVendor from './pages/AddEditVendor'
import AddEditReview from './pages/AddEditReview'
import { AuthProvider, useAuth } from './context/AuthContext'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <header style={{ backgroundColor: '#2c7be5', padding: '1rem', color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: '1.5rem' }}>
            LOCAVORE FARMERS PROJECT
          </header>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/vendors"
              element={
                <PrivateRoute>
                  <VendorList />
                </PrivateRoute>
              }
            />
            <Route
              path="/vendors/add"
              element={
                <PrivateRoute>
                  <AddEditVendor />
                </PrivateRoute>
              }
            />
            <Route
              path="/vendors/:id"
              element={
                <PrivateRoute>
                  <VendorDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/vendors/:id/edit"
              element={
                <PrivateRoute>
                  <AddEditVendor />
                </PrivateRoute>
              }
            />
            <Route
              path="/reviews/:id/edit"
              element={
                <PrivateRoute>
                  <AddEditReview />
                </PrivateRoute>
              }
            />
            <Route
              path="/reviews/add"
              element={
                <PrivateRoute>
                  <AddEditReview />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/vendors" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}
