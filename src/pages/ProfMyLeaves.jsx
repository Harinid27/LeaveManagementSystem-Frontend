import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout.jsx";
import { leaveService } from "../services/leaveService.js";
import { 
  Calendar, 
  FileText, 
  Send, 
  History, 
  ChevronDown,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  CloudUpload,
  ArrowRight,
  MessageSquare,
  Loader2
} from "lucide-react";
import LoadingState from "../components/LoadingState.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const ProfMyLeaves = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  
  const [form, setForm] = useState({
    leaveType: "Casual Leave",
    fromDate: "",
    toDate: "",
    reason: "",
    proofFile: null
  });
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      return setError("File size exceeds 5MB limit.");
    }
    setForm({ ...form, proofFile: file });
    setError("");
  };

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
      setSuccess("Your leave application has been submitted and forwarded to HOD.");
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
      case "approved": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "rejected": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Personal Leave Console</h1>
          <p className="text-gray-500 mt-2 font-medium">Manage your personal leave applications and monitor approval flows.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 items-start">
          {/* Form Column */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden sticky top-24">
              <div className="bg-indigo-600 p-8 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Send className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold">Leave Application</h2>
                </div>
                <p className="text-indigo-100 text-sm leading-relaxed opacity-90">
                  Apply for leave and track status in one place. Submit a request with leave type, date range, and reason.
                </p>
              </div>

              <form onSubmit={handleApply} className="p-8 space-y-6">
                {success && (
                  <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 flex items-center gap-3 text-sm font-bold">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    {success}
                  </div>
                )}
                {error && (
                  <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 flex items-center gap-3 text-sm font-bold">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Leave Category</label>
                    <div className="relative">
                      <select 
                        required
                        value={form.leaveType}
                        onChange={(e) => setForm({...form, leaveType: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all appearance-none font-bold text-gray-700 cursor-pointer"
                      >
                        <option>Casual Leave</option>
                        <option>Sick Leave</option>
                        <option>Medical Leave</option>
                        <option>Academic Leave</option>
                        <option>Other</option>
                      </select>
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">From</label>
                      <input 
                        type="date"
                        required
                        value={form.fromDate}
                        onChange={(e) => setForm({...form, fromDate: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all font-bold text-gray-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">To</label>
                      <input 
                        type="date"
                        required
                        value={form.toDate}
                        onChange={(e) => setForm({...form, toDate: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all font-bold text-gray-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Reason</label>
                    <textarea 
                      required
                      rows="4"
                      value={form.reason}
                      onChange={(e) => setForm({...form, reason: e.target.value})}
                      placeholder="Explain the reason for your absence..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all font-bold text-gray-700 resize-none placeholder:text-gray-400"
                    ></textarea>
                    <p className="text-[11px] text-gray-400 italic ml-1 leading-relaxed">Give a clear reason so the approver can review it quickly.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Medical Certificate / Leave Proof</label>
                    <div className="relative">
                      <input 
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        id="proofFile"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <label 
                        htmlFor="proofFile"
                        className="flex items-center gap-3 w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl py-4 px-5 cursor-pointer hover:bg-white hover:border-indigo-200 transition-all font-bold text-gray-600"
                      >
                        <CloudUpload className="w-5 h-5 text-gray-400" />
                        <span className="text-sm truncate">
                          {form.proofFile ? form.proofFile.name : "Click to upload attachment..."}
                        </span>
                      </label>
                    </div>
                    <p className="text-[11px] text-gray-400 italic ml-1">Optional. Upload a PDF, JPG, or PNG up to 5MB.</p>
                  </div>
                </div>

                <button 
                  disabled={busy}
                  className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 group"
                >
                  {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                      Apply Leave
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* History Column */}
          <div className="xl:col-span-3 space-y-6">
            <div className="flex items-end justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 rounded-2xl">
                  <History className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Applied Leaves</h2>
                  <p className="text-gray-400 text-sm font-medium">Review your application history.</p>
                </div>
              </div>
              <span className="bg-gray-100 text-gray-500 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">{leaves.length} Total</span>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden min-h-[400px]">
              {loading ? (
                <div className="p-20"><LoadingState label="Decrypting personal records..." /></div>
              ) : leaves.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {leaves.map((leave) => (
                    <div key={leave._id} className="group">
                      <div 
                        onClick={() => setExpandedRow(expandedRow === leave._id ? null : leave._id)}
                        className={`p-6 md:p-8 cursor-pointer transition-all ${expandedRow === leave._id ? 'bg-indigo-50/30' : 'hover:bg-gray-50/50'}`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <h3 className="font-extrabold text-gray-900 text-lg uppercase tracking-tight">{leave.leaveType}</h3>
                            <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-widest">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(leave.fromDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} - 
                              {new Date(leave.toDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between md:justify-end gap-6">
                            <div className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center gap-2 ${getStatusStyle(leave.status)}`}>
                              {leave.status === 'pending' && <Clock className="w-3.5 h-3.5" />}
                              {leave.status === 'approved' && <CheckCircle2 className="w-3.5 h-3.5" />}
                              {leave.status === 'rejected' && <XCircle className="w-3.5 h-3.5" />}
                              {leave.status}
                            </div>
                            <div className={`p-2 rounded-xl transition-all ${expandedRow === leave._id ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-400 group-hover:text-indigo-600'}`}>
                              <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${expandedRow === leave._id ? 'rotate-180' : ''}`} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {expandedRow === leave._id && (
                        <div className="px-8 pb-8 pt-2">
                          <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                              <div>
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Approval Flow</h4>
                                <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-indigo-100">
                                  <div className="relative pl-10">
                                    <div className="absolute left-0 top-1 w-6 h-6 bg-white border-2 border-indigo-600 rounded-full flex items-center justify-center">
                                      <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                                    </div>
                                    <p className="text-sm font-bold text-gray-900">Application Submitted</p>
                                    <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase">HOD REVIEW STAGE</p>
                                  </div>
                                  
                                  {leave.approvalFlow?.map((step, idx) => (
                                    <div key={idx} className="relative pl-10">
                                      <div className={`absolute left-0 top-1 w-6 h-6 bg-white border-2 rounded-full flex items-center justify-center ${step.status === 'pending' ? 'border-amber-400' : step.status === 'approved' ? 'border-emerald-500' : 'border-red-500'}`}>
                                        <div className={`w-2 h-2 rounded-full ${step.status === 'pending' ? 'bg-amber-400' : step.status === 'approved' ? 'bg-emerald-500' : step.status === 'red-500'}`}></div>
                                      </div>
                                      <p className="text-sm font-bold text-gray-900 leading-tight">
                                        {step.approverId?.role || 'Approver'} • {step.approverId?.name || 'Hierarchical Review'}
                                      </p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-[10px] font-black uppercase tracking-wider ${step.status === 'pending' ? 'text-amber-600' : step.status === 'approved' ? 'text-emerald-600' : 'text-red-600'}`}>
                                          {step.status}
                                        </span>
                                        {step.actionDate && (
                                          <span className="text-[10px] text-gray-400 font-bold">
                                            {new Date(step.actionDate).toLocaleDateString()}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {leave.proofFile?.fileUrl && (
                                <div>
                                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">Attachment</h4>
                                  <a 
                                    href={leave.proofFile.fileUrl} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-2xl text-indigo-600 text-xs font-bold hover:bg-gray-50 transition-all shadow-sm"
                                  >
                                    <FileText className="w-4 h-4" />
                                    View Supporting Document
                                  </a>
                                </div>
                              )}
                            </div>

                            <div className="space-y-6">
                              <div>
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">Original Reason</h4>
                                <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                                  <div className="flex items-start gap-4">
                                    <div className="p-2 bg-indigo-50 rounded-xl">
                                      <MessageSquare className="w-4 h-4 text-indigo-600" />
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed font-medium italic">"{leave.reason}"</p>
                                  </div>
                                </div>
                              </div>

                              {leave.approvalFlow?.some(f => f.remarks) && (
                                <div>
                                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">Recent Remarks</h4>
                                  <div className="space-y-3">
                                    {leave.approvalFlow.filter(f => f.remarks).map((f, i) => (
                                      <div key={i} className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm border-l-4 border-l-indigo-600">
                                        <p className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-wider">{f.approverId?.name || "Reviewer"}</p>
                                        <p className="text-sm text-gray-700 font-medium italic">"{f.remarks}"</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-20 text-center flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6">
                    <History className="w-10 h-10 text-gray-200" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">No application records.</h3>
                  <p className="text-gray-400 mt-2 max-w-xs mx-auto">Your historical leave applications and tracking history will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProfMyLeaves;
