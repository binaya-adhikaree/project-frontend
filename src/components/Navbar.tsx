import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Menu, X, CreditCard, LogOut } from "lucide-react";

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-500 text-white";
      case "GASTRONOM":
        return "bg-emerald-500 text-white";
      case "EXTERNAL":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <nav className="bg-[#444444] border-b border-gray-600 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
      
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3 group">
              <h1 className="text-xl font-bold text-white hidden sm:block">
                Betriebstagebuch
              </h1>
            </Link>

           
            {user.role === "GASTRONOM" && (
              <Link
                to="/pricing"
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-all backdrop-blur-sm"
              >
                <CreditCard className="w-4 h-4" />
                Preise
              </Link>
            )}

            {user.role === "GASTRONOM" && (
              <Link
                to="/user/subscription"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-all backdrop-blur-sm"
              >
                <CreditCard className="w-4 h-4" />
                Abonnement
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-3 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg">
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white/20 text-white font-semibold">
                {user.first_name?.charAt(0)}
                {user.last_name?.charAt(0)}
              </div>
              <div className="text-right">
                <p className="text-sm text-white font-semibold leading-tight">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-xs text-indigo-200">{user.email}</p>
              </div>
            </div>

            <span
              className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg ${getRoleBadgeColor(
                user.role
              )}`}
            >
              {user.role}
            </span>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white hover:bg-gray-50 text-indigo-700 font-semibold px-4 py-2 rounded-lg shadow-lg transition-all hover:shadow-xl"
            >
              <LogOut className="w-4 h-4" />
              Abmelden
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-indigo-800/50 backdrop-blur-lg border-t border-white/10">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Benutzerinfo */}
            <div className="flex items-center space-x-3 pb-4 border-b border-white/10">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 text-white font-bold text-lg">
                {user.first_name?.charAt(0)}
                {user.last_name?.charAt(0)}
              </div>
              <div>
                <p className="text-sm text-white font-semibold">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-xs text-indigo-200">{user.email}</p>
                <span
                  className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold ${getRoleBadgeColor(
                    user.role
                  )}`}
                >
                  {user.role}
                </span>
              </div>
            </div>

            {/* Mobile Pricing Link */}
            {user.role === "GASTRONOM" && (
              <Link
                to="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-all"
              >
                <CreditCard className="w-5 h-5" />
                Preise
              </Link>
            )}


            {/* Mobile Logout */}
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white text-indigo-700 font-semibold hover:bg-gray-50 transition-all"
            >
              <LogOut className="w-5 h-5" />
              Abmelden
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
