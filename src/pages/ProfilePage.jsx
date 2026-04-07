import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { userService } from "../services/userService.js";
import { 
  User, 
  Mail, 
  Lock, 
  Shield, 
  Save, 
  Building2,
  Users,
  ChevronRight,
  Info,
  Edit2,
  X,
  CheckCircle2
} from "lucide-react";
import { toast } from "react-hot-toast";

const ROLE_CONFIG = {
  principal: { color: "bg-purple-600", text: "text-purple-600", border: "border-purple-100", light: "bg-purple-50" },
  hod: { color: "bg-blue-600", text: "text-blue-600", border: "border-blue-100", light: "bg-blue-50" },
  professor: { color: "bg-emerald-600", text: "text-emerald-600", border: "border-emerald-100", light: "bg-emerald-50" },
  student: { color: "bg-amber-500", text: "text-amber-500", border: "border-amber-100", light: "bg-amber-50" },
};

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await userService.getProfile();
      setProfile(res.user);
      setName(res.user.name);
    } catch (err) {
      toast.error("Failed to load profile details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name cannot be empty");
    
    setUpdating(true);
    try {
      const res = await userService.updateProfile({ name });
      toast.success("Profile name updated");
      setProfile(prev => ({ ...prev, name }));
      if (setUser) setUser(prev => ({ ...prev, name }));
      setIsEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      return toast.error("All password fields are required");
    }
    if (passwords.new !== passwords.confirm) {
      return toast.error("New passwords do not match");
    }
    if (passwords.new.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setUpdating(true);
    try {
      await userService.updateProfile({ 
        currentPassword: passwords.current, 
        newPassword: passwords.new 
      });
      toast.success("Password changed successfully");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto animate-pulse space-y-8">
          <div className="h-10 bg-gray-200 rounded-xl w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="h-64 bg-gray-100 rounded-[2.5rem]"></div>
            <div className="lg:col-span-2 h-96 bg-gray-100 rounded-[2.5rem]"></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  const roleTheme = ROLE_CONFIG[profile?.role] || ROLE_CONFIG.student;

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Your Profile</h1>
            <p className="text-gray-500 mt-2 font-medium">Manage your identity and account security across the platform.</p>
          </div>
          <div className={`px-4 py-1.5 rounded-full ${roleTheme.light} ${roleTheme.text} border ${roleTheme.border} text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2`}>
            <Shield className="w-3.5 h-3.5" /> Secure Account
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 text-center relative overflow-hidden group">
              <div className={`absolute top-0 left-0 w-full h-24 ${roleTheme.color} opacity-90 group-hover:h-28 transition-all duration-500`}></div>
              
              <div className="relative mt-8">
                <div className="w-28 h-28 bg-white rounded-3xl mx-auto flex items-center justify-center text-5xl font-black text-gray-900 shadow-2xl shadow-gray-200 border-4 border-white transition-transform group-hover:rotate-3">
                  {profile?.name?.charAt(0).toUpperCase()}
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900">{profile?.name}</h2>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  <span className={`px-4 py-1.5 rounded-full ${roleTheme.light} ${roleTheme.text} text-[10px] font-black uppercase tracking-widest border ${roleTheme.border} flex items-center gap-2`}>
                    {profile?.role}
                  </span>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-gray-50 space-y-5">
                <div className="flex flex-col items-start gap-1">
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-[9px]">Official Email</span>
                  <span className="text-gray-900 font-bold text-sm truncate w-full text-left">{profile?.email}</span>
                </div>
                <div className="flex flex-col items-start gap-1">
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-[9px]">Department</span>
                  <span className="text-gray-900 font-bold text-sm text-left">{profile?.department}</span>
                </div>
              </div>
            </div>

            {/* Hierarchy Info Card */}
            <div className={`bg-gradient-to-br ${profile?.role === 'principal' ? 'from-purple-600 to-indigo-700' : 'from-zinc-800 to-zinc-900'} rounded-[2.5rem] p-8 text-white shadow-xl shadow-gray-100 relative overflow-hidden`}>
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
               <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                 <Users className="w-5 h-5" /> Reporting Hierarchy
               </h3>
               
               <div className="space-y-4">
                 {profile?.role === 'principal' ? (
                   <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
                         <Shield className="w-5 h-5 text-white" />
                       </div>
                       <div>
                         <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Hierarchy Status</p>
                         <p className="text-sm font-bold text-white">Top Level Authority</p>
                       </div>
                     </div>
                   </div>
                 ) : (
                   <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Your Supervisor</p>
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center font-black text-xs">
                         {profile?.reportingTo?.name?.charAt(0)}
                       </div>
                       <div>
                         <p className="text-sm font-bold text-white">{profile?.reportingTo?.name || "System Admin"}</p>
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{profile?.reportingTo?.role || "Management"}</p>
                       </div>
                     </div>
                   </div>
                 )}
                 <p className="text-[11px] text-white/50 leading-relaxed italic">
                   {profile?.role === 'principal' ? "You are the final authority for all leave approvals." : "Your leave applications are automatically routed to your supervisor for review."}
                 </p>
               </div>
            </div>
          </div>

          {/* Detailed Settings */}
          <div className="lg:col-span-8 space-y-8">
            {/* Basic Info Section */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 md:p-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gray-50 rounded-2xl">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Personal Details</h2>
                </div>
                {!isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl text-xs font-bold text-gray-600 transition-all"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit Profile
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-50 hover:bg-red-100 rounded-xl text-xs font-bold text-red-600 transition-all"
                  >
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                )}
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative">
                      <input 
                        type="text"
                        disabled={!isEditing}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full ${isEditing ? 'bg-gray-50 border-gray-200 focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600' : 'bg-transparent border-transparent'} border rounded-2xl py-4 px-5 outline-none transition-all font-bold text-gray-900`}
                        placeholder="Your full name"
                      />
                      {!isEditing && <div className="absolute inset-0 bg-transparent cursor-default"></div>}
                    </div>
                  </div>
                  <div className="space-y-2 opacity-100">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address (Read-only)</label>
                    <div className="bg-gray-50/50 border border-gray-100 rounded-2xl py-4 px-5 text-gray-400 font-bold flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-300" /> {profile?.email}
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="pt-4 animate-in fade-in slide-in-from-top-2">
                    <button 
                      type="submit"
                      disabled={updating}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
                    >
                      {updating ? "Saving..." : <><Save className="w-4 h-4" /> Save Changes</>}
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Security Section */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 md:p-10 overflow-hidden relative">
              <div className="absolute top-10 right-10 opacity-5">
                <Lock className="w-32 h-32" />
              </div>
              
              <div className="flex items-center gap-3 mb-10">
                <div className="p-2.5 bg-indigo-50 rounded-2xl text-indigo-600">
                  <Lock className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Security & Password</h2>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Current Password</label>
                    <input 
                      type="password"
                      value={passwords.current}
                      onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all font-bold"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                      <input 
                        type="password"
                        value={passwords.new}
                        onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all font-bold"
                        placeholder="Min. 6 characters"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                      <input 
                        type="password"
                        value={passwords.confirm}
                        onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all font-bold"
                        placeholder="Repeat new password"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={updating}
                    className="inline-flex items-center gap-2 px-10 py-4 border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-2xl font-bold transition-all disabled:opacity-50"
                  >
                    {updating ? "Processing..." : "Update Password"}
                  </button>
                </div>
              </form>
              
              <div className="mt-10 p-5 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-4">
                <div className="p-2 bg-white rounded-lg text-amber-600 shadow-sm">
                  <Info className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-amber-900">Security Recommendation</p>
                  <p className="text-[11px] text-amber-700/80 leading-relaxed font-medium">Use a strong password with at least 8 characters, including symbols and numbers to ensure your account security.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
