import { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { 
  Bell, 
  Search, 
  Settings, 
  Menu,
  ChevronDown,
  LogOut,
  User,
  X
} from "lucide-react";
import { Link } from "react-router-dom";

const AppLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`fixed md:static inset-y-0 left-0 z-50 w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out bg-white border-r border-gray-100 shadow-xl md:shadow-none`}>
        <div className="flex flex-col h-full relative">
          {/* Close button for mobile */}
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="absolute right-4 top-6 p-2 hover:bg-gray-100 rounded-xl md:hidden transition-colors text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
          
          <Sidebar />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl md:hidden transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <div className="relative hidden sm:block w-72 lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 font-bold" />
              <input 
                type="text" 
                placeholder="Search resources, students..." 
                className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl py-2.5 pl-11 pr-4 text-sm focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button className="relative p-2.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all group">
              <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-8 w-px bg-gray-100 mx-1"></div>

            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-1.5 hover:bg-gray-50 rounded-2xl transition-all"
              >
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-100">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="hidden lg:block text-left mr-1">
                  <p className="text-sm font-bold text-gray-900 leading-none">{user?.name}</p>
                  <p className="text-[10px] font-bold text-gray-400 mt-1.5 uppercase tracking-wide">{user?.role}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                  <div className="absolute right-0 mt-3 w-60 bg-white rounded-[2rem] shadow-2xl shadow-indigo-100/50 border border-indigo-50/50 p-2 z-50 animate-in zoom-in-95 duration-200 origin-top-right">
                    <div className="px-5 py-4 border-b border-gray-50 mb-1">
                      <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{user?.role} Account</p>
                    </div>
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 rounded-2xl transition-all">
                      <User className="w-4 h-4" /> My Profile
                    </Link>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 rounded-2xl transition-all">
                      <Settings className="w-4 h-4" /> Account Settings
                    </button>
                    <div className="h-px bg-gray-50 my-1"></div>
                    <button 
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-2xl transition-all font-bold"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto w-full max-w-[1600px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
