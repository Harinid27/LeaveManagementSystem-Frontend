import { useEffect, useState, useMemo } from "react";
import AppLayout from "../components/AppLayout.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { leaveService } from "../services/leaveService.js";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Filter,
  MessageSquare,
  Calendar,
  FileText,
  User,
  ArrowRight
} from "lucide-react";
import LoadingState from "../components/LoadingState.jsx";

const PendingApprovalsPage = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [remarks, setRemarks] = useState({});

  const fetchLeaves = async () => {
    try {
      const data = await leaveService.pendingLeaves();
      setLeaves(data.leaves || []);
    } catch (err) {
      setError("Failed to fetch pending approvals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const departments = useMemo(() => {
    const depts = new Set(leaves.map(l => l.userId?.department).filter(Boolean));
    return Array.from(depts);
  }, [leaves]);

  const filteredLeaves = useMemo(() => {
    return leaves.filter(l => {
      const matchesSearch = l.userId?.name?.toLowerCase().includes(search.toLowerCase()) || 
                           l.reason?.toLowerCase().includes(search.toLowerCase());
      const matchesDept = selectedDept ? l.userId?.department === selectedDept : true;
      return matchesSearch && matchesDept;
    });
  }, [leaves, search, selectedDept]);

  const handleAction = async (id, action) => {
    setError("");
    setSuccess("");
    try {
      const payload = { remarks: remarks[id] || "" };
      if (action === "approve") {
        await leaveService.approve(id, payload);
        setSuccess("Leave approved successfully.");
      } else {
        await leaveService.reject(id, payload);
        setSuccess("Leave rejected successfully.");
      }
      await fetchLeaves();
    } catch (err) {
      setError(err.response?.data?.message || "Action failed.");
    }
  };

  const Content = (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Pending Approvals</h1>
          <p className="text-gray-500 mt-1">Review and take action on leave requests currently in your queue.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name or reason..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400 ml-2" />
          <select 
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl py-2 px-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">All Departments</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {success && <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 font-medium flex items-center gap-2 animate-in slide-in-from-top-2"><CheckCircle2 className="w-5 h-5"/> {success}</div>}
      {error && <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 font-medium flex items-center gap-2 animate-in slide-in-from-top-2"><XCircle className="w-5 h-5"/> {error}</div>}

      {/* Grid of Pending Leaves */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
        {loading ? (
          <div className="col-span-full py-20"><LoadingState label="Fetching requests..." /></div>
        ) : filteredLeaves.length > 0 ? (
          filteredLeaves.map((leave) => (
            <div key={leave._id} className="bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
              <div className="p-6 flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-bold text-xl">
                      {leave.userId?.name?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{leave.userId?.name}</h3>
                      <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest">{leave.userId?.role} • {leave.userId?.department}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-100 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Pending Review
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div className="text-xs">
                      <p className="text-gray-400 font-medium">Duration</p>
                      <p className="font-bold text-gray-700">{new Date(leave.fromDate).toLocaleDateString()} <ArrowRight className="inline w-3 h-3 mx-1"/> {new Date(leave.toDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <div className="text-xs">
                      <p className="text-gray-400 font-medium">Leave Type</p>
                      <p className="font-bold text-gray-700">{leave.leaveType}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Reason</p>
                  <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl italic border border-gray-100">
                    "{leave.reason}"
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" /> Remarks (Optional)
                  </label>
                  <textarea 
                    value={remarks[leave._id] || ""}
                    onChange={(e) => setRemarks({...remarks, [leave._id]: e.target.value})}
                    placeholder="Add a reason for approval/rejection..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-2 px-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all min-h-[80px] resize-none"
                  />
                </div>
              </div>

              <div className="p-4 bg-gray-50/50 border-t border-gray-100 grid grid-cols-2 gap-3">
                <button 
                  onClick={() => handleAction(leave._id, "reject")}
                  className="flex items-center justify-center gap-2 py-3 bg-white border border-red-200 text-red-600 rounded-2xl font-bold hover:bg-red-50 transition-all shadow-sm"
                >
                  <XCircle className="w-5 h-5" /> Reject
                </button>
                <button 
                  onClick={() => handleAction(leave._id, "approve")}
                  className="flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                >
                  <CheckCircle2 className="w-5 h-5" /> Approve
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-dashed border-gray-200">
              <CheckCircle2 className="w-10 h-10 text-gray-200" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">All caught up!</h3>
            <p className="text-gray-500 mt-1">No pending leave requests are awaiting your decision.</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <AppLayout>
      {Content}
    </AppLayout>
  );
};

export default PendingApprovalsPage;
