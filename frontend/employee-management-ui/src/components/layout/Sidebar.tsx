import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
  const { user } = useAuth();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'bi-grid-1x2-fill' },
    { path: '/employees', label: 'Employees', icon: 'bi-people-fill' },
    { path: '/departments', label: 'Departments', icon: 'bi-building' },
    { path: '/attendance', label: 'Attendance', icon: 'bi-calendar-check-fill' },
    { path: '/reports', label: 'Reports', icon: 'bi-file-earmark-bar-graph-fill' },
    { path: '/profile', label: 'My Profile', icon: 'bi-person-circle' },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50 d-lg-none"
          style={{ zIndex: 1040 }}
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`bg-dark text-white p-3 flex-shrink-0 ${
          isOpen ? 'd-block' : 'd-none d-lg-block'
        }`}
        style={{
          width: '260px',
          minHeight: 'calc(100vh - 56px)',
          position: isOpen ? 'fixed' : 'relative',
          top: isOpen ? '56px' : '0',
          left: 0,
          zIndex: 1045,
          transition: 'transform 0.3s ease-in-out',
        }}
      >
        <div className="text-uppercase small fw-bold text-muted px-3 mb-2" style={{ letterSpacing: '1px' }}>
          Main Navigation
        </div>

        <nav className="nav nav-pills flex-column gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center px-3 py-2.5 rounded-3 text-white-50 ${
                  isActive ? 'active bg-primary text-white fw-semibold shadow-sm' : 'hover-bg-secondary'
                }`
              }
            >
              <i className={`bi ${item.icon} fs-5 me-3`}></i>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-4 border-top border-secondary px-3 mt-5">
          <div className="d-flex align-items-center text-muted small">
            <i className="bi bi-shield-check text-success me-2 fs-5"></i>
            <div>
              <div className="fw-semibold text-white">System Security</div>
              <div style={{ fontSize: '11px' }}>Role: <span className="badge bg-secondary">{user?.role}</span></div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
