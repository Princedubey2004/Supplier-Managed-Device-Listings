
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import SupplierDashboard from './pages/SupplierDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';

const ProtectedRoute = ({ children, role }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" />;
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
        path="/employee"
        element={
          <ProtectedRoute role="EMPLOYEE">
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={
        user ? (user.role === 'SUPPLIER' ? <Navigate to="/supplier" /> : <Navigate to="/employee" />) : <Navigate to="/login" />
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
