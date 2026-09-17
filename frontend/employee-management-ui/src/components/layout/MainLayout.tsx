import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="d-flex flex-grow-1">
        <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />
        <main className="flex-grow-1 p-3 p-md-4 overflow-auto">
          <div className="container-fluid max-width-xl px-0">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
