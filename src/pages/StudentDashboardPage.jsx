import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import studentService from "../services/studentService.js";
import { 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Calendar,
  User as UserIcon,
  Mail,
  Building2,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const StatCard = ({ label, value, icon: Icon, color, shadow }) => (
  <div className={`bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:${shadow} transition-all duration-300 group`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{label}</p>
        <h3 className="text-3xl font-bold mt-1 text-gray-900 group-hover:scale-105 transition-transform origin-left">{value}</h3>
      </div>
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
    </div>
  </div>
);

const StudentDashboardPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await studentService.getDashboardData();
        setData(res);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="animate-pulse space-y-8">
          <div className="h-10 bg-gray-200 rounded-xl w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-[2rem]"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-64 bg-gray-100 rounded-[2rem]"></div>
            <div className="h-64 bg-gray-100 rounded-[2rem]"></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "approved": return "text-emerald-600 bg-emerald-50 border-emerald-100";
      case "rejected": return "text-red-600 bg-red-50 border-red-100";
      default: return "text-amber-600 bg-amber-50 border-amber-100";
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              Hello, <span className="text-indigo-600">{user?.name}</span> 👋
            </h1>
            <p className="text-gray-500 mt-2 font-medium">Here's what's happening with your leave requests today.</p>
          </div>
          <Link 
            to="/leaves" 
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all active:scale-95"
          >
            Apply for Leave <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            label="Total Applied" 
            value={data?.stats?.totalLeaves || 0} 
            icon={ClipboardList} 
            color="bg-indigo-600" 
            shadow="shadow-indigo-100"
          />
          <StatCard 
            label="Approved" 
            value={data?.stats?.approvedLeaves || 0} 
            icon={CheckCircle2} 
            color="bg-emerald-600" 
            shadow="shadow-emerald-100"
          />
          <StatCard 
            label="Pending" 
            value={data?.stats?.pendingLeaves || 0} 
            icon={Clock} 
            color="bg-amber-600" 
            shadow="shadow-amber-100"
          />
          <StatCard 
            label="Rejected" 
            value={data?.stats?.rejectedLeaves || 0} 
            icon={XCircle} 
            color="bg-red-600" 
            shadow="shadow-red-100"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Leaves */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" /> Recent Leaves
              </h2>
              <Link to="/leaves" className="text-sm font-bold text-indigo-600 hover:underline underline-offset-4">View All</Link>
            </div>
            
            <div className="flex-1">
              {!data?.recentLeaves?.length ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ClipboardList className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-400 font-medium">No leave requests found.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {data.recentLeaves.map((leave) => (
                    <div key={leave._id} className="p-6 hover:bg-gray-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${getStatusColor(leave.status)}`}>
                          {leave.leaveType.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 capitalize">{leave.leaveType} Leave</h3>
                          <p className="text-sm text-gray-500 font-medium">
                            {new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold border capitalize ${getStatusColor(leave.status)}`}>
                          {leave.status}
                        </span>
                        {leave.status === "pending" && leave.currentApprover && (
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                            Waiting for: {leave.currentApprover.name}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Profile Snapshot */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden p-8 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full -mr-16 -mt-16"></div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Snapshot</h2>
              
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Full Name</p>
                    <p className="text-sm font-bold text-gray-900">{data?.profile?.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Address</p>
                    <p className="text-sm font-bold text-gray-900 truncate">{data?.profile?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Department</p>
                    <p className="text-sm font-bold text-gray-900">{data?.profile?.department}</p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-50">
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Reporting Professor</p>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-indigo-600 font-bold text-xs uppercase">
                        {data?.profile?.reportingTo?.name?.charAt(0)}
                      </div>
                      <p className="text-sm font-bold text-gray-800">{data?.profile?.reportingTo?.name || "Unassigned"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Link 
                to="/profile" 
                className="w-full mt-6 py-3.5 bg-gray-50 hover:bg-gray-100 flex items-center justify-center gap-2 rounded-2xl text-sm font-bold text-gray-600 transition-colors"
              >
                Edit Profile
              </Link>
            </div>

            {/* Quick Action Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-100">
              <h3 className="text-lg font-bold mb-2">Need Help?</h3>
              <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
                If you have questions about the leave process, contact your reporting professor.
              </p>
              <button className="w-full py-3.5 bg-white/10 hover:bg-white/20 rounded-2xl text-sm font-bold backdrop-blur-md transition-colors border border-white/10">
                View Policy
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default StudentDashboardPage;
