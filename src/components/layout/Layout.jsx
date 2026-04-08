import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  LayoutDashboard, 
  Package, 
  LifeBuoy, 
  MessageSquare, 
  UserPlus, 
  LogOut, 
  Bell, 
  User, 
  Menu, 
  X 
} from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Inventory', path: '/inventory', icon: Package },
    { name: 'Support Tickets', path: '/support', icon: LifeBuoy },
    { name: 'Communication', path: '/communication', icon: MessageSquare },
    { name: 'Student Registration', path: '/registration', icon: UserPlus },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-gray-900 text-white z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-indigo-400">School ERP</h1>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">Admin Panel</p>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) => 
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-6 left-0 w-full px-4">
          <button 
            onClick={logout}
            className="flex items-center space-x-3 w-full px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Navbar */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            <button 
              className="lg:hidden text-gray-500 hover:text-gray-700"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-semibold text-gray-800">Welcome, {user?.name}</h2>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-all relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
              <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                {user?.name?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
