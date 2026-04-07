import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout.jsx";
import { leaveService } from "../services/leaveService.js";
import { 
  Calendar, 
  FileText, 
  Send, 
  History, 
  MoreHorizontal,
  Info,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  CloudUpload,
  ArrowRight
} from "lucide-react";
import LoadingState from "../components/LoadingState.jsx";
import { toast } from "react-hot-toast";

const HodMyLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  
  // Form State
  const [form, setForm] = useState({
    leaveType: "Casual Leave",
    fromDate: "",
    toDate: "",
    reason: "",
    proofFile: null
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      return toast.error("File size exceeds 5MB limit.");
    }
    setForm({ ...form, proofFile: file });
  };
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchHistory = async () => {
    try {
      const data = await leaveService.myLeaves();
      setLeaves(data.leaves || []);
    } catch (err) {
      console.error("Failed to fetch leaves", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleApply = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (new Date(form.fromDate) > new Date(form.toDate)) {
      return setError("Start date cannot be after end date.");
    }

    setBusy(true);
    try {
      await leaveService.apply(form);
      setSuccess("Your leave application has been submitted to the Principal.");
      setForm({ leaveType: "Casual Leave", fromDate: "", toDate: "", reason: "", proofFile: null });
      fetchHistory();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit leave application.");
    } finally {
      setBusy(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "approved": return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "rejected": return "bg-red-50 text-red-700 border-red-100";
      default: return "bg-amber-50 text-amber-700 border-amber-100";
    }
  };

  const StatusIcon = ({ status }) => {
    switch (status) {
      case "approved": return <CheckCircle2 className="w-3.5 h-3.5" />;
      case "rejected": return <XCircle className="w-3.5 h-3.5" />;
      default: return <Clock className="w-3.5 h-3.5" />;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-10 animate-in fade-in duration-500">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Leaves</h1>
            <p className="text-gray-500 mt-1">Manage your leave applications and tracking history.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* Application Form */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden sticky top-28">
              <div className="p-6 bg-indigo-600 text-white">
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
                    <Send className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold">New Application</h2>
                </div>
                <p className="text-indigo-100 text-sm">Your leave request will be forwarded directly to the Principal.</p>
              </div>

              <form onSubmit={handleApply} className="p-8 space-y-6">
                {success && (
                  <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 flex items-center gap-3 text-sm font-medium animate-in slide-in-from-top-2">
                    <CheckCircle2 className="w-5 h-5" />
                    {success}
                  </div>
                )}
                {error && (
                  <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 flex items-center gap-3 text-sm font-medium">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Leave Type</label>
                    <div className="relative">
                      <select 
                        required
                        value={form.leaveType}
                        onChange={(e) => setForm({...form, leaveType: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 px-4 focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all appearance-none font-medium text-gray-700"
                      >
                        <option>Casual Leave</option>
                        <option>Sick Leave</option>
                        <option>Medical Leave</option>
                        <option>Other</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">From Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          type="date"
                          required
                          value={form.fromDate}
                          onChange={(e) => setForm({...form, fromDate: e.target.value})}
                          className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 pl-11 pr-4 focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all font-medium text-gray-700"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">To Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          type="date"
                          required
                          value={form.toDate}
                          onChange={(e) => setForm({...form, toDate: e.target.value})}
                          className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 pl-11 pr-4 focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all font-medium text-gray-700"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Reason for Leave</label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-4 w-4 h-4 text-gray-400" />
                      <textarea 
                        required
                        rows="4"
                        value={form.reason}
                        onChange={(e) => setForm({...form, reason: e.target.value})}
                        placeholder="Explain the reason for your absence..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 pl-11 pr-4 focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all font-medium text-gray-700 resize-none"
                      ></textarea>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Supporting Document (Optional)</label>
                    <div className="relative">
                      <input 
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        id="hodProofFile"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <label 
                        htmlFor="hodProofFile"
                        className="flex items-center gap-3 w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl py-3.5 px-4 cursor-pointer hover:bg-white hover:border-indigo-200 transition-all font-medium text-gray-600"
                      >
                        <CloudUpload className="w-5 h-5 text-gray-400" />
                        <span className="text-sm truncate">
                          {form.proofFile ? form.proofFile.name : "Upload medical proof or document..."}
                        </span>
                      </label>
                    </div>
                    <p className="text-[10px] text-gray-400 italic">PDF, JPG, PNG up to 5MB.</p>
                  </div>
                </div>

                <button 
                  disabled={busy}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 group"
                >
                  {busy ? "Submitting..." : (
                    <>
                      Apply for Leave 
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* History Table */}
          <div className="xl:col-span-3 space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-gray-400" />
                <h2 className="text-xl font-bold text-gray-900">Leave History</h2>
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{leaves.length} Applications</span>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden min-h-[500px]">
              {loading ? (
                <div className="p-12"><LoadingState label="Fetching your history..." /></div>
              ) : leaves.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                        <th className="px-6 py-5">Leave Info</th>
                        <th className="px-6 py-5">Duration</th>
                        <th className="px-6 py-5">Status</th>
                        <th className="px-6 py-5 text-right font-sans lowercase tracking-normal italic text-xs">
                          <Info className="w-4 h-4 inline mr-1 text-gray-300" /> Click row to expand
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {leaves.map((leave) => (
                        <>
                          <tr 
                            key={leave._id} 
                            onClick={() => setExpandedRow(expandedRow === leave._id ? null : leave._id)}
                            className={`group cursor-pointer transition-all ${expandedRow === leave._id ? 'bg-indigo-50/30' : 'hover:bg-gray-50/50'}`}
                          >
                            <td className="px-6 py-5">
                              <p className="font-bold text-gray-900 mb-1">{leave.leaveType}</p>
                              <p className="text-xs text-gray-400 font-medium truncate max-w-[180px]">{leave.reason}</p>
                            </td>
                            <td className="px-6 py-5">
                              <p className="text-sm font-bold text-gray-700">
                                {new Date(leave.fromDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - 
                                {new Date(leave.toDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                              </p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">Applied: {new Date(leave.createdAt).toLocaleDateString()}</p>
                            </td>
                            <td className="px-6 py-5">
                              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-full text-[11px] font-bold uppercase tracking-wider ${getStatusStyle(leave.status)}`}>
                                <StatusIcon status={leave.status} />
                                {leave.status}
                              </div>
                            </td>
                            <td className="px-6 py-5 text-right">
                              <div className={`p-2 rounded-xl transition-all ${expandedRow === leave._id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600'}`}>
                                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${expandedRow === leave._id ? 'rotate-180' : ''}`} />
                              </div>
                            </td>
                          </tr>
                          
                          {/* Expanded Content */}
                          {expandedRow === leave._id && (
                            <tr className="bg-indigo-50/20">
                              <td colSpan="4" className="px-6 py-6 animate-in slide-in-from-top-2 duration-300">
                                <div className="max-w-xl space-y-4">
                                  <div className="flex items-start gap-4">
                                    <div className="w-px h-16 bg-indigo-200 mt-2 ml-2"></div>
                                    <div className="space-y-4 flex-1">
                                      <div className="flex items-center gap-3">
                                        <div className={`w-4 h-4 rounded-full border-2 ${leave.status === 'pending' ? 'border-amber-400 bg-white' : 'border-indigo-600 bg-indigo-600'}`}></div>
                                        <div className="flex-1">
                                          <p className="text-sm font-bold text-gray-900">Application Submitted</p>
                                          <p className="text-xs text-gray-500 font-medium">{new Date(leave.createdAt).toLocaleString()}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <div className={`w-4 h-4 rounded-full border-2 ${leave.status === 'pending' ? 'border-amber-400 bg-amber-400 animate-pulse' : leave.status === 'approved' ? 'border-emerald-500 bg-emerald-500' : 'border-red-500 bg-red-500'}`}></div>
                                        <div className="flex-1">
                                          <p className="text-sm font-bold text-gray-900">
                                            Principal Review {leave.status === 'pending' && <span className="text-amber-600 ml-1 italic">(In Progress)</span>}
                                          </p>
                                          <p className="text-xs text-gray-500 font-medium">Approver: {leave.currentApprover?.name || "The Principal"}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="p-4 bg-white rounded-2xl border border-indigo-100 shadow-sm ml-6">
                                    <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">Original Reason</p>
                                    <p className="text-sm text-gray-600 italic">"{leave.reason}"</p>
                                  </div>

                                  {leave.proofFile?.fileUrl && (
                                    <div className="ml-6 pt-4">
                                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Attachment</p>
                                      <a 
                                        href={leave.proofFile.fileUrl} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-indigo-600 text-xs font-bold shadow-sm hover:bg-gray-50 transition-all border-l-4 border-l-indigo-600"
                                      >
                                        <FileText className="w-4 h-4" />
                                        View Attachment
                                      </a>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-20 text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6">
                    <History className="w-10 h-10 text-gray-200" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">No History found</h3>
                  <p className="text-gray-400 max-w-xs mt-2 font-medium">
                    You haven't submitted any leave applications yet. Your history will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default HodMyLeaves;
