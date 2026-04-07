import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";

const roleHierarchy = {
  principal: ["hod"],
  hod: ["professor"],
  professor: ["student"],
};

const EyeIcon = ({ open }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    {open ? (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    ) : (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.047m4.533-4.116A9.96 9.96 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.028 10.028 0 01-1.636 3.093M1 1l22 22" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.88 9.88a3 3 0 104.24 4.24" />
      </>
    )}
  </svg>
);

const Spinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

function SignupPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [validationErrors, setValidationErrors] = useState({});

  // Filter available roles: if not logged in, only allow 'principal'
  const availableRoles = user ? (roleHierarchy[user.role] || []) : ["principal"];

  useEffect(() => {
    if (availableRoles.length > 0 && !form.role) {
      setForm((prev) => ({ ...prev, role: availableRoles[0] }));
    }
  }, [availableRoles, form.role]);

  const validate = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = "Full Name is required";
    if (!form.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = "Invalid email format";
    
    if (!form.password) errors.password = "Password is required";
    else if (form.password.length < 6) errors.password = "Password must be at least 6 characters";
    
    if (!form.role) errors.role = "Role is required";
    
    return errors;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", form);
      setSuccess(user ? "User created successfully!" : "Account created! Redirecting to login...");
      setTimeout(() => {
        navigate(user ? "/users" : "/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F8FAFC] overflow-hidden">
      {/* Left side: Branding/Illustration */}
      <div className="hidden md:flex md:w-1/2 lg:w-2/5 bg-indigo-600 relative p-12 flex-col justify-between overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-indigo-500 rounded-full blur-[100px] opacity-30"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-700 rounded-full blur-[80px] opacity-40"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-white mb-8">
            <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight">LMS Elite</span>
          </div>

          <div className="mt-20">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              Manage your <br />
              <span className="text-indigo-200">institution</span> with <br />
              confidence.
            </h1>
            <p className="mt-6 text-lg text-indigo-100 max-w-sm leading-relaxed font-medium">
              A hierarchical leave management system designed for modern campuses. Experience seamless approvals and tracking.
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-auto">
          <div className="flex items-center gap-4 p-6 bg-white/5 backdrop-blur-sm rounded-[2rem] border border-white/10">
             <div className="flex -space-x-3">
                {[1,2,3].map(i => (
                  <div key={i} className="h-10 w-10 rounded-full border-2 border-indigo-600 bg-indigo-300 flex items-center justify-center text-xs font-bold text-indigo-600">
                    JD
                  </div>
                ))}
             </div>
             <p className="text-sm text-indigo-50 text-indigo-100/80">
               Trusted by <span className="font-bold text-white">500+</span> faculty members.
             </p>
          </div>
        </div>
      </div>

      {/* Right side: Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-20 relative">
        <div className="absolute top-10 right-10 w-[20%] h-[20%] bg-indigo-50 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="max-w-md w-full relative z-10">
          {!user && (
            <div className="flex bg-zinc-100 p-1.5 rounded-2xl mb-10">
              <Link
                to="/login"
                className="flex-1 py-2.5 text-sm font-bold rounded-xl text-zinc-500 hover:text-zinc-700 text-center transition-all"
              >
                Login
              </Link>
              <button
                className="flex-1 py-2.5 text-sm font-bold rounded-xl bg-white text-indigo-600 shadow-sm transition-all"
              >
                Register
              </button>
            </div>
          )}

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">
              {user ? "Register New User" : "Institution Registration"}
            </h2>
            <p className="mt-3 text-zinc-500 text-sm">
              {user 
                ? "Create accounts for your department members." 
                : "Sign up as a Principal to start managing your institution."}
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSignup}>
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm animate-shake">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-4 py-3 rounded-2xl text-sm">
                {success}
              </div>
            )}

            <div className="grid grid-cols-1 gap-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700 ml-1">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  className={`block w-full px-5 py-3.5 rounded-2xl bg-white border ${validationErrors.name ? 'border-red-300' : 'border-zinc-200'} text-zinc-900 focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all duration-300`}
                  placeholder="John Doe"
                />
                {validationErrors.name && <p className="text-xs text-red-500 mt-1 ml-1">{validationErrors.name}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700 ml-1">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  className={`block w-full px-5 py-3.5 rounded-2xl bg-white border ${validationErrors.email ? 'border-red-300' : 'border-zinc-200'} text-zinc-900 focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all duration-300`}
                  placeholder="john@university.edu"
                />
                {validationErrors.email && <p className="text-xs text-red-500 mt-1 ml-1">{validationErrors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700 ml-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({...form, password: e.target.value})}
                    className={`block w-full px-5 py-3.5 rounded-2xl bg-white border ${validationErrors.password ? 'border-red-300' : 'border-zinc-200'} text-zinc-900 focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all duration-300`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-5 flex items-center text-zinc-400 hover:text-zinc-600 transition-colors"
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
                {validationErrors.password && <p className="text-xs text-red-500 mt-1 ml-1">{validationErrors.password}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700 ml-1">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({...form, role: e.target.value})}
                  className="block w-full px-5 py-3.5 rounded-2xl bg-white border border-zinc-200 text-zinc-900 focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all duration-300 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236B7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_1.25rem_center] bg-no-repeat"
                >
                  {availableRoles.map((role) => (
                    <option key={role} value={role}>
                      {role.toUpperCase()}
                    </option>
                  ))}
                  {availableRoles.length === 0 && <option disabled>No roles available</option>}
                </select>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading || availableRoles.length === 0}
                className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-indigo-100 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-600/20 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5"
              >
                {loading ? <Spinner /> : "Create User Account"}
              </button>
            </div>

            <p className="text-xs text-center text-zinc-400 font-medium px-6">
              Principals can create HODs, HODs can create Professors, and Professors can create Students.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
