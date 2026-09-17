import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('Admin' | 'HR')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner fullPage message="Authenticating session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="container py-5 text-center">
        <div className="card shadow-sm border-0 mx-auto" style={{ maxWidth: '500px' }}>
          <div className="card-body p-5">
            <i className="bi bi-shield-lock-fill text-danger display-1 mb-3"></i>
            <h3 className="fw-bold">403 - Access Denied</h3>
            <p className="text-muted">You do not have permission to view this resource.</p>
            <a href="/dashboard" className="btn btn-primary mt-2">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
