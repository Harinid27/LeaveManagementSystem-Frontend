import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";

const PrincipalLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Sidebar />
      <div className="md:ml-64 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-4 md:p-8 pt-20 md:pt-24 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PrincipalLayout;
