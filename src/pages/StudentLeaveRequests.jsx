import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout.jsx";
import { leaveService } from "../services/leaveService.js";
import LoadingState from "../components/LoadingState.jsx";
import { 
  ClipboardList, 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  Calendar, 
  User,
  AlertCircle,
  Loader2,
  ExternalLink,
  Search,
  Filter
} from "lucide-react";

const StudentLeaveRequests = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  // Modal states
  const [actionModal, setActionModal] = useState(null); // { leave, action: 'approve' | 'reject' }
  const [remarks, setRemarks] = useState("");

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const response = await leaveService.getPendingLeaves();
      setLeaves(response.leaves || []);
    } catch (err) {
      setError("Failed to load leave requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleAction = async () => {
    if (!actionModal) return;
    setBusy(true);
    setError("");
    try {
      if (actionModal.action === "approve") {
        await leaveService.approveLeave(actionModal.leave._id, remarks);
        setSuccess("Leave request approved and forwarded.");
      } else {
        await leaveService.rejectLeave(actionModal.leave._id, remarks);
        setSuccess("Leave request rejected.");
      }
      setActionModal(null);
      setRemarks("");
      fetchLeaves();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to process leave request.");
    } finally {
      setBusy(false);
    }
  };

  const filteredLeaves = leaves.filter(l => 
    l.userId?.name.toLowerCase().includes(search.toLowerCase()) ||
    l.leaveType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <header>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Student Leave Requests</h1>
          <p className="text-gray-500 mt-1">Review and process leave applications from your assigned students.</p>
        </header>

        <div className="space-y-4">
          <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by student name or leave type..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-gray-50 text-gray-600 rounded-2xl text-sm font-bold border border-gray-100 hover:bg-white transition-all">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>

          {success && <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 font-medium flex items-center gap-2 animate-in slide-in-from-top-2"><CheckCircle className="w-5 h-5"/> {success}</div>}
          {error && <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 font-medium flex items-center gap-2 animate-in slide-in-from-top-2"><AlertCircle className="w-5 h-5"/> {error}</div>}
        </div>

        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-24"><LoadingState label="Loading leave requests..." /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-50">
                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Student</th>
                    <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Leave Details</th>
                    <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Period</th>
                    <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reason</th>
                    <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredLeaves.length > 0 ? filteredLeaves.map((leave) => (
                    <tr key={leave._id} className="hover:bg-indigo-50/10 transition-colors group">
                      <td className="px-8 py-6 min-w-[200px]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold">
                            {leave.userId?.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 leading-none">{leave.userId?.name}</p>
                            <p className="text-[10px] text-gray-400 font-bold mt-1.5 uppercase tracking-wider">{leave.userId?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 min-w-[150px]">
                        <span className="px-3 py-1 bg-white text-indigo-600 text-xs font-bold rounded-lg border border-indigo-100 shadow-sm">
                          {leave.leaveType}
                        </span>
                      </td>
                      <td className="px-6 py-6 min-w-[180px]">
                        <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                          <Calendar className="w-4 h-4 text-gray-300" />
                          {new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-6 max-w-[250px]">
                        <p className="text-sm text-gray-600 line-clamp-2 italic">{leave.reason}</p>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setActionModal({ leave, action: 'approve' })}
                            className="bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white p-2.5 rounded-xl transition-all shadow-sm border border-emerald-100"
                            title="Approve"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => setActionModal({ leave, action: 'reject' })}
                            className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white p-2.5 rounded-xl transition-all shadow-sm border border-red-100"
                            title="Reject"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="py-24 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-gray-100">
                          <ClipboardList className="w-10 h-10 text-gray-200" />
                        </div>
                        <h4 className="font-bold text-gray-900">All clear!</h4>
                        <p className="text-sm text-gray-400 mt-1">No pending leave requests for now.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Action Modal */}
        {actionModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setActionModal(null)}></div>
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
              <div className={`p-8 border-b border-gray-50 flex items-center justify-between ${actionModal.action === 'approve' ? 'bg-emerald-50/50' : 'bg-red-50/50'}`}>
                <div>
                  <h3 className={`text-xl font-bold ${actionModal.action === 'approve' ? 'text-emerald-700' : 'text-red-700'}`}>
                    {actionModal.action === 'approve' ? 'Approve' : 'Reject'} Leave Request
                  </h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Student: {actionModal.leave.userId.name}</p>
                </div>
                <button onClick={() => setActionModal(null)} className="p-2 hover:bg-white/50 rounded-xl text-gray-400 transition-colors">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-sm italic text-gray-500">
                  "{actionModal.leave.reason}"
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Optional Remarks</label>
                  <textarea 
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Add your comments here..."
                    rows={4}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 text-sm font-medium outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all resize-none"
                  />
                </div>
                <div className="pt-2 flex gap-3">
                  <button 
                    onClick={() => setActionModal(null)}
                    className="flex-1 py-4 bg-gray-50 text-gray-600 rounded-2xl font-bold hover:bg-gray-100 transition-all text-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAction}
                    disabled={busy}
                    className={`flex-1 py-4 text-white rounded-2xl font-bold transition-all text-sm shadow-xl flex items-center justify-center gap-2 ${actionModal.action === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100' : 'bg-red-600 hover:bg-red-700 shadow-red-100'}`}
                  >
                    {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : (actionModal.action === 'approve' ? 'Confirm Approval' : 'Confirm Rejection')}
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

export default StudentLeaveRequests;
