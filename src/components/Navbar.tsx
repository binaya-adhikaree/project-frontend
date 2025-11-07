import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800 border-red-300";
      case "GASTRONOM":
        return "bg-green-100 text-green-800 border-green-300";
      case "EXTERNAL":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <nav className="bg-yellow-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">
              📔 Betriebstagebuch
            </h1>
          </div>

          {/* User Info & Actions */}
          <div className="flex items-center space-x-4">
            {/* User Info */}
            <div className="hidden md:block text-right">
              <p className="text-sm text-white font-semibold">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-xs text-yellow-100">{user.email}</p>
            </div>

            {/* Role Badge */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getRoleBadgeColor(
                user.role
              )}`}
            >
              {user.role}
            </span>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-white hover:bg-gray-100 text-gray-800 font-semibold px-4 py-2 rounded-lg shadow transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile User Info */}
      <div className="md:hidden px-4 pb-3">
        <p className="text-sm text-white font-semibold">
          {user.first_name} {user.last_name}
        </p>
        <p className="text-xs text-yellow-100">{user.email}</p>
      </div>
    </nav>
  );
};