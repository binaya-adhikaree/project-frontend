import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import api from "../api/axios";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    password: "",
    password2: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.password2) {
      alert("Passwörter stimmen nicht überein!");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register/", formData);
      alert("Registrierung erfolgreich! Bitte melden Sie sich an.");
      navigate("/login");
    } catch (error: any) {
      if (error.response?.data) {
        const errorData = error.response.data;
        // Handle validation errors from backend
        if (errorData.email) {
          alert(errorData.email[0]);
        } else if (errorData.password) {
          alert(errorData.password[0]);
        } else if (errorData.username) {
          alert(errorData.username[0]);
        } else if (errorData.detail) {
          alert(errorData.detail);
        } else {
          alert("Registrierung fehlgeschlagen. Bitte überprüfen Sie Ihre Eingaben.");
        }
      } else {
        alert("Ein Fehler ist bei der Registrierung aufgetreten");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] bg-linear-to-br from-blue-100 via-white to-blue-50 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-[#DFA927] mb-6">
          Konto Erstellen
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Benutzername <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="username"
              placeholder="Benutzername eingeben"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-Mail <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="E-Mail eingeben"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vorname <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="first_name"
                placeholder="Vorname"
                value={formData.first_name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nachname <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="last_name"
                placeholder="Nachname"
                value={formData.last_name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefon (Optional)
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="Telefonnummer eingeben"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Passwort <span className="text-red-500">*</span>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Passwort eingeben"
              value={formData.password}
              onChange={handleChange}
              required
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

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Passwort Bestätigen <span className="text-red-500">*</span>
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="password2"
              placeholder="Passwort bestätigen"
              value={formData.password2}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-12 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
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
                Konto wird erstellt...
              </div>
            ) : (
              "Registrieren"
            )}
          </button>
        </form>

        <div className="flex items-center justify-center gap-2 mt-4">
          <h4>Haben Sie bereits ein Konto?</h4>
          <a href="/login" className="text-blue-600 cursor-pointer">
            Hier anmelden
          </a>
        </div>
      </div>
    </div>
  );
}