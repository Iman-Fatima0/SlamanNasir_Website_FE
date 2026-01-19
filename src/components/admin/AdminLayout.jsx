/**
 * Admin Layout Component - Enterprise-grade layout with top navbar and collapsible sidebar
 */

import { AdminTopNavbar } from './AdminTopNavbar';
import { AdminSidebar } from './AdminSidebar';
import { Footer } from '@/components/layout/Footer';
import { SidebarProvider, useSidebar } from '@/context/SidebarContext';

// eslint-disable-next-line react/prop-types
const AdminLayoutContent = ({ children }) => {
  const { isCollapsed } = useSidebar();
  const mainMarginLeft = isCollapsed ? 'ml-16' : 'ml-64';

  return (
    <div className="admin-dashboard min-h-screen bg-[#0F1117] font-sans flex flex-col">
      {/* Top Navbar */}
      <AdminTopNavbar />

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className={`flex-1 ${mainMarginLeft} pt-16 md:pt-20 overflow-x-hidden font-sans transition-all duration-300 pb-0`} style={{ width: isCollapsed ? 'calc(100% - 4rem)' : 'calc(100% - 16rem)' }}>
        <div className="w-full max-w-full p-6 box-border min-h-[calc(100vh-4rem-200px)] md:min-h-[calc(100vh-5rem-200px)]">
          {children}
        </div>
      </main>

      {/* Footer */}
      <div className={`${mainMarginLeft} transition-all duration-300`} style={{ width: isCollapsed ? 'calc(100% - 4rem)' : 'calc(100% - 16rem)' }}>
        <Footer />
      </div>
    </div>
  );
};

// eslint-disable-next-line react/prop-types
export const AdminLayout = ({ children }) => {
  return (
    <SidebarProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SidebarProvider>
  );
};

export default AdminLayout;

