import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="container text-center py-5">
      <div className="py-5">
        <i className="bi bi-compass text-primary display-1 mb-3 d-block"></i>
        <h1 className="fw-bold display-4">404 - Page Not Found</h1>
        <p className="text-muted fs-5 mb-4">The page you are looking for does not exist or has been moved.</p>
        <Link to="/dashboard" className="btn btn-primary px-4 py-2 fw-semibold">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
