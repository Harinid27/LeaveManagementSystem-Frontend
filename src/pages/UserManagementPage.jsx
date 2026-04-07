import { useEffect, useMemo, useState } from "react";
import AppLayout from "../components/AppLayout.jsx";
import LoadingState from "../components/LoadingState.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { userService } from "../services/userService.js";
import { Link } from "react-router-dom";
import { UserPlus, Filter, Mail, Shield, User as UserIcon, ArrowRight } from "lucide-react";

const creationMap = {
  principal: ["hod"],
  hod: ["professor"],
  professor: ["student"],
  student: []
};

const visibleRoleMap = {
  principal: ["principal", "hod", "professor", "student"],
  hod: ["hod", "professor", "student"],
  professor: ["professor", "student"],
  student: ["student"]
};

const roleLabels = {
  principal: "Principal",
  hod: "HOD",
  professor: "Professor",
  student: "Student"
};

function UserManagementPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(true);

  const allowedRoles = useMemo(() => creationMap[user?.role] || [], [user?.role]);
  const visibleRoles = useMemo(() => visibleRoleMap[user?.role] || [], [user?.role]);

  const loadUsers = async (role = selectedRole) => {
    setLoading(true);
    const data = await userService.getUsers({ role });
    setUsers(data.users);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers(selectedRole).catch((requestError) => {
      setError(requestError.displayMessage || "Unable to load users");
      setLoading(false);
    });
  }, [selectedRole]);

  const handleCreate = async (payload) => {
    setBusy(true);
    setError("");
    setMessage("");

    try {
      const data = await userService.createUser(payload);
      setMessage(data.message);
      await loadUsers(selectedRole);
    } catch (requestError) {
      setError(requestError.displayMessage || "Unable to create user");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppLayout>
      <section className="space-y-10 animate-in fade-in duration-500 max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Staff Management</h1>
            <p className="text-gray-500 mt-1">
              Viewing all <span className="font-semibold text-indigo-600">{user?.department}</span> department personnel.
            </p>
          </div>
          {allowedRoles.length > 0 && (
            <Link 
              to="/manage-staff/create" 
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all w-fit"
            >
              <UserPlus className="w-5 h-5" />
              Add New Staff
            </Link>
          )}
        </header>

        <div className="grid grid-cols-1 gap-8">
          {/* User List Panel */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="px-8 py-6 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl shadow-sm">
                  <Shield className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 leading-none">Personnel Directory</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">Department wide access</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
                <div className="pl-3 py-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                </div>
                <select 
                  value={selectedRole} 
                  onChange={(event) => setSelectedRole(event.target.value)}
                  className="bg-transparent border-none py-2 pr-8 pl-1 text-sm font-bold text-gray-600 focus:ring-0 outline-none cursor-pointer"
                >
                  <option value="">All Staff Roles</option>
                  {visibleRoles.map((role) => (
                    <option key={role} value={role}>{roleLabels[role]}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex-1">
              {loading ? (
                <div className="py-20">
                  <LoadingState label="Synchronizing directory..." />
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {users.length > 0 ? users.map((entry) => (
                    <div key={entry._id} className="p-6 md:px-8 hover:bg-indigo-50/30 transition-colors group">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-indigo-600 font-bold text-lg shadow-sm group-hover:scale-110 transition-transform">
                            {entry.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-gray-900">{entry.name}</h4>
                              <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                                entry.role === 'hod' ? 'bg-purple-50 text-purple-600 border border-purple-100' :
                                entry.role === 'professor' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                                'bg-emerald-50 text-emerald-600 border border-emerald-100'
                              }`}>
                                {roleLabels[entry.role]}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="flex items-center gap-1 text-xs text-gray-400 font-medium whitespace-nowrap">
                                <Mail className="w-3 h-3" /> {entry.email}
                              </span>
                              <span className="w-1 h-1 bg-gray-200 rounded-full hidden sm:block"></span>
                              <span className="flex items-center gap-1 text-xs text-gray-400 font-medium whitespace-nowrap">
                                <Shield className="w-3 h-3" /> {entry.department}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 ml-16 md:ml-0">
                          <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Reporting Structure</p>
                            <p className="text-xs font-bold text-gray-600 mt-1">
                              {entry.reportingTo ? "Active Tree Verified" : "Direct Entry"}
                            </p>
                          </div>
                          <button className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
                            <ArrowRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="py-20 text-center flex flex-col items-center justify-center">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-gray-100">
                        <UserIcon className="w-10 h-10 text-gray-200" />
                      </div>
                      <h4 className="font-bold text-gray-900">No personnel found</h4>
                      <p className="text-sm text-gray-400 mt-1 max-w-xs mx-auto">Try adjusting your filters or add a new faculty member using the button above.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}

export default UserManagementPage;
