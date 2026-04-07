import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const roleHomeMap = {
  principal: "/principal-dashboard",
  hod: "/hod-dashboard",
  professor: "/prof-dashboard",
  student: "/student-dashboard",
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

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    // Clear errors on input change
    setValidationErrors({});
    setError("");
  }, [email, password]);

  const validate = () => {
    const errors = {};
    if (!email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Email address is invalid";
    
    if (!password) errors.password = "Password is required";
    
    return errors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      const user = await login({ email, password });
      const from = location.state?.from?.pathname || roleHomeMap[user.role] || "/dashboard";
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Dynamic Background Accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-100/50 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white/70 backdrop-blur-2xl border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[2.5rem] p-10 sm:p-12 overflow-hidden">
          <div className="mb-0 text-center">
            <div className="inline-flex items-center justify-center p-3 mb-6 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-zinc-900 tracking-tight italic">LMS Elite</h2>
          </div>

          <div className="flex bg-zinc-100 p-1.5 rounded-2xl mb-8">
            <button
              className="flex-1 py-2.5 text-sm font-bold rounded-xl bg-white text-indigo-600 shadow-sm transition-all"
            >
              Login
            </button>
            <Link
              to="/signup"
              className="flex-1 py-2.5 text-sm font-bold rounded-xl text-zinc-500 hover:text-zinc-700 text-center transition-all"
            >
              Register
            </Link>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-sm animate-shake">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700 ml-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`block w-full px-5 py-4 rounded-2xl bg-zinc-50/50 border ${
                  validationErrors.email ? 'border-red-300' : 'border-zinc-200'
                } text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all duration-300 sm:text-sm`}
                placeholder="name@university.edu"
              />
              {validationErrors.email && <p className="text-xs text-red-500 mt-1 ml-1">{validationErrors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1">
                <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
                  Password
                </label>
                <Link to="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full px-5 py-4 rounded-2xl bg-zinc-50/50 border ${
                    validationErrors.password ? 'border-red-300' : 'border-zinc-200'
                  } text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all duration-300 sm:text-sm`}
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

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-indigo-100 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-600/20 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
              >
                {loading ? <Spinner /> : "Login"}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-zinc-500">
            For department accounts, <span className="font-semibold text-zinc-900">contact your administrator.</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
