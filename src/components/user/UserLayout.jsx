/**
 * User Layout Component - Layout with top navbar and collapsible sidebar
 */

import { UserTopNavbar } from './UserTopNavbar';
import { UserSidebar } from './UserSidebar';
import { SidebarProvider, useSidebar } from '@/context/SidebarContext';

// eslint-disable-next-line react/prop-types
const UserLayoutContent = ({ children }) => {
  const { isCollapsed } = useSidebar();
  const mainMarginLeft = isCollapsed ? 'ml-16' : 'ml-64';

  return (
    <div className="user-dashboard min-h-screen bg-[#0F1117] font-sans flex flex-col">
      {/* Top Navbar */}
      <UserTopNavbar />

      {/* Sidebar */}
      <UserSidebar />

      {/* Main Content */}
      <main className={`flex-1 ${mainMarginLeft} pt-16 md:pt-20 overflow-x-hidden font-sans transition-all duration-300 pb-0`} style={{ width: isCollapsed ? 'calc(100% - 4rem)' : 'calc(100% - 16rem)' }}>
        <div className="w-full max-w-full p-6 box-border min-h-[calc(100vh-4rem-200px)] md:min-h-[calc(100vh-5rem-200px)]">
          {children}
        </div>
      </main>
    </div>
  );
};

// eslint-disable-next-line react/prop-types
export const UserLayout = ({ children }) => {
  return (
    <SidebarProvider>
      <UserLayoutContent>{children}</UserLayoutContent>
    </SidebarProvider>
  );
};

export default UserLayout;
