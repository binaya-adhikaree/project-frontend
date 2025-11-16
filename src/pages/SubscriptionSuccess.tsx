import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import api from "../api/axios";

const SubscriptionSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const verifySession = async () => {
      const sessionId = searchParams.get("session_id");

      if (!sessionId) {
        setError("Keine Sitzungs-ID gefunden");
        setVerifying(false);
        return;
      }

      try {
     
        await new Promise(resolve => setTimeout(resolve, 2000));
        
       
        const response = await api.get("/subscriptions/my-subscription/");
        
        if (response.data && response.data.status === "ACTIVE") {
          setSuccess(true);
        } else {
          setError("Zahlungsüberprüfung läuft. Bitte überprüfen Sie in einem Moment erneut.");
        }
      } catch (err: any) {
        console.error("Verification error:", err);
        
        if (err.response?.status === 404) {
          setError("Abonnement wird aktiviert. Bitte aktualisieren Sie in einem Moment.");
        } else {
          setError(err.response?.data?.detail || "Zahlung konnte nicht überprüft werden");
        }
      } finally {
        setVerifying(false);
      }
    };

    verifySession();
  }, [searchParams]);

  if (verifying) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Ihre Zahlung wird überprüft...
          </h2>
          <p className="text-gray-600">Bitte warten Sie, während wir Ihr Abonnement bestätigen.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-10 h-10 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Zahlung wird verarbeitet
          </h2>
          {success ? "" : ""}
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              Status aktualisieren
            </button>
            <button
              onClick={() => navigate("/user")}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition"
            >
              Zurück zum Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Zahlung erfolgreich!
        </h2>
        <p className="text-gray-600 mb-6">
          Vielen Dank für Ihr Abonnement. Ihr Abonnement ist jetzt aktiv und Sie haben vollen Zugriff auf alle Funktionen.
        </p>
        
        <div className="bg-indigo-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-indigo-800 font-medium">
            🎉 Ihr Abonnement wurde aktiviert
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate("/user")}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            Zum Dashboard
          </button>
          <button
            onClick={() => navigate("/pricing")}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition"
          >
            Abonnementdetails anzeigen
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;