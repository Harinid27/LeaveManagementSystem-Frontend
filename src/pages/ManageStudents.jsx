import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout.jsx";
import { userService } from "../services/userService.js";
import { useAuth } from "../context/AuthContext.jsx";
import LoadingState from "../components/LoadingState.jsx";
import { 
  Users, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Eye, 
  X, 
  AlertTriangle,
  Mail,
  Calendar,
  Loader2,
  CheckCircle2,
  UserPlus
} from "lucide-react";
import { Link } from "react-router-dom";

const ManageStudents = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [viewModal, setViewModal] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  
  const [editForm, setEditForm] = useState({ name: "", email: "" });

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = { role: "student", search };
      const response = await userService.getUsers(params);
      setStudents(response.users || []);
    } catch (err) {
      setError("Failed to fetch student directory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchStudents();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await userService.updateUser(editModal._id, editForm);
      setSuccess("Student updated successfully.");
      setEditModal(null);
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update student.");
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setBusy(true);
    try {
      await userService.deleteUser(deleteModal._id);
      setSuccess("Student removed successfully.");
      setDeleteModal(null);
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete student.");
    } finally {
      setBusy(false);
    }
  };

  const openEditModal = (student) => {
    setEditModal(student);
    setEditForm({ name: student.name, email: student.email });
  };

  return (
    <AppLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Manage Students</h1>
            <p className="text-gray-500 mt-1">View and manage students reporting to you in the {user?.department} department.</p>
          </div>
          <Link 
            to="/prof/students/create" 
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all text-sm"
          >
            <UserPlus className="w-5 h-5" />
            Add Student
          </Link>
        </header>

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

        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-24"><LoadingState label="Loading student directory..." /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-50">
                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center w-16">#</th>
                    <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Student</th>
                    <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contact Details</th>
                    <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Department</th>
                    <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {students.length > 0 ? students.map((student, idx) => (
                    <tr key={student._id} className="hover:bg-indigo-50/20 transition-colors group">
                      <td className="px-8 py-6 text-sm font-bold text-gray-400 text-center">{idx + 1}</td>
                      <td className="px-6 py-6 font-bold text-gray-900 min-w-[240px]">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 font-bold group-hover:scale-110 transition-transform">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 leading-none">{student.name}</p>
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold uppercase tracking-wider mt-1.5 inline-block">Student</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-sm text-gray-500 min-w-[200px]">
                        <div className="space-y-1">
                          <p className="flex items-center gap-1.5 text-gray-400 font-medium">
                            <Mail className="w-3 h-3" /> {student.email}
                          </p>
                          <p className="flex items-center gap-1.5 text-gray-400 font-medium">
                            <Calendar className="w-3 h-3" /> Registered {new Date(student.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-6 min-w-[150px]">
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">
                          {student.department}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => setViewModal(student)}
                            className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-indigo-600 transition-all border border-transparent hover:border-indigo-100"
                            title="View Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => openEditModal(student)}
                            className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-amber-600 transition-all border border-transparent hover:border-amber-100"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setDeleteModal(student)}
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
                        <h4 className="font-bold text-gray-900">No students enrolled</h4>
                        <p className="text-sm text-gray-400 mt-1">Students reporting to you will appear here.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* View Modal */}
        {viewModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setViewModal(null)}></div>
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-emerald-600 font-bold text-2xl">
                    {viewModal.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{viewModal.name}</h3>
                    <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{viewModal.role}</p>
                  </div>
                </div>
                <button onClick={() => setViewModal(null)} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</p>
                    <p className="font-bold text-gray-700">{viewModal.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Department</p>
                    <p className="font-bold text-gray-700">{viewModal.department}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Joined</p>
                    <p className="font-bold text-gray-700">{new Date(viewModal.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reporting To</p>
                    <p className="font-bold text-gray-700">Prof. {user?.name}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-gray-50/50 border-t border-gray-50 flex justify-end">
                <button 
                  onClick={() => setViewModal(null)}
                  className="px-6 py-2.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setEditModal(null)}></div>
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Edit Student</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">ID: {editModal._id}</p>
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
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 text-sm font-medium outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email</label>
                  <input 
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
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
                    {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Student"}
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
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-8 text-center space-y-6">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto border-2 border-red-100 text-red-600">
                  <AlertTriangle className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-900">Remove Student?</h3>
                  <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
                    Are you sure you want to remove <span className="font-bold text-gray-700">{deleteModal.name}</span>? This action is permanent.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setDeleteModal(null)}
                    className="flex-1 py-4 bg-gray-50 text-gray-600 rounded-2xl font-bold hover:bg-gray-100 transition-all text-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleDeleteConfirm}
                    disabled={busy}
                    className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all text-sm shadow-xl shadow-red-200 flex items-center justify-center gap-2"
                  >
                    {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Delete"}
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

export default ManageStudents;
