import React, { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout.jsx";
import { leaveService } from "../services/leaveService.js";
import { 
  Send, 
  History, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  FileText,
  Type,
  MoreHorizontal,
  CloudUpload,
  ArrowRight
} from "lucide-react";
import { toast } from "react-hot-toast";

const StudentMyLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [expandedLeave, setExpandedLeave] = useState(null);
  
  const [formData, setFormData] = useState({
    leaveType: "casual",
    fromDate: "",
    toDate: "",
    reason: "",
    proofFile: null
  });

  const fetchLeaves = async () => {
    try {
      const res = await leaveService.myLeaves();
      setLeaves(res.leaves || []);
    } catch (err) {
      toast.error("Failed to fetch leaves");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      return toast.error("File size exceeds 5MB limit.");
    }
    setFormData({ ...formData, proofFile: file });
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new Date(formData.fromDate) > new Date(formData.toDate)) {
      return toast.error("From date cannot be after To date");
    }

    setSubmitLoading(true);
    try {
      await leaveService.apply(formData);
      toast.success("Leave application submitted successfully");
      setFormData({
        leaveType: "casual",
        fromDate: "",
        toDate: "",
        reason: "",
        proofFile: null
      });
      fetchLeaves();
    } catch (err) {
      toast.error(err.displayMessage || "Failed to apply for leave");
    } finally {
      setSubmitLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved": return <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Approved</span>;
      case "rejected": return <span className="px-3 py-1 bg-red-50 text-red-600 border border-red-100 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> Rejected</span>;
      default: return <span className="px-3 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Pending</span>;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-10 animate-in fade-in duration-700">
        <header>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">My Leaves</h1>
          <p className="text-gray-500 mt-2 font-medium">Apply for new leaves and track your application status across the hierarchy.</p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Apply Leave Form */}
          <div className="xl:col-span-4 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 sticky top-28">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                <Send className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Apply Leave</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Type className="w-3 h-3" /> Leave Type
                </label>
                <select 
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 px-4 focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all font-medium appearance-none"
                  value={formData.leaveType}
                  onChange={(e) => setFormData({...formData, leaveType: e.target.value})}
                  required
                >
                  <option value="casual">Casual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Calendar className="w-3 h-3" /> From Date
                  </label>
                  <input 
                    type="date"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 px-4 focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all font-medium"
                    value={formData.fromDate}
                    onChange={(e) => setFormData({...formData, fromDate: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Calendar className="w-3 h-3" /> To Date
                  </label>
                  <input 
                    type="date"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 px-4 focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all font-medium"
                    value={formData.toDate}
                    onChange={(e) => setFormData({...formData, toDate: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <FileText className="w-3 h-3" /> Reason for Leave
                </label>
                <textarea 
                  rows="4"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 px-4 focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all font-medium resize-none"
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  placeholder="Please state your reason clearly..."
                  required
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <CloudUpload className="w-3 h-3" /> Supporting Document (Optional)
                </label>
                <div className="relative">
                  <input 
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="studentProofFile"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <label 
                    htmlFor="studentProofFile"
                    className="flex items-center gap-3 w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl py-3.5 px-4 cursor-pointer hover:bg-white hover:border-indigo-200 transition-all font-medium text-gray-600"
                  >
                    <CloudUpload className="w-4 h-4 text-gray-400" />
                    <span className="text-sm truncate">
                      {formData.proofFile ? formData.proofFile.name : "Upload medical proof or document..."}
                    </span>
                  </label>
                </div>
                <p className="text-[10px] text-gray-400 italic">PDF, JPG, PNG up to 5MB.</p>
              </div>

              <button 
                type="submit"
                disabled={submitLoading}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitLoading ? "Submitting..." : <><Send className="w-5 h-5"/> Submit Application</>}
              </button>
            </form>
          </div>

          {/* Leave History Table */}
          <div className="xl:col-span-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <History className="w-6 h-6 text-indigo-600" /> Leave History
              </h2>
            </div>

            <div className="flex-1 overflow-x-auto">
              {loading ? (
                <div className="p-12 space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-50 rounded-2xl animate-pulse"></div>
                  ))}
                </div>
              ) : leaves.length === 0 ? (
                <div className="p-24 text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <History className="w-10 h-10 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No History Yet</h3>
                  <p className="text-gray-400 font-medium max-w-xs mx-auto">Your leave applications will appear here once you submit one.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">Type / Date</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">Status</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {leaves.map((leave) => (
                      <React.Fragment key={leave._id}>
                        <tr className={`group transition-all ${expandedLeave === leave._id ? "bg-indigo-50/30" : "hover:bg-gray-50/50"}`}>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold ${
                                leave.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                                leave.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                                'bg-indigo-100 text-indigo-700'
                              }`}>
                                {leave.leaveType.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 capitalize leading-tight mb-1">{leave.leaveType} Leave</p>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-tight">
                                  {new Date(leave.fromDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })} - {new Date(leave.toDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            {getStatusBadge(leave.status)}
                          </td>
                          <td className="px-8 py-6 text-right">
                            <button 
                              onClick={() => setExpandedLeave(expandedLeave === leave._id ? null : leave._id)}
                              className={`p-3 rounded-2xl transition-all ${expandedLeave === leave._id ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600"}`}
                            >
                              {expandedLeave === leave._id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>
                          </td>
                        </tr>
                        {expandedLeave === leave._id && (
                          <tr className="bg-indigo-50/30 animate-in slide-in-from-top-2 duration-300 overflow-hidden">
                            <td colSpan="3" className="px-8 py-8 border-b border-indigo-100/50">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                  <div>
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">Reason for Leave</p>
                                    <div className="bg-white/60 backdrop-blur-md rounded-2xl p-5 border border-indigo-100/50 text-gray-700 leading-relaxed font-medium">
                                      {leave.reason}
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">Applied Date</p>
                                    <p className="text-sm font-bold text-gray-700">{new Date(leave.createdAt).toLocaleString()}</p>
                                  </div>
                                  
                                  {leave.proofFile?.fileUrl && (
                                    <div>
                                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">Supporting Document</p>
                                      <a 
                                        href={leave.proofFile.fileUrl} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-indigo-600 text-xs font-bold shadow-sm hover:bg-gray-50 transition-all border-l-4 border-l-indigo-600"
                                      >
                                        <FileText className="w-4 h-4" />
                                        View Attachment
                                      </a>
                                    </div>
                                  )}
                                </div>

                                <div className="space-y-6">
                                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">Approval Timeline</p>
                                  <div className="space-y-4">
                                    {(leave.approvalFlow || []).map((step, idx) => (
                                      <div key={idx} className="flex gap-4 relative last:pb-0 pb-6">
                                        {idx !== (leave.approvalFlow?.length - 1) && (
                                          <div className="absolute left-6 top-10 bottom-0 w-px bg-indigo-100"></div>
                                        )}
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 z-10 ${
                                          step.status === 'approved' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' :
                                          step.status === 'rejected' ? 'bg-red-500 text-white shadow-lg shadow-red-100' :
                                          'bg-white border-2 border-indigo-100 text-indigo-300'
                                        }`}>
                                          {step.status === 'approved' ? <CheckCircle2 className="w-6 h-6" /> : 
                                           step.status === 'rejected' ? <AlertCircle className="w-6 h-6" /> : 
                                           <Clock className="w-6 h-6 animate-pulse" />}
                                        </div>
                                        <div>
                                          <div className="flex items-center gap-2 mb-1">
                                            <p className="font-bold text-gray-900">{step.approverId?.name || "Pending Approver"}</p>
                                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter bg-indigo-50 px-2 py-0.5 rounded-md">
                                              {step.approverId?.role || "Level"}
                                            </span>
                                          </div>
                                          <p className="text-sm text-gray-400 font-medium">
                                            {step.status === 'pending' ? 'Decision pending' : `${step.status.charAt(0).toUpperCase() + step.status.slice(1)} on ${new Date(step.actionDate).toLocaleDateString()}`}
                                          </p>
                                          {step.remarks && (
                                            <div className="mt-2 text-xs italic text-gray-500 bg-gray-100/50 p-2 rounded-lg border-l-2 border-indigo-300">
                                              "{step.remarks}"
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            
            {/* Pagination Placeholder */}
            <div className="bg-gray-50/50 p-6 border-t border-gray-50 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-400">Showing {leaves.length} results</p>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-400 cursor-not-allowed">Previous</button>
                <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-400 cursor-not-allowed">Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default StudentMyLeaves;
