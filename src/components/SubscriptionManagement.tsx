import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ArrowLeft,
  Loader2,
  Check
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";

interface Subscription {
  id: number;
  status: string;
  plan_type: "MONTHLY" | "YEARLY";
  current_period_start: string;
  current_period_end: string;
  can_upload: boolean;
  stripe_subscription_id: string;
  created_at: string;
}

const SubscriptionManagement = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const response = await api.get("/subscriptions/my-subscription/");
      setSubscription(response.data);
    } catch (error: any) {
      if (error.response?.status !== 404) {
        console.error("Failed to fetch subscription:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setCanceling(true);
    try {
      await api.post("/subscriptions/cancel/");
      alert("✅ Abonnement gekündigt. Es bleibt bis zum Ende Ihres Abrechnungszeitraums aktiv.");
      await fetchSubscription();
      setShowCancelModal(false);
    } catch (error: any) {
      alert("❌ " + (error.response?.data?.detail || "Abonnement konnte nicht gekündigt werden"));
    } finally {
      setCanceling(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("de-DE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-green-100 text-green-800 border-2 border-green-300">
            <CheckCircle className="w-5 h-5" />
            Aktiv
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-red-100 text-red-800 border-2 border-red-300">
            <XCircle className="w-5 h-5" />
            Gekündigt
          </span>
        );
      case "PAST_DUE":
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-amber-100 text-amber-800 border-2 border-amber-300">
            <AlertCircle className="w-5 h-5" />
            Überfällig
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-gray-100 text-gray-800 border-2 border-gray-300">
            <XCircle className="w-5 h-5" />
            Inaktiv
          </span>
        );
    }
  };

  const getPlanPrice = (planType: string) => {
    return planType === "MONTHLY" ? "€3,99/Monat" : "€39,99/Jahr";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Abonnementdetails werden geladen...</p>
        </div>
      </div>
    );
  }


  if (!subscription) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/user")}
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-medium mb-6 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Zurück zum Dashboard
          </button>

          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <CreditCard className="w-20 h-20 mx-auto mb-6 text-gray-300" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Kein aktives Abonnement
            </h1>
            <p className="text-gray-600 mb-8 text-lg">
              Abonnieren Sie, um alle Funktionen freizuschalten und Dokumente hochzuladen.
            </p>
            <button
              onClick={() => navigate("/pricing")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-lg text-lg transition-all shadow-lg hover:shadow-xl"
            >
              Abonnementpläne anzeigen
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
       
        <div className="mb-8">
          <button
            onClick={() => navigate("/user")}
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-medium mb-4 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Zurück zum Dashboard
          </button>
          <h1 className="text-4xl font-bold text-gray-900">Abonnementverwaltung</h1>
          <p className="text-gray-600 mt-2">Verwalten Sie Ihr Abonnement und Ihre Rechnungsinformationen</p>
        </div>

       
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border-t-4 border-indigo-600">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Aktuelles Abonnement</h2>
              <p className="text-gray-600">Ihr aktiver Abonnementplan und Status</p>
            </div>
            {getStatusBadge(subscription.status)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           
            <div className="bg-linear-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-indigo-600 p-2 rounded-lg">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Plan</p>
                  <p className="text-xl font-bold text-gray-900">
                    {subscription.plan_type === "MONTHLY" ? "Monatlich" : "Jährlich"}
                  </p>
                </div>
              </div>
              <p className="text-2xl font-bold text-indigo-600">
                {getPlanPrice(subscription.plan_type)}
              </p>
            </div>

          
            <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-green-600 p-2 rounded-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Gestartet am</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatDate(subscription.current_period_start)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-linear-to-br from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-amber-600 p-2 rounded-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    {subscription.status === "CANCELLED" ? "Läuft ab am" : "Verlängert sich am"}
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatDate(subscription.current_period_end)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Ihr Plan beinhaltet</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Unbegrenzte Formularübermittlungen",
              "Dokumenten-Uploads und Speicherung",
              "Digitale Aufzeichnungen",
              "Rechtskonforme Aufzeichnungen",
              "Zugriff auf historische Daten",
              "Sichere Datenintegrität",
            ].map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="bg-green-100 rounded-full p-1 mt-0.5">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-gray-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Change Plan */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Plan ändern</h3>
            <p className="text-gray-600 mb-4 text-sm">
              Wechseln Sie zwischen monatlicher und jährlicher Abrechnung
            </p>
            <button
              onClick={() => navigate("/pricing")}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-all"
            >
              Pläne anzeigen
            </button>
          </div>

          {/* Cancel Subscription */}
          {subscription.status === "ACTIVE" && (
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-red-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Abonnement kündigen</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Ihr Abonnement bleibt aktiv bis zum {formatDate(subscription.current_period_end)}
              </p>
              <button
                onClick={() => setShowCancelModal(true)}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-all"
              >
                Abonnement kündigen
              </button>
            </div>
          )}
        </div>

      

   
     
      </div>

   
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Abonnement kündigen?</h2>
              <p className="text-gray-600">
                Ihr Abonnement bleibt aktiv bis zum{" "}
                <span className="font-semibold">{formatDate(subscription.current_period_end)}</span>. 
                Danach können Sie keine neuen Dokumente oder Formulare mehr hochladen.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleCancelSubscription}
                disabled={canceling}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50"
              >
                {canceling ? "Kündigung läuft..." : "Ja, Abonnement kündigen"}
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={canceling}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-all"
              >
                Abonnement behalten
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManagement;