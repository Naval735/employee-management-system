import React from 'react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  toggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <header className="navbar navbar-expand bg-white border-bottom sticky-top shadow-sm px-3">
      <div className="d-flex align-items-center me-auto">
        <button
          className="btn btn-light border-0 me-3 d-lg-none"
          type="button"
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <i className="bi bi-list fs-4"></i>
        </button>
        <span className="navbar-brand fw-bold text-primary fs-5 mb-0 d-flex align-items-center">
          <i className="bi bi-person-badge-fill me-2 fs-4"></i>
          EmployeeHub
        </span>
      </div>

      <div className="d-flex align-items-center ms-auto">
        {user && (
          <div className="dropdown">
            <button
              className="btn btn-light dropdown-toggle d-flex align-items-center border-0 bg-transparent py-1 px-2"
              type="button"
              id="userDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <div
                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2 fw-bold"
                style={{ width: '36px', height: '36px', fontSize: '14px' }}
              >
                {user.username.substring(0, 2).toUpperCase()}
              </div>
              <div className="text-start d-none d-sm-block me-2">
                <div className="fw-semibold lh-1 text-dark" style={{ fontSize: '14px' }}>
                  {user.fullName || user.username}
                </div>
                <small className="text-muted text-uppercase" style={{ fontSize: '10px' }}>
                  {user.role}
                </small>
              </div>
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2" aria-labelledby="userDropdown">
              <li>
                <div className="dropdown-header">
                  Signed in as <strong>{user.username}</strong>
                </div>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <a className="dropdown-item d-flex align-items-center" href="/profile">
                  <i className="bi bi-person me-2 text-primary"></i> Profile
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <button className="dropdown-item d-flex align-items-center text-danger" onClick={logout}>
                  <i className="bi bi-box-arrow-right me-2"></i> Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
