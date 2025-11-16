import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import logo from '../images/logo.png'

function PublicNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  return (
    <nav className="bg-[#444444] shadow-lg border-b border-gray-600">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-20">
       
          <Link to="/" className="flex items-center transition-transform hover:scale-105">
            <img src={logo} alt="Logo" className="h-14 w-auto" />
          </Link>
          <div className="hidden md:flex items-center space-x-10">
            <Link
              to="/home"
              className={`font-semibold text-base transition-all duration-200 py-2 ${
                isActive("/home") || isActive("/")
                  ? "text-indigo-400"
                  : "text-gray-200 hover:text-indigo-300"
              }`}
            >
              Startseite
            </Link>
            <Link
              to="/problems"
              className={`font-semibold text-base transition-all duration-200 py-2 ${
                isActive("/problems") || isActive("/")
                  ? "text-indigo-400"
                  : "text-gray-200 hover:text-indigo-300"
              }`}
            >
              Probleme
            </Link>
            <Link
              to="/about"
              className={`font-semibold text-base transition-all duration-200 py-2 ${
                isActive("/about")
                  ? "text-indigo-400"
                  : "text-gray-200 hover:text-indigo-300"
              }`}
            >
              Über uns
            </Link>
            <Link
              to="/contact"
              className={`font-semibold text-base transition-all duration-200 py-2 ${
                isActive("/contact")
                  ? "text-indigo-400"
                  : "text-gray-200 hover:text-indigo-300"
              }`}
            >
              Kontakt
            </Link>
            <Link
              to="/login"
              className="bg-indigo-600 text-white px-7 py-2.5 rounded-lg hover:bg-indigo-700 transition-all duration-200 font-semibold inline-flex items-center shadow-md hover:shadow-lg"
            >
              Anmeldung
            </Link>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white focus:outline-none hover:text-indigo-300 transition-colors"
            aria-label="Menü umschalten"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-5 space-y-2 border-t border-gray-600 pt-4">
            <Link
              to="/home"
              onClick={() => setIsMenuOpen(false)}
              className={`block font-semibold transition-all duration-200 py-3 px-4 rounded-lg ${
                isActive("/home") || isActive("/")
                  ? "text-indigo-400 bg-gray-700"
                  : "text-gray-200 hover:text-indigo-300 hover:bg-gray-700"
              }`}
            >
              Startseite
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              className={`block font-semibold transition-all duration-200 py-3 px-4 rounded-lg ${
                isActive("/about")
                  ? "text-indigo-400 bg-gray-700"
                  : "text-gray-200 hover:text-indigo-300 hover:bg-gray-700"
              }`}
            >
              Über uns
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsMenuOpen(false)}
              className={`block font-semibold transition-all duration-200 py-3 px-4 rounded-lg ${
                isActive("/contact")
                  ? "text-indigo-400 bg-gray-700"
                  : "text-gray-200 hover:text-indigo-300 hover:bg-gray-700"
              }`}
            >
              Kontakt
            </Link>
            <Link
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-all duration-200 font-semibold text-center mt-3 shadow-md"
            >
              Anmeldung
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default PublicNavbar;
