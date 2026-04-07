import { useEffect, useState, useMemo } from "react";
import AppLayout from "../components/AppLayout.jsx";
import { userService } from "../services/userService.js";
import { useAuth } from "../context/AuthContext.jsx";
import LoadingState from "../components/LoadingState.jsx";
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Eye, 
  X, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Mail,
  Calendar,
  Shield,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { Link } from "react-router-dom";

const ManageStaff = () => {
  const { user } = useAuth();
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  
  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modals
  const [viewModal, setViewModal] = useState(null); // stores prof object
  const [editModal, setEditModal] = useState(null); // stores prof object
  const [deleteModal, setDeleteModal] = useState(null); // stores prof object
  
  // Edit Form State
  const [editForm, setEditForm] = useState({ name: "", email: "" });

  const fetchProfessors = async () => {
    setLoading(true);
    try {
      const params = { role: "professor", search };
      const response = await userService.getUsers(params);
      setProfessors(response.users || []);
    } catch (err) {
      setError("Failed to fetch staff directory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProfessors();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await userService.updateUser(editModal._id, editForm);
      setSuccess("Professor updated successfully.");
      setEditModal(null);
      fetchProfessors();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update professor.");
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setBusy(true);
    try {
      await userService.deleteUser(deleteModal._id);
      setSuccess("Professor removed from department.");
      setDeleteModal(null);
      fetchProfessors();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete professor.");
    } finally {
      setBusy(false);
    }
  };

  const openEditModal = (prof) => {
    setEditModal(prof);
    setEditForm({ name: prof.name, email: prof.email });
  };

  return (
    <AppLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Manage Staff</h1>
            <p className="text-gray-500 mt-1">Oversee faculty members within the {user?.department} department.</p>
          </div>
          <Link 
            to="/manage-staff/create" 
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all transition-all"
          >
            <Users className="w-5 h-5" />
            Add Professor
          </Link>
        </header>

        {/* Search & Alerts */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by name or email..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-3 bg-gray-50 text-gray-600 rounded-2xl text-sm font-bold border border-gray-100 hover:bg-white transition-all">
                <Filter className="w-4 h-4" /> Filter
              </button>
            </div>
          </div>

          {success && <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 font-medium flex items-center gap-2 animate-in slide-in-from-top-2"><CheckCircle2 className="w-5 h-5"/> {success}</div>}
          {error && <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 font-medium flex items-center gap-2 animate-in slide-in-from-top-2"><X className="w-5 h-5"/> {error}</div>}
        </div>

        {/* Table Content */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-24"><LoadingState label="Loading staff directory..." /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-50">
                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center w-16">#</th>
                    <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Professor</th>
                    <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contact Info</th>
                    <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Statistics</th>
                    <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {professors.length > 0 ? professors.map((prof, idx) => (
                    <tr key={prof._id} className="hover:bg-indigo-50/20 transition-colors group">
                      <td className="px-8 py-6 text-sm font-bold text-gray-400 text-center">{idx + 1}</td>
                      <td className="px-6 py-6 font-bold text-gray-900 min-w-[240px]">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold group-hover:scale-110 transition-transform">
                            {prof.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 leading-none">{prof.name}</p>
                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold uppercase tracking-wider mt-1.5 inline-block">Faculty</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-sm text-gray-500 min-w-[200px]">
                        <div className="space-y-1">
                          <p className="flex items-center gap-1.5 text-gray-400 font-medium">
                            <Mail className="w-3 h-3" /> {prof.email}
                          </p>
                          <p className="flex items-center gap-1.5 text-gray-400 font-medium">
                            <Calendar className="w-3 h-3" /> Joined {new Date(prof.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-6 min-w-[150px]">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{prof.studentCount || 0}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Assigned Students</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => setViewModal(prof)}
                            className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-indigo-600 transition-all border border-transparent hover:border-indigo-100"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => openEditModal(prof)}
                            className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-amber-600 transition-all border border-transparent hover:border-amber-100"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setDeleteModal(prof)}
                            className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-red-600 transition-all border border-transparent hover:border-red-100"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="py-24 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-gray-100">
                          <Users className="w-10 h-10 text-gray-200" />
                        </div>
                        <h4 className="font-bold text-gray-900">No faculty members found</h4>
                        <p className="text-sm text-gray-400 mt-1">Try adjusting your search or add a new professor above.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* View Details Modal */}
        {viewModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setViewModal(null)}></div>
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-indigo-600 font-bold text-2xl">
                    {viewModal.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{viewModal.name}</h3>
                    <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">{viewModal.role}</p>
                  </div>
                </div>
                <button onClick={() => setViewModal(null)} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</p>
                    <p className="font-bold text-gray-700">{viewModal.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Department</p>
                    <p className="font-bold text-gray-700">{viewModal.department}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Joined Date</p>
                    <p className="font-bold text-gray-700">{new Date(viewModal.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Hierarchy Pos</p>
                    <p className="font-bold text-gray-700">Reports to HOD ({user?.name})</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-gray-900">Enrolled Students</h4>
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold">{viewModal.studentCount || 0} Total</span>
                  </div>
                  {/* Student list placeholder */}
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 italic text-sm text-gray-400 text-center">
                    Students managed by this professor can be viewed in the student directory.
                  </div>
                </div>
              </div>
              <div className="p-6 bg-gray-50/50 border-t border-gray-50 flex justify-end">
                <button 
                  onClick={() => setViewModal(null)}
                  className="px-6 py-2.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all text-sm"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setEditModal(null)}></div>
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Edit Details</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Personnel ID: {editModal._id}</p>
                </div>
                <button onClick={() => setEditModal(null)} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleEditSubmit} className="p-8 space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input 
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    placeholder="Enter full name..."
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 text-sm font-medium outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                  <input 
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    placeholder="e.g. prof@university.edu"
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 text-sm font-medium outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all"
                  />
                </div>
                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setEditModal(null)}
                    className="flex-1 py-3 bg-white border border-gray-200 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition-all text-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={busy}
                    className="flex-1 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all text-sm shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                  >
                    {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {deleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setDeleteModal(null)}></div>
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-8 text-center space-y-6">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto border-2 border-red-100 text-red-600">
                  <AlertTriangle className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-900">Remove Professor?</h3>
                  <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
                    Are you sure you want to remove <span className="font-bold text-gray-700">{deleteModal.name}</span> from the department? This action cannot be undone.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setDeleteModal(null)}
                    className="flex-1 py-4 bg-gray-50 text-gray-600 rounded-2xl font-bold hover:bg-gray-100 transition-all text-sm"
                  >
                    No, Keep
                  </button>
                  <button 
                    onClick={handleDeleteConfirm}
                    disabled={busy}
                    className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all text-sm shadow-xl shadow-red-200 flex items-center justify-center gap-2"
                  >
                    {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : "Yes, Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ManageStaff;
