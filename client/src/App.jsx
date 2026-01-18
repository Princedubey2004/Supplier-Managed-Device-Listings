
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import SupplierDashboard from './pages/SupplierDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EditDevice from './pages/supplier/EditDevice';
import StockDevice from './pages/supplier/StockDevice';
import OfferDevice from './pages/supplier/OfferDevice';

const ProtectedRoute = ({ children, role }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/" />;
  if (role && user.role !== role) return <Navigate to="/" />;

  return children;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/supplier"
        element={
          <ProtectedRoute role="SUPPLIER">
            <SupplierDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/supplier/device/new"
        element={
          <ProtectedRoute role="SUPPLIER">
            <EditDevice />
          </ProtectedRoute>
        }
      />
      <Route
        path="/supplier/device/:id/edit"
        element={
          <ProtectedRoute role="SUPPLIER">
            <EditDevice />
          </ProtectedRoute>
        }
      />
      <Route
        path="/supplier/device/:id/stock"
        element={
          <ProtectedRoute role="SUPPLIER">
            <StockDevice />
          </ProtectedRoute>
        }
      />
      <Route
        path="/supplier/device/:id/offer"
        element={
          <ProtectedRoute role="SUPPLIER">
            <OfferDevice />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employee"
        element={
          <ProtectedRoute role="EMPLOYEE">
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={
        user ? (
          user.role === 'SUPPLIER' ? <Navigate to="/supplier" /> : <Navigate to="/employee" />
        ) : (
          <LandingPage />
        )
      } />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
