import { useEffect, useState } from "react";
import PrincipalLayout from "../components/PrincipalLayout.jsx";
import { userService } from "../services/userService.js";
import { 
  Search, 
  Filter, 
  Trash2, 
  Eye, 
  User as UserIcon, 
  ChevronLeft, 
  ChevronRight,
  Circle,
  X,
  Mail,
  Shield,
  Briefcase,
  UserCheck,
  Calendar,
  Upload
} from "lucide-react";
import LoadingState from "../components/LoadingState.jsx";
import ImportUsersModal from "../components/ImportUsersModal.jsx";
import { toast } from "react-hot-toast";

const formatDate = (date, options = { dateStyle: 'medium' }) => {
  return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
};

const RoleBadge = ({ role }) => {
  const styles = {
    principal: "bg-indigo-50 text-indigo-700 border-indigo-100",
    hod: "bg-purple-50 text-purple-700 border-purple-100",
    professor: "bg-emerald-50 text-emerald-700 border-emerald-100",
    student: "bg-amber-50 text-amber-700 border-amber-100"
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border capitalize ${styles[role] || "bg-gray-50"}`}>
      {role}
    </span>
  );
};

const UserDetailsModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">User Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold border-4 border-indigo-50 shadow-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{user.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <RoleBadge role={user.role} />
                <span className="text-gray-300">•</span>
                <span className="text-sm font-medium text-gray-500">{user.department}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <Mail className="w-3 h-3" /> Email Address
              </p>
              <p className="text-sm font-bold text-gray-700 truncate">{user.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <Shield className="w-3 h-3" /> Role Type
              </p>
              <p className="text-sm font-bold text-gray-700 capitalize">{user.role}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <Briefcase className="w-3 h-3" /> Department
              </p>
              <p className="text-sm font-bold text-gray-700">{user.department}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <UserCheck className="w-3 h-3" /> Reporting To
              </p>
              <p className="text-sm font-bold text-gray-700">
                {user.reportingTo ? `${user.reportingTo.name} (${user.reportingTo.role})` : "System"}
              </p>
            </div>
            <div className="col-span-2 space-y-1 pt-2 border-t border-gray-200">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <Calendar className="w-3 h-3" /> Account Created
              </p>
              <p className="text-sm font-bold text-gray-700">
                {formatDate(user.createdAt, { dateStyle: 'full' })}
              </p>
            </div>
          </div>

          <div className="pt-4">
             <button 
                onClick={onClose}
                className="w-full py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
              >
                Close Profile
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConfirmDeleteModal = ({ isOpen, user, onClose, onConfirm, busy }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto border border-red-100">
          <Trash2 className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Delete Account?</h2>
          <p className="text-gray-500 mt-2 text-sm leading-relaxed">
            Are you sure you want to delete <span className="font-bold text-gray-700">{user?.name}</span>? 
            This action is permanent and will remove all their reporting relationships.
          </p>
        </div>
        <div className="flex flex-col gap-3 pt-2">
          <button 
            disabled={busy}
            onClick={onConfirm}
            className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200 disabled:opacity-50"
          >
            {busy ? "Deleting..." : "Permanently Delete"}
          </button>
          <button 
            disabled={busy}
            onClick={onClose}
            className="w-full py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const AllUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, pages: 1 });
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ role: "", department: "" });
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const fetchUsers = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await userService.getAllUsers({
        page: pageNumber,
        limit: 10,
        search,
        role: filters.role,
        department: filters.department
      });
      setUsers(res.users);
      setPagination(res.pagination);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  // Trigger search/filter with debounce logic (manual simplified)
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchUsers(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search, filters]);

  const handleDelete = async () => {
    if (!userToDelete) return;
    setBusy(true);
    try {
      await userService.deleteUser(userToDelete._id);
      setUserToDelete(null);
      fetchUsers(pagination.page);
    } catch (err) {
      alert("Failed to delete user");
    } finally {
      setBusy(false);
    }
  };

  return (
    <PrincipalLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Institutional Directory</h1>
            <p className="text-gray-500 mt-1">Global management of HODs, Faculty, and Students.</p>
          </div>
          <div className="flex items-center gap-3">
             <button 
                onClick={() => setIsImportModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl font-bold shadow-sm hover:shadow-md hover:border-gray-200 transition-all text-sm text-gray-700"
             >
                <Upload className="w-5 h-5 text-indigo-600" />
                Bulk Import
             </button>
             <div className="bg-indigo-600 text-white px-5 py-2.5 rounded-2xl font-bold shadow-lg shadow-indigo-100 text-sm flex items-center gap-2">
                <UserIcon className="w-4 h-4" />
                {pagination.total} Total Users
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name, email, or department..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-gray-100 rounded-2xl py-3.5 pl-12 pr-6 text-sm shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select 
              value={filters.role}
              onChange={(e) => setFilters({...filters, role: e.target.value})}
              className="w-full bg-white border border-gray-100 rounded-2xl py-3.5 pl-10 pr-6 text-sm shadow-sm appearance-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all cursor-pointer"
            >
              <option value="">All Roles</option>
              <option value="hod">HODs</option>
              <option value="professor">Professors</option>
              <option value="student">Students</option>
            </select>
          </div>
          <div className="relative">
            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input 
              placeholder="Department..."
              value={filters.department}
              onChange={(e) => setFilters({...filters, department: e.target.value})}
              className="w-full bg-white border border-gray-100 rounded-2xl py-3.5 pl-10 pr-6 text-sm shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-[32px] shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                  <th className="px-8 py-5">User Identity</th>
                  <th className="px-6 py-5">Role</th>
                  <th className="px-6 py-5">Department</th>
                  <th className="px-6 py-5">Reporting Structure</th>
                  <th className="px-6 py-5">Date Joined</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                   Array(3).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan="6" className="px-8 py-6">
                        <div className="h-10 bg-gray-50 rounded-xl w-full"></div>
                      </td>
                    </tr>
                   ))
                ) : users.length > 0 ? (
                  users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-700 font-bold border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-gray-900 leading-none mb-1 truncate">{u.name}</p>
                            <p className="text-gray-400 text-xs truncate">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <RoleBadge role={u.role} />
                      </td>
                      <td className="px-6 py-4">
                         <span className="text-sm font-medium text-gray-600">{u.department}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs">
                           <Circle className="w-2 h-2 fill-gray-200 text-gray-200" />
                           <p className="text-gray-500 font-medium">To: {u.reportingTo?.name || "System"}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-bold text-gray-400">{formatDate(u.createdAt, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setSelectedUser(u)}
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-indigo-100"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => setUserToDelete(u)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-red-100"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-24 text-center">
                      <p className="text-gray-500 font-medium font-bold">No users available for the current filter.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {pagination.pages > 1 && (
            <div className="mt-auto px-8 py-6 border-t border-gray-50 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Page <span className="font-bold text-gray-900">{pagination.page}</span> of <span className="font-bold text-gray-900">{pagination.pages}</span>
              </p>
              <div className="flex items-center gap-2">
                <button 
                  disabled={pagination.page === 1}
                  onClick={() => fetchUsers(pagination.page - 1)}
                  className="p-2 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <button 
                  disabled={pagination.page === pagination.pages}
                  onClick={() => fetchUsers(pagination.page + 1)}
                  className="p-2 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <UserDetailsModal 
        user={selectedUser} 
        onClose={() => setSelectedUser(null)} 
      />
      
      <ConfirmDeleteModal 
        isOpen={!!userToDelete}
        user={userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDelete}
        busy={busy}
      />

      <ImportUsersModal 
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onUploadSuccess={() => fetchUsers(1)}
      />
    </PrincipalLayout>
  );
};

export default AllUsersPage;
