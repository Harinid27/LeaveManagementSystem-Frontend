import { useEffect, useState } from "react";
import PrincipalLayout from "../components/PrincipalLayout.jsx";
import { userService } from "../services/userService.js";
import { 
  ChevronRight, 
  ChevronDown, 
  User, 
  UserSquare2, 
  GraduationCap, 
  Users,
  Search,
  Maximize2,
  Minimize2
} from "lucide-react";
import LoadingState from "../components/LoadingState.jsx";

const RoleIcon = ({ role }) => {
  switch (role) {
    case "principal": return <User className="w-4 h-4 text-white" />;
    case "hod": return <UserSquare2 className="w-4 h-4 text-white" />;
    case "professor": return <Users className="w-4 h-4 text-white" />;
    case "student": return <GraduationCap className="w-4 h-4 text-white" />;
    default: return <User className="w-4 h-4 text-white" />;
  }
};

const RoleColor = (role) => {
  switch (role) {
    case "principal": return "bg-indigo-600";
    case "hod": return "bg-indigo-500";
    case "professor": return "bg-emerald-500";
    case "student": return "bg-amber-500";
    default: return "bg-gray-500";
  }
};

const TreeNode = ({ node, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="space-y-2 animate-in fade-in slide-in-from-left-2 duration-300">
      <div 
        className={`flex items-center gap-3 p-3 rounded-2xl border border-gray-100 transition-all hover:shadow-md cursor-pointer group ${
          level === 0 ? "bg-white shadow-sm border-indigo-100" : "bg-white/50"
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ marginLeft: `${level * 24}px` }}
      >
        <div className="flex items-center gap-2 flex-1">
          {hasChildren ? (
            <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
              {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
            </button>
          ) : (
            <div className="w-6" /> 
          )}
          
          <div className={`w-8 h-8 ${RoleColor(node.role)} rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
            <RoleIcon role={node.role} />
          </div>
          
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 leading-none mb-1 group-hover:text-indigo-600 transition-colors">
              {node.name}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">{node.role}</span>
              {node.department && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-500">{node.department}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-xs text-gray-400 font-medium">
          <span>{node.email}</span>
          {hasChildren && (
            <span className="px-2 py-0.5 bg-gray-50 rounded-full border border-gray-100">
              {node.children.length} Reports
            </span>
          )}
        </div>
      </div>

      {isExpanded && hasChildren && (
        <div className="border-l-2 border-gray-50 ml-4 pl-2 space-y-2">
          {node.children.map((child) => (
            <TreeNode key={child._id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const HierarchyViewPage = () => {
  const [hierarchy, setHierarchy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchHierarchy = async () => {
      try {
        const data = await userService.getHierarchy();
        setHierarchy(data.hierarchy);
      } catch (err) {
        console.error("Failed to fetch hierarchy", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHierarchy();
  }, []);

  if (loading) return <LoadingState label="Mapping organizational structure..." />;

  return (
    <PrincipalLayout>
      <div className="space-y-6 max-w-4xl mx-auto w-full animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Institutional Hierarchy</h1>
            <p className="text-gray-500 mt-1">Navigate through the visual structure of roles and reporting lines.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm text-gray-500 hover:bg-gray-50 transition-all">
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Legend Bar */}
        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name or department..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 px-2">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-600"></div> Principal</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> HOD</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Prof</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Student</div>
          </div>
        </div>

        {/* Hierarchy Tree */}
        <div className="space-y-4 pb-20">
          {hierarchy ? (
            <TreeNode node={hierarchy} />
          ) : (
            <div className="p-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
              <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Organizational data not available.</p>
            </div>
          )}
        </div>
      </div>
    </PrincipalLayout>
  );
};

export default HierarchyViewPage;
