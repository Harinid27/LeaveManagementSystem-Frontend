import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  UserSquare2, 
  ClipboardCheck, 
  ClipboardList,
  BarChart3, 
  UserCircle,
  GraduationCap
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const navConfig = {
  principal: [
    { name: "Dashboard", to: "/principal-dashboard", icon: LayoutDashboard },
    { name: "Manage HODs", to: "/hod-management", icon: UserSquare2 },
    { name: "All Users", to: "/users", icon: Users },
    { name: "Leave Approvals", to: "/pending-approvals", icon: ClipboardCheck },
    { name: "Hierarchy", to: "/hierarchy", icon: GraduationCap },
    { name: "Analytics", to: "/analytics", icon: BarChart3 },
    { name: "Profile", to: "/profile", icon: UserCircle },
  ],
  hod: [
    { name: "Dashboard", to: "/hod-dashboard", icon: LayoutDashboard },
    { name: "Manage Staff", to: "/manage-staff", icon: Users },
    { name: "Leave Approvals", to: "/pending-approvals", icon: ClipboardCheck },
    { name: "My Leaves", to: "/leaves/my", icon: ClipboardList },
    { name: "Profile", to: "/profile", icon: UserCircle },
  ],
  professor: [
    { name: "Dashboard", to: "/prof-dashboard", icon: LayoutDashboard },
    { name: "Manage Students", to: "/prof/students", icon: Users },
    { name: "Leave Approvals", to: "/prof/student-leaves", icon: ClipboardCheck },
    { name: "My Leaves", to: "/prof/my-leaves", icon: ClipboardList },
    { name: "Profile", to: "/profile", icon: UserCircle },
  ],
  student: [
    { name: "Dashboard", to: "/student-dashboard", icon: LayoutDashboard },
    { name: "My Leaves", to: "/leaves", icon: ClipboardList },
    { name: "Profile", to: "/profile", icon: UserCircle },
  ]
};

const Sidebar = () => {
  const { user } = useAuth();
  const navItems = navConfig[user?.role] || [];

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 hidden md:flex flex-col z-20">
      <div className="p-6 border-b border-gray-100 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">L</span>
        </div>
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">LMS Admin</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? "bg-indigo-50 text-indigo-700 shadow-sm" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <div className="bg-indigo-600 rounded-2xl p-4 text-white shadow-lg shadow-indigo-200">
          <p className="text-xs font-medium opacity-80 mb-1 uppercase tracking-wider">System Status</p>
          <p className="text-sm font-semibold capitalize">{user?.role} Active</p>
          <div className="mt-3 w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
            <div className="bg-white h-full w-[100%] rounded-full"></div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
