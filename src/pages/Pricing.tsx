import { Check, ArrowLeft } from "lucide-react";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [subscription, setSubscription] = useState<{
    status: string;
    endDate: string;
    planType: "MONTHLY" | "YEARLY";
  } | null>(null);
  const [fetchingSubscription, setFetchingSubscription] = useState(true);


  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) {
        setFetchingSubscription(false);
        return;
      }

      try {
        const res = await api.get('/subscriptions/my-subscription/');

        if (res.data) {
          const subscriptionData = {
            status: res.data.status,
            endDate: res.data.current_period_end || res.data.end_date || res.data.endDate || '',
            planType: res.data.plan_type || res.data.planType,
          };
          setSubscription(subscriptionData);
        }
      } catch (err: any) {
        if (err.response?.status !== 404) {
          console.error("Abonnement konnte nicht geladen werden:", err);
        }
      } finally {
        setFetchingSubscription(false);
      }
    };

    fetchSubscription();
  }, [user]);

  const monthlyFeatures = [
    "Monatliche Entsorgungsdokumentation",
    "Verwaltung von Selbstkontrollprotokollen",
    "Digitale Speicherung",
    "Rechtskonforme Aufzeichnungen",
    "Zugriff auf historische Daten",
    "Sichere Datenintegrität",
  ];

  const yearlyFeatures = [
    "Alle monatlichen Funktionen",
    "Mühelose digitale Datenspeicherung",
    "Schneller Zugriff auf historische Daten",
    "Einhaltung gesetzlicher Vorschriften",
    "Zuverlässige digitale Speicherung",
    "Umfassende Compliance-Sicherheit",
  ];

  const handleSubscribe = async (planType: "MONTHLY" | "YEARLY") => {
    if (!user) {
      alert("Bitte melden Sie sich als Gastronom-Benutzer an, um zu abonnieren.");
      window.location.href = "/login";
      return;
    }

    if (user.role !== "GASTRONOM") {
      alert("Nur Gastronom-Benutzer können abonnieren.");
      return;
    }

    if (!user.assigned_location) {
      alert("Sie benötigen einen zugewiesenen Standort, um ein Abonnement zu starten.");
      return;
    }

    const token = localStorage.getItem("access");
    if (!token) {
      alert("Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.");
      localStorage.clear();
      window.location.href = "/login";
      return;
    }

    setLoading((prev) => ({ ...prev, [planType]: true }));

    try {
      const response = await api.post("/subscriptions/create-checkout-session/", {
        plan_type: planType,
        location_id: user.assigned_location,
      });

      window.location.href = response.data.checkout_url;
    } catch (err: any) {
      console.error("Abonnement-Fehler:", err.response);
      if (err.response?.status === 401) {
        alert("Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.");
        localStorage.clear();
        window.location.href = "/login";
        return;
      }
      alert(err.response?.data?.detail || "Fehler beim Erstellen der Checkout-Sitzung.");
    } finally {
      setLoading((prev) => ({ ...prev, [planType]: false }));
    }
  };

  const isSubscribed = (planType: "MONTHLY" | "YEARLY") => {
    return subscription && subscription.status === "ACTIVE" && subscription.planType === planType;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';

    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        console.error('Ungültiges Datumsformat:', dateString);
        return dateString;
      }

      return date.toLocaleDateString('de-DE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Fehler beim Formatieren des Datums:', error);
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-6 py-12">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-medium mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Zurück
        </button>

        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Einmal zahlen, für immer nutzen
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Starten Sie mit dem digitalen Fettabscheider-Logbuch<br />
            Ihr Partner für die Küchenabwasserentsorgung
          </p>
        </div>

        {fetchingSubscription ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Abonnementstatus wird geladen...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Monatlich</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900">3,99 €</span>
                  <span className="text-gray-600 text-lg">/Monat</span>
                </div>
                {isSubscribed("MONTHLY") ? (
                  <div>
                    <button
                      disabled
                      className="w-full py-3 px-6 rounded-lg font-semibold bg-green-100 text-green-700 cursor-not-allowed border-2 border-green-300"
                    >
                      ✓ Aktives Abonnement
                    </button>
                    <p className="mt-3 text-sm text-gray-600">
                      Läuft ab am: <span className="font-semibold">{formatDate(subscription!.endDate)}</span>
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => handleSubscribe("MONTHLY")}
                    disabled={loading["MONTHLY"] || !!(subscription && subscription.status === "ACTIVE")}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition ${loading["MONTHLY"] || (subscription && subscription.status === "ACTIVE")
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                      }`}
                  >
                    {loading["MONTHLY"] ? "Wird geladen..." : "Jetzt abonnieren"}
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {monthlyFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>


            <div className="relative bg-white rounded-2xl shadow-xl p-8 ring-2 ring-indigo-600 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="absolute top-0 right-8 transform -translate-y-1/2">
                <span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                  Bester Wert
                </span>
              </div>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Jährlich</h3>
                <div className="mb-2">
                  <span className="text-5xl font-bold text-gray-900">39,99 €</span>
                  <span className="text-gray-600 text-lg">/Jahr</span>
                </div>
                <p className="text-sm text-indigo-600 font-semibold mb-6">
                  Sparen Sie 7,89 € pro Jahr
                </p>
                {isSubscribed("YEARLY") ? (
                  <div>
                    <button
                      disabled
                      className="w-full py-3 px-6 rounded-lg font-semibold bg-green-100 text-green-700 cursor-not-allowed border-2 border-green-300"
                    >
                      ✓ Aktives Abonnement
                    </button>
                    <p className="mt-3 text-sm text-gray-600">
                      Läuft ab am: <span className="font-semibold">{formatDate(subscription!.endDate)}</span>
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => handleSubscribe("YEARLY")}
                    disabled={loading["YEARLY"] || !!(subscription && subscription.status === "ACTIVE")}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition ${loading["YEARLY"] || (subscription && subscription.status === "ACTIVE")
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                      }`}
                  >
                    {loading["YEARLY"] ? "Wird geladen..." : "Jetzt abonnieren"}
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {yearlyFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pricing;