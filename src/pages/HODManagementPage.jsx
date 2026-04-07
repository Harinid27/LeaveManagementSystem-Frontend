import { useEffect, useState, useMemo } from "react";
import PrincipalLayout from "../components/PrincipalLayout.jsx";
import { userService } from "../services/userService.js";
import { 
  Plus, 
  Search, 
  Trash2, 
  UserPlus, 
  X, 
  AlertCircle,
  MoreVertical,
  Filter
} from "lucide-react";
import LoadingState from "../components/LoadingState.jsx";

const CreateHODModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "", department: "", role: "hod" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await userService.createUser(form);
      onSuccess();
      onClose();
      setForm({ name: "", email: "", password: "", department: "", role: "hod" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create HOD");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">Create New HOD</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm flex items-center gap-2 border border-red-100">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
            <input 
              required
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              placeholder="e.g. Dr. Jane Smith"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email</label>
              <input 
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                placeholder="jane@college.edu"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Department</label>
              <input 
                required
                value={form.department}
                onChange={(e) => setForm({...form, department: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                placeholder="Computer Science"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Default Password</label>
            <input 
              required
              type="password"
              value={form.password}
              onChange={(e) => setForm({...form, password: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <div className="pt-4">
            <button 
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? "Creating..." : <><UserPlus className="w-5 h-5" /> Create HOD Account</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const HODManagementPage = () => {
  const [hods, setHods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);

  const fetchHods = async () => {
    try {
      const data = await userService.getUsers({ role: "hod" });
      setHods(data.users || []);
    } catch (err) {
      console.error("Failed to fetch HODs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHods();
  }, []);

  const filteredHods = useMemo(() => {
    return hods.filter(h => 
      h.name.toLowerCase().includes(search.toLowerCase()) || 
      h.email.toLowerCase().includes(search.toLowerCase()) ||
      h.department.toLowerCase().includes(search.toLowerCase())
    );
  }, [hods, search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this HOD? This action cannot be undone.")) return;
    setIsDeleting(id);
    try {
      await userService.deleteUser(id);
      await fetchHods();
    } catch (err) {
      alert("Failed to delete HOD");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <PrincipalLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Manage HODs</h1>
            <p className="text-gray-500 mt-1">Add, view, and manage department heads across the institution.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
          >
            <Plus className="w-5 h-5" />
            Add New HOD
          </button>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden min-h-[400px] flex flex-col">
          {/* Table Toolbar */}
          <div className="p-4 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by name, email, or department..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-500">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-50 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Name & Email</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="p-12"><LoadingState label="Fetching HOD list..." /></td>
                  </tr>
                ) : filteredHods.length > 0 ? (
                  filteredHods.map((hod) => (
                    <tr key={hod._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                            {hod.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 leading-none mb-1">{hod.name}</p>
                            <p className="text-gray-500 font-medium">{hod.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg font-medium border border-gray-200">
                          {hod.department}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-1.5 text-green-600 font-bold">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                          Active
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                        {new Date(hod.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(hod._id)}
                            disabled={isDeleting === hod._id}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            {isDeleting === hod._id ? (
                              <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Trash2 className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="max-w-xs mx-auto text-gray-400">
                        <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p className="font-bold text-gray-500">No HODs found</p>
                        <p className="text-sm mt-1">Try adjusting your search criteria or add a new HOD.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Placeholder */}
          <div className="p-4 border-t border-gray-50 flex items-center justify-between text-sm text-gray-500 font-medium">
            <p>Showing {filteredHods.length} HODs</p>
            <div className="flex items-center gap-2">
              <button disabled className="px-4 py-2 border border-gray-100 rounded-xl opacity-50 cursor-not-allowed">Previous</button>
              <button disabled className="px-4 py-2 border border-gray-100 rounded-xl opacity-50 cursor-not-allowed">Next</button>
            </div>
          </div>
        </div>
      </div>

      <CreateHODModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchHods} 
      />
    </PrincipalLayout>
  );
};

export default HODManagementPage;
