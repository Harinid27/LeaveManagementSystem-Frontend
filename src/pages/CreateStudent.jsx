import { useState } from "react";
import AppLayout from "../components/AppLayout.jsx";
import { userService } from "../services/userService.js";
import { useAuth } from "../context/AuthContext.jsx";
import { 
  UserPlus, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Users,
  GraduationCap
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateStudent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: user?.department || "",
    role: "student"
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (form.password.length < 6) {
      setLoading(false);
      return setError("Password must be at least 6 characters long.");
    }

    try {
      await userService.createUser(form);
      setSuccess("Student account created successfully!");
      
      setTimeout(() => {
        navigate("/prof/students");
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create student account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Enroll New Student</h1>
            <p className="text-gray-500 mt-1">Register a new student under the {user?.department} department.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8 order-2 lg:order-1 pt-4">
            <div className="space-y-6">
              <div className="flex gap-4 p-4 rounded-3xl bg-emerald-50/50 border border-emerald-50">
                <div className="p-3 bg-white rounded-2xl shadow-sm text-emerald-600">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Academic Hierarchy</h4>
                  <p className="text-sm text-gray-500 mt-1">This student will report directly to you for leave approvals and administrative tasks.</p>
                </div>
              </div>
              
              <div className="flex gap-4 p-4 rounded-3xl bg-indigo-50/50 border border-indigo-50">
                <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{user?.department} Department</h4>
                  <p className="text-sm text-gray-500 mt-1">Students are automatically assigned to your department to maintain data integrity.</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gray-900 rounded-[2.5rem] text-white overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <p className="text-emerald-400 font-bold text-xs uppercase tracking-widest mb-4">Privacy Note</p>
              <h4 className="text-xl font-bold mb-3 leading-tight">Minimum Data Required</h4>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">We only store Name and Email for students. Personal contact details are managed offline to ensure privacy.</p>
              <button className="flex items-center gap-2 text-sm font-bold text-white group-hover:gap-3 transition-all">
                View Privacy Policy <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-emerald-100/50 overflow-hidden">
              <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Student Profile</h2>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mt-1">{user?.department} Department</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                  <UserPlus className="w-5 h-5" />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-10 space-y-6">
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
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg group-focus-within:bg-emerald-50 transition-colors">
                        <Users className="w-4 h-4 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                      </div>
                      <input 
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({...form, name: e.target.value})}
                        placeholder="e.g. John Doe"
                        className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl py-4 pl-14 pr-4 focus:ring-4 focus:ring-emerald-600/5 focus:border-emerald-600 outline-none transition-all font-medium text-gray-700 placeholder-gray-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg group-focus-within:bg-emerald-50 transition-colors">
                        <Mail className="w-4 h-4 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                      </div>
                      <input 
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({...form, email: e.target.value})}
                        placeholder="john@student.university.edu"
                        className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl py-4 pl-14 pr-4 focus:ring-4 focus:ring-emerald-600/5 focus:border-emerald-600 outline-none transition-all font-medium text-gray-700 placeholder-gray-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Initial Password</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg group-focus-within:bg-emerald-50 transition-colors">
                        <Lock className="w-4 h-4 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                      </div>
                      <input 
                        type={showPassword ? "text" : "password"}
                        required
                        value={form.password}
                        onChange={(e) => setForm({...form, password: e.target.value})}
                        placeholder="••••••••"
                        className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl py-4 pl-14 pr-14 focus:ring-4 focus:ring-emerald-600/5 focus:border-emerald-600 outline-none transition-all font-medium text-gray-700 placeholder-gray-300"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-white rounded-xl text-gray-400 hover:text-emerald-600 transition-all"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    disabled={loading}
                    className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-xl shadow-emerald-200 hover:bg-emerald-700 disabled:opacity-50 transition-all flex items-center justify-center gap-3 group"
                  >
                    {loading ? "Registering Student..." : (
                      <>
                        Enroll Student
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CreateStudent;
