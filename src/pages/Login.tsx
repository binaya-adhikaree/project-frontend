import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(username, password);
      const user = JSON.parse(localStorage.getItem("user")!);

      if (user.role === "ADMIN") {
        navigate("/admin");
      } else if (user.role === "GASTRONOM") {
        navigate("/user");
      } else {
        navigate('/external');
      }
    } catch {
      alert("Ungültige Anmeldedaten");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] bg-linear-to-br from-blue-100 via-white to-blue-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-[#DFA927] mb-6">
          Willkommen zurück
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Benutzername
            </label>
            <input
              type="text"
              placeholder="Benutzername eingeben"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Passwort
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Passwort eingeben"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-12 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex justify-end">
            <a 
              href="/forgot-password" 
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
            >
              Passwort vergessen?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-[#DFA927] hover:bg-[#c4901f] disabled:opacity-70 disabled:cursor-not-allowed 
             cursor-pointer text-white font-semibold py-2.5 rounded-lg shadow transition-all duration-200 flex items-center justify-center"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Anmeldung läuft...
              </div>
            ) : (
              "Anmelden"
            )}
          </button>
        </form>

        <div className="flex items-center justify-center gap-2 mt-2">
          <h4>
            Noch kein Konto?
          </h4>
          <a href="/register" className="text-blue-600 cursor-pointer">Hier registrieren</a>
        </div>
      </div>
    </div>
  );
}