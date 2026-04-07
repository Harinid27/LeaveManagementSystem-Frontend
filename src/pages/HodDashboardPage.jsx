import { useEffect, useState } from "react";
import { 
  Users, 
  UserPlus, 
  ClipboardList, 
  TrendingUp, 
  ArrowRight,
  ChevronRight,
  GraduationCap,
  Briefcase,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";
import { userService } from "../services/userService.js";
import LoadingState from "../components/LoadingState.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import AppLayout from "../components/AppLayout.jsx";

const StatCard = ({ icon: Icon, label, value, color, description }) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10 transition-colors group-hover:bg-opacity-20`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <div className="flex items-center gap-1 text-green-600 text-sm font-bold bg-green-50 px-2 py-1 rounded-lg">
        <TrendingUp className="w-3 h-3" />
        +12%
      </div>
    </div>
    <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
    <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">{label}</p>
    <p className="text-xs text-gray-500 mt-2">{description}</p>
  </div>
);

function HodDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [hierarchy, setHierarchy] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch essential stats and hierarchy first
        const [summaryRes, hierarchyRes] = await Promise.allSettled([
          userService.getSummary(),
          userService.getHierarchy()
        ]);

        if (summaryRes.status === 'fulfilled') setStats(summaryRes.value.summary);
        if (hierarchyRes.status === 'fulfilled') setHierarchy(hierarchyRes.value.hierarchy || []);
        
        if (summaryRes.status === 'rejected' && hierarchyRes.status === 'rejected') {
          setError("Unable to load dashboard essentials.");
        }

        // Fetch activities separately to prevent blocking
        try {
          const activityData = await userService.getActivities();
          setActivities(activityData.activities || []);
        } catch (actErr) {
          console.warn("Activity feed unavailable", actErr);
          setActivities([]);
        }

      } catch (err) {
        setError("An unexpected error occurred.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingState label="Preparing your workspace..." />;

  return (
    <AppLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">HOD Dashboard</h1>
            <p className="text-gray-500 mt-1">
              Welcome back, <span className="text-indigo-600 font-semibold">{user?.name}</span>. 
              Monitoring <span className="font-medium text-gray-700">{user?.department}</span> department.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              to="/manage-staff/create" 
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
            >
              <UserPlus className="w-5 h-5" />
              Create Professor
            </Link>
          </div>
        </header>

        {/* ... (rest of the content remains exactly the same as before) */}
        
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            icon={Briefcase} 
            label="Total Professors" 
            value={stats?.professor || 0} 
            color="bg-indigo-500" 
            description="Professors reporting directly to you"
          />
          <StatCard 
            icon={Users} 
            label="Total Students" 
            value={stats?.student || 0} 
            color="bg-emerald-500" 
            description="Students under your department's professors"
          />
          <StatCard 
            icon={ClipboardList} 
            label="Pending Leaves" 
            value={stats?.pendingLeaves || 0} 
            color="bg-amber-500" 
            description="Leave requests awaiting your approval"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Department Hierarchy</h2>
              <Link to="/manage-staff/create" className="text-indigo-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                Manage Staff <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {hierarchy.length > 0 ? hierarchy.map((prof) => (
                <div key={prof._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-5 bg-gray-50/50 border-b border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-700 font-bold">
                        {prof.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{prof.name}</p>
                        <p className="text-xs font-medium text-gray-500">Professor • {prof.email}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-white text-gray-600 text-xs font-bold rounded-full border border-gray-100 shadow-sm">
                      {prof.students?.length || 0} Students
                    </span>
                  </div>
                  
                  <div className="p-4">
                    {prof.students && prof.students.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {prof.students.map((student) => (
                          <div key={student._id} className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-gray-50 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all group">
                            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-700 font-bold text-xs">
                              {student.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-gray-800">{student.name}</p>
                              <p className="text-[10px] text-gray-400 font-medium">{student.email}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-400" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center py-4 text-sm text-gray-400 italic">No students assigned to this professor.</p>
                    )}
                  </div>
                </div>
              )) : (
                <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-200 text-center">
                  <GraduationCap className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="font-bold text-gray-500">No Professors Found</p>
                  <p className="text-sm text-gray-400">Start by creating professor accounts for your department.</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Quick Navigation</h3>
              <div className="grid grid-cols-1 gap-3">
                <Link to="/pending-approvals" className="flex items-center justify-between p-4 rounded-2xl bg-amber-50 text-amber-900 hover:bg-amber-100 transition-all group">
                  <div className="flex items-center gap-3">
                    <ClipboardList className="w-5 h-5 text-amber-600" />
                    <span className="font-bold">Pending Approvals</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/leaves/my" className="flex items-center justify-between p-4 rounded-2xl bg-indigo-50 text-indigo-900 hover:bg-indigo-100 transition-all group">
                  <div className="flex items-center gap-3">
                    <ClipboardList className="w-5 h-5 text-indigo-600" />
                    <span className="font-bold">My Leaves</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Activity Feed Placeholder */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-full">
              <h3 className="font-bold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-gray-100">
                {activities.length > 0 ? activities.slice(0, 5).map((activity, idx) => (
                  <div key={activity._id} className="relative pl-8 group">
                    <div className={`absolute left-0 top-1 w-6 h-6 bg-white border-2 rounded-full flex items-center justify-center transition-colors ${idx === 0 ? 'border-indigo-500' : 'border-gray-200'}`}>
                      <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-indigo-500' : 'bg-gray-200'}`}></div>
                    </div>
                    <p className="text-sm font-bold text-gray-800 capitalize leading-none">{activity.action.replace(/_/g, ' ')}</p>
                    <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed line-clamp-2">{activity.description}</p>
                    <span className="text-[10px] font-bold text-indigo-400/80 uppercase tracking-tighter mt-2 block">
                      {new Date(activity.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
                    </span>
                  </div>
                )) : (
                  <div className="py-10 text-center flex flex-col items-center justify-center">
                    <Clock className="w-8 h-8 text-gray-200 mb-2" />
                    <p className="text-xs font-bold text-gray-400">No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default HodDashboardPage;
