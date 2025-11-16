import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { FileText, Upload, Users, MapPin, Lock, Unlock, Calendar, Building2, Mail, AlertCircle, CheckCircle, XCircle, RefreshCw, Download, Eye, Trash2, Edit } from "lucide-react";
import { SubscriptionBanner } from "../components/SubscriptionBanner";


interface Location {
  id: number;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  location_id: string;
}

interface ExternalUser {
  id: number;
  username: string;
  email: string;
  company_name: string;
  role?: string;
}

interface LocationAccess {
  id: number;
  location?: Location | number;
  location_detail?: Location;
  external_user?: ExternalUser | number;
  external_user_detail?: ExternalUser;
  granted_by?: number;
  granted_by_detail?: ExternalUser;
  granted_at: string;
  is_active: boolean;
}

interface FormSubmission {
  id: number;
  submitted_by: string | { username: string };
  section: string;
  data: any;
  submitted_at: string;
  locked: boolean;
  location: number;
}

interface DocumentUpload {
  id: number;
  uploaded_by: string | { username: string };
  section: string;
  file_url: string;
  uploaded_at: string;
  locked: boolean;
  location: number;
  resource_type: string
}

const getFormFields = (section: string) => {
  const formConfigs: Record<string, any[]> = {
    "3.1": [
      { name: "disposal_company", label: "Name der Entsorgungsfirma", type: "text", required: true },
      { name: "disposal_date", label: "Letztes Entsorgungsdatum", type: "date", required: true },
      { name: "maintenance_company", label: "Wartungsfirma", type: "text", required: true },
      { name: "maintenance_date", label: "Letztes Wartungsdatum", type: "date", required: true },
      { name: "inspection_company", label: "Inspektionsfirma", type: "text", required: true },
      { name: "inspection_date", label: "Letztes Inspektionsdatum", type: "date", required: true },
      { name: "notes", label: "Zusätzliche Notizen", type: "textarea", required: false },
    ],
    "3.2": [
      { name: "disposal_method", label: "Entsorgungsmethode", type: "select", required: true, options: ["Reguläre Abholung", "Sonderentsorgung", "Recycling", "Andere"] },
      { name: "disposal_frequency", label: "Entsorgungsfrequenz", type: "select", required: true, options: ["Täglich", "Wöchentlich", "Alle zwei Wochen", "Monatlich"] },
      { name: "waste_types", label: "Abfallarten", type: "text", required: true, placeholder: "z. B. Organisch, Fett, Verpackung" },
      { name: "self_inspection_date", label: "Datum der Selbstkontrolle", type: "date", required: true },
      { name: "inspector_name", label: "Name des Prüfers", type: "text", required: true },
      { name: "defects_found", label: "Gefundene Mängel", type: "select", required: true, options: ["Keine", "Geringfügig", "Gravierend"] },
      { name: "corrective_actions", label: "Ergriffene Korrekturmaßnahmen", type: "textarea", required: false },
    ],
    "3.3": [
      { name: "equipment_name", label: "Name der Ausrüstung/System", type: "text", required: true },
      { name: "maintenance_type", label: "Art der Wartung", type: "select", required: true, options: ["Präventiv", "Korrektiv", "Notfall", "Routine"] },
      { name: "technician_name", label: "Name des Technikers", type: "text", required: true },
      { name: "company_name", label: "Servicefirma", type: "text", required: true },
      { name: "maintenance_date", label: "Wartungsdatum", type: "date", required: true },
      { name: "work_performed", label: "Durchgeführte Arbeiten", type: "textarea", required: true },
      { name: "parts_replaced", label: "Ersetzte Teile", type: "text", required: false },
      { name: "next_maintenance_due", label: "Nächste Wartung fällig am", type: "date", required: false },
    ],
    "3.4": [
      { name: "defect_description", label: "Beschreibung des Mangels", type: "textarea", required: true },
      { name: "defect_location", label: "Ort des Mangels", type: "text", required: true },
      { name: "severity", label: "Schweregrad", type: "select", required: true, options: ["Niedrig", "Mittel", "Hoch", "Kritisch"] },
      { name: "detected_date", label: "Entdeckungsdatum", type: "date", required: true },
      { name: "detected_by", label: "Entdeckt von", type: "text", required: true },
      { name: "repair_date", label: "Reparaturdatum", type: "date", required: false },
      { name: "repaired_by", label: "Repariert von", type: "text", required: false },
      { name: "repair_description", label: "Beschreibung der Reparatur", type: "textarea", required: false },
      { name: "status", label: "Status", type: "select", required: true, options: ["Ausstehend", "In Bearbeitung", "Abgeschlossen"] },
    ],
  };

  return formConfigs[section] || [];
};

export const UserDashboard = () => {
  const { user } = useContext(AuthContext);

  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [externalUsers, setExternalUsers] = useState<ExternalUser[]>([]);
  const [locationAccesses, setLocationAccesses] = useState<LocationAccess[]>([]);
  const [forms, setForms] = useState<FormSubmission[]>([]);
  const [documents, setDocuments] = useState<DocumentUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [showGrantAccessModal, setShowGrantAccessModal] = useState(false);
  const [selectedExternalUser, setSelectedExternalUser] = useState("");
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);

  const [formSection, setFormSection] = useState("");
  const [formData, setFormData] = useState<any>({});
  const [submittingForm, setSubmittingForm] = useState(false);

  const [documentSection, setDocumentSection] = useState("");
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [activeTab, setActiveTab] = useState<"overview" | "forms" | "documents" | "access">("overview");

  const [showViewFormModal, setShowViewFormModal] = useState(false);
  const [viewingForm, setViewingForm] = useState<FormSubmission | null>(null);

  const isAdmin = user?.role === "ADMIN" || user?.is_staff || user?.is_superuser;
  const isGastronom = user?.role === "GASTRONOM";
  const isExternal = user?.role === "EXTERNAL";


  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    status: string;
    canUpload: boolean;
  } | null>(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);


  useEffect(() => {
    fetchData();
  }, []);


  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);

    try {
      const token = localStorage.getItem("access");

      if (!token) {
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      const locRes = await api.get("/locations/", { headers });
      const locs = Array.isArray(locRes.data) ? locRes.data : locRes.data.results || [];

      setLocations(locs);

      if (locs.length > 0 && !selectedLocation) {
        setSelectedLocation(locs[0]);

      }
      if (isAdmin || isGastronom) {
        try {
          const usersRes = await api.get("/users/", { headers });
          const allUsers = Array.isArray(usersRes.data) ? usersRes.data : usersRes.data.results || [];
          const externals = allUsers.filter((u: any) => u.role === "EXTERNAL");

          setExternalUsers(externals);
        } catch (err) {
          console.error("❌ Failed to fetch external users:", err);
        }
      }


      const accessRes = await api.get("/location-access/", { headers });
      const accesses = Array.isArray(accessRes.data) ? accessRes.data : accessRes.data.results || [];

      setLocationAccesses(accesses);


      if ((isGastronom && externalUsers.length === 0) || isExternal) {
        const uniqueExternals = new Map();
        accesses.forEach((access: LocationAccess) => {
          const extUser = access.external_user_detail || access.external_user;
          if (extUser && typeof extUser === 'object' && extUser.role === "EXTERNAL") {
            uniqueExternals.set(extUser.id, extUser);
          }
        });
        if (uniqueExternals.size > 0) {
          const extractedExternals = Array.from(uniqueExternals.values());
          setExternalUsers(extractedExternals);
        }
      }


      const formsRes = await api.get("/forms/", { headers });
      const formList = Array.isArray(formsRes.data) ? formsRes.data : formsRes.data.results || [];
      console.log("📝 Forms fetched:", formList);
      setForms(formList);


      const docsRes = await api.get("/documents/", { headers });
      const docList = Array.isArray(docsRes.data) ? docsRes.data : docsRes.data.results || [];

      setDocuments(docList);


    } catch (err) {
      console.error("❌ Failed to fetch data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  useEffect(() => {
    fetchData();
    if (isGastronom) {
      fetchSubscriptionStatus();
    }
  }, []);

  const fetchSubscriptionStatus = async () => {
    try {
      const token = localStorage.getItem("access");
      const response = await api.get("/subscriptions/my-subscription/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubscriptionStatus({
        status: response.data.status,
        canUpload: response.data.can_upload || response.data.status === "ACTIVE"
      });
    } catch (error: any) {
      if (error.response?.status === 404) {
        setSubscriptionStatus({ status: "INACTIVE", canUpload: false });
      }
    } finally {
      setLoadingSubscription(false);
    }
  };

  const showSubscriptionBanner = isGastronom && !subscriptionStatus?.canUpload;

  const handleGrantAccess = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedExternalUser || !selectedLocation) {
      alert("⚠️ Please select an external user and ensure a location is selected.");
      return;
    }


    const existingAccess = locationAccess.find(access => {
      const extUserId = typeof access.external_user === 'number'
        ? access.external_user
        : access.external_user?.id;

      const accessLocationId = typeof access.location === 'number'
        ? access.location
        : access.location?.id;

      return extUserId === Number(selectedExternalUser) &&
        accessLocationId === selectedLocation.id;
    });

    if (existingAccess) {


      if (existingAccess.is_active) {
        alert("⚠️ This external user already has active access to this location.");
        return;
      } else {
        const shouldRestore = confirm(
          "This external user previously had access that was revoked. Would you like to restore their access instead?"
        );

        if (shouldRestore) {
          await handleRestoreAccess(existingAccess.id);
          setShowGrantAccessModal(false);
          setSelectedExternalUser("");
          return;
        } else {
          return;
        }
      }
    }

    try {
      const token = localStorage.getItem("access");

      if (!token) {
        alert("❌ Authentication token not found. Please log in again.");
        return;
      }

      const payload = {
        external_user: Number(selectedExternalUser),
        location: Number(selectedLocation.id)
      };

      await api.post("/location-access/", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });



      const externalUser = externalUsers.find(u => u.id === Number(selectedExternalUser));
      const userName = externalUser?.company_name || externalUser?.username || 'external user';

      alert(`✅ Access granted successfully to ${userName} for ${selectedLocation.name}!`);

      setShowGrantAccessModal(false);
      setSelectedExternalUser("");


      await fetchData(true);

    } catch (error: any) {
      console.error("❌ Failed to grant access:", error);
      console.error("Error response:", error.response);

      let errorMsg = "Failed to grant access";

      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMsg = error.response.data;
        } else if (error.response.data.detail) {
          errorMsg = error.response.data.detail;
        } else if (error.response.data.non_field_errors) {
          errorMsg = error.response.data.non_field_errors.join(', ');
        } else if (error.response.data.external_user) {
          errorMsg = Array.isArray(error.response.data.external_user)
            ? error.response.data.external_user.join(', ')
            : error.response.data.external_user;
        } else if (error.response.data.location) {
          errorMsg = Array.isArray(error.response.data.location)
            ? error.response.data.location.join(', ')
            : error.response.data.location;
        } else {
          const firstError = Object.values(error.response.data)[0];
          if (firstError) {
            errorMsg = Array.isArray(firstError) ? firstError.join(', ') : String(firstError);
          }
        }
      } else if (error.message) {
        errorMsg = error.message;
      }

      alert(`❌ ${errorMsg}`);
    }
  };

  const handleRevokeAccess = async (accessId: number) => {
    if (!confirm("Are you sure you want to revoke access?")) return;

    try {
      const token = localStorage.getItem("access");
      await api.post(
        `/location-access/${accessId}/revoke/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Access revoked successfully!");
      fetchData(true);
    } catch (err) {

      alert("❌ Failed to revoke access");
    }
  };

  const handleRestoreAccess = async (accessId: number) => {
    try {
      const token = localStorage.getItem("access");
      await api.post(
        `/location-access/${accessId}/restore/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Access restored successfully!");
      fetchData(true);
    } catch (err) {
      alert("❌ Failed to restore access");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSection || !selectedLocation) return;

    setSubmittingForm(true);
    try {
      const token = localStorage.getItem("access");
      await api.post(
        "/forms/",
        {
          location: selectedLocation.id,
          section: formSection,
          data: formData,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Form submitted successfully!");
      setShowFormModal(false);
      setFormSection("");
      setFormData({});
      fetchData(true);
    } catch (err: any) {

      const errorMsg = err.response?.data?.detail || "Failed to submit form";
      alert(`❌ ${errorMsg}`);
    } finally {
      setSubmittingForm(false);
    }
  };


  const handleDeleteDocument = async (docId: number) => {
    if (!confirm("Are you sure you want to delete this document? This action cannot be undone.")) {
      return;
    }

    try {
      const token = localStorage.getItem("access");
      await api.delete(`/documents/${docId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("✅ Document deleted successfully!");
      fetchData(true);
    } catch (err: any) {

      const errorMsg = err.response?.data?.detail || "Failed to delete document";
      alert(`❌ ${errorMsg}`);
    }
  };

  const handleDocumentUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentSection || !documentFile || !selectedLocation) return;

    setUploadingDocument(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", documentFile);
      formData.append("section", documentSection);
      formData.append("location", String(selectedLocation.id));

      setUploadProgress(30);

      const token = localStorage.getItem("access");

      await api.post("/documents/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
          );
          setUploadProgress(percentCompleted);
        },
      });

      setUploadProgress(100);
      alert("✅ Document uploaded successfully!");
      setShowDocumentModal(false);
      setDocumentSection("");
      setDocumentFile(null);
      fetchData(true);
    } catch (err: any) {
      console.error("Failed to upload document:", err);
      let errorMsg = "Failed to upload document";

      if (err.response?.data?.file) errorMsg = err.response.data.file[0];
      else if (err.message) errorMsg = err.message;

      alert(`❌ ${errorMsg}`);
    } finally {
      setUploadingDocument(false);
      setUploadProgress(0);
    }
  };


  const handleFormFieldChange = (fieldName: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleViewForm = (form: FormSubmission) => {
    setViewingForm(form);
    setShowViewFormModal(true);
  };

  const getUsername = (user: string | { username: string }): string => {
    if (typeof user === 'string') return user;
    return user?.username || 'Unknown';
  };

  const formSectionChoices = [
    { value: "3.1", label: "3.1 - Nachweis von Entsorgung, Wartung und Inspektion" },
    { value: "3.2", label: "3.2 - Entsorgungs- und Selbstkontrollbericht" },
    { value: "3.3", label: "3.3 - Wartungsbericht" },
    { value: "3.4", label: "3.4 - Bericht über Mängel und Reparaturen" },
  ];


  const getDocumentSectionChoices = () => {
    const allSections = [
      { value: "2.1", label: "2.1 - Genehmigungen und behördliche Zulassungen" },
      { value: "2.2", label: "2.2 - Baugenehmigung oder Sicherheitszertifikat" },
      { value: "2.3", label: "2.3 - Installations- und Bedienungsanleitung" },
      { value: "2.4", label: "2.4 - Wartungszertifikat" },
      { value: "2.5", label: "2.5 - Lagepläne und Schaltpläne" },
      { value: "3.5", label: "3.5 - Entsorgungsnachweis" },
      { value: "3.6", label: "3.6 - Inspektionsbericht (Allgemeine Kontrolle)" },
      { value: "3.7", label: "3.7 - Aufzeichnung von Reinigungsmitteln und eingesetzten Reinigungsstoffen" },
    ];


    if (isExternal) {
      return allSections.filter(s => ["2.4", "3.5", "3.6", "3.7"].includes(s.value));
    }

    return allSections;
  };

  const locationForms = forms.filter(f => f.location === selectedLocation?.id);
  const locationDocuments = documents.filter(d => d.location === selectedLocation?.id);
  const locationAccess = locationAccesses.filter(a => {

    const locationId = typeof a.location === 'number'
      ? a.location
      : a.location?.id;

    return locationId === selectedLocation?.id;
  });

  const stats = {
    totalForms: locationForms.length,
    lockedForms: locationForms.filter(f => f.locked).length,
    totalDocuments: locationDocuments.length,
    lockedDocuments: locationDocuments.filter(d => d.locked).length,
    activeAccess: locationAccess.filter(a => a.is_active).length,
    totalAccess: locationAccess.length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold text-lg">Dashboard wird geladen…</p>
        </div>
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border-2 border-amber-400 rounded-2xl p-8 shadow-2xl">
            <div className="text-center">
              <Lock className="w-20 h-20 mx-auto mb-4 text-amber-500" />
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                {isGastronom ? "Kein Standort zugewiesen" : "Kein Zugriff gewährt"}
              </h1>
              <p className="text-lg text-gray-600 mb-2">
                {isGastronom
                  ? "Ihnen wurde derzeit kein Restaurantstandort zugewiesen."
                  : "Sie haben noch keinen Zugriff auf Restaurantstandorte."}
              </p>
              <p className="text-gray-500 mb-6">
                {isGastronom
                  ? "Bitte kontaktieren Sie Ihren Administrator, um Ihnen einen Standort zuzuweisen."
                  : "Bitte kontaktieren Sie den Restaurantbetreiber (Gastronom), um Ihnen Zugriff zu gewähren."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border-l-4 border-indigo-600">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                {isGastronom ? (
                  <>
                    <Building2 className="w-8 h-8 text-indigo-600" />
                    Dashboard für Gastronomen
                  </>
                ) : (
                  <>
                    <Building2 className="w-8 h-8 text-blue-600" />
                    Dashboard für externe Firmen
                  </>
                )}
              </h1>
              <p className="text-gray-600">
                Herzlich willkommen, <span className="font-semibold text-gray-800">{user?.first_name} {user?.last_name}</span>
                {isExternal && user?.company_name && (
                  <> from <span className="font-semibold text-indigo-600">{user.company_name}</span></>
                )}
              </p>
            </div>
            <button
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-md disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {locations.length > 1 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-600" />
              Standort auswählen
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {locations.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => setSelectedLocation(loc)}
                  className={`p-4 border-2 rounded-xl text-left transition-all ${selectedLocation?.id === loc.id
                    ? "border-indigo-600 bg-indigo-50 shadow-lg scale-105"
                    : "border-gray-300 bg-white hover:border-indigo-400 hover:shadow-md"
                    }`}
                >
                  <p className="font-bold text-lg text-gray-800">{loc.name}</p>
                  <p className="text-sm text-gray-600 mt-1">{loc.location_id}</p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {loc.city}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedLocation && (
          <>
            <div className="bg-linear-to-r from-amber-50 to-yellow-50 rounded-2xl shadow-xl p-6 mb-6 border-2 border-amber-300">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-amber-600" />
                {isGastronom ? "Ihr Restaurantstandort" : "Standortdetails"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-600 mb-1">Restaurantname</p>
                  <p className="text-lg font-semibold text-gray-800">{selectedLocation.name}</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-600 mb-1">Standort-ID</p>
                  <p className="text-lg font-semibold text-amber-700">{selectedLocation.location_id}</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-600 mb-1">Adresse</p>
                  <p className="text-lg font-semibold text-gray-800">{selectedLocation.address}</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-600 mb-1">Stadt & Postleitzahl</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {selectedLocation.city}, {selectedLocation.postal_code}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Gesamtformulare</p>
                    <p className="text-3xl font-bold text-gray-800">{stats.totalForms}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {stats.lockedForms} locked
                    </p>
                  </div>
                  <FileText className="w-12 h-12 text-blue-500 opacity-80" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Gesamtdokumente</p>
                    <p className="text-3xl font-bold text-gray-800">{stats.totalDocuments}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {stats.lockedDocuments} Gesperrt
                    </p>
                  </div>
                  <Upload className="w-12 h-12 text-green-500 opacity-80" />
                </div>
              </div>



              {isGastronom && (
                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Aktiver Zugriff</p>
                      <p className="text-3xl font-bold text-gray-800">{stats.activeAccess}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        of {stats.totalAccess}Gesamt
                      </p>
                    </div>
                    <Users className="w-12 h-12 text-purple-500 opacity-80" />
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-t-2xl shadow-lg">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`flex-1 px-6 py-4 font-semibold transition-all ${activeTab === "overview"
                    ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                    }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Übersicht
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("forms")}
                  className={`flex-1 px-6 py-4 font-semibold transition-all ${activeTab === "forms"
                    ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                    }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <FileText className="w-5 h-5" />
                    Formulare ({stats.totalForms})
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("documents")}
                  className={`flex-1 px-6 py-4 font-semibold transition-all ${activeTab === "documents"
                    ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                    }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Upload className="w-5 h-5" />
                    Dokumente ({stats.totalDocuments})
                  </div>
                </button>
                {isGastronom && (
                  <button
                    onClick={() => setActiveTab("access")}
                    className={`flex-1 px-6 py-4 font-semibold transition-all ${activeTab === "access"
                      ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                      }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Users className="w-5 h-5" />
                      Zugriff ({stats.activeAccess})
                    </div>
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-b-2xl shadow-lg p-6 mb-6">

              {activeTab === "overview" && (

                <div className="space-y-6">
                  {showSubscriptionBanner && (
                    <SubscriptionBanner
                      message="Your subscription is inactive. You can view existing data but cannot upload new forms or documents."
                      showRenewButton={true}
                    />
                  )}
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Schnellaktionen</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => setActiveTab("forms")}
                      className="bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-6 rounded-xl shadow-lg font-semibold transition-all hover:shadow-xl transform hover:-translate-y-1">
                      <FileText className="w-12 h-12 mx-auto mb-3" />
                      <span className="block text-lg">Formulare ausfüllen</span>
                      <p className="text-sm opacity-90 mt-2">Erforderliche Dokumentation abschließen</p>
                    </button>

                    <button
                      onClick={() => setActiveTab("documents")}
                      className="bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-6 rounded-xl shadow-lg font-semibold transition-all hover:shadow-xl transform hover:-translate-y-1">
                      <Upload className="w-12 h-12 mx-auto mb-3" />
                      <span className="block text-lg">Dokumente hochladen</span>
                      <p className="text-sm opacity-90 mt-2">PDF-Dateien und Bilder hochladen</p>
                    </button>

                    {isGastronom && (
                      <button
                        onClick={() => setShowGrantAccessModal(true)}
                        className="bg-linear-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-6 rounded-xl shadow-lg font-semibold transition-all hover:shadow-xl transform hover:-translate-y-1"
                      >
                        <Users className="w-12 h-12 mx-auto mb-3" />
                        <span className="block text-lg">Zugriff gewähren</span>
                        <p className="text-sm opacity-90 mt-2">Externe Firmen hinzufügen</p>
                      </button>
                    )}
                  </div>

                  {isExternal && (
                    <div className="mt-8">
                      <h3 className="text-2xl font-bold text-gray-800 mb-4">Verfügbare Upload-Bereiche</h3>
                      <p className="text-gray-600 mb-4">
                        Als externes Unternehmen können Sie Dokumente in die folgenden Bereiche hochladen:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border-l-4 border-green-500 bg-green-50 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                          <p className="font-bold text-gray-800 text-lg mb-2">2.4 - Wartungszertifikat</p>
                          <p className="text-sm text-gray-600">Wartungsberichte und Zertifikate</p>
                        </div>
                        <div className="border-l-4 border-blue-500 bg-blue-50 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                          <p className="font-bold text-gray-800 text-lg mb-2">3.5 - Abfallentsorgungsprotokoll</p>
                          <p className="text-sm text-gray-600">Entsorgungszertifikate und Abfallwirtschaftsberichte hochladen</p>
                        </div>
                        <div className="border-l-4 border-purple-500 bg-purple-50 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                          <p className="font-bold text-gray-800 text-lg mb-2">3.6 - Prüfbericht</p>
                          <p className="text-sm text-gray-600">Allgemeine Inspektionsdokumentation und Compliance-Berichte</p>
                        </div>
                        <div className="border-l-4 border-amber-500 bg-amber-50 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                          <p className="font-bold text-gray-800 text-lg mb-2">3.7 - Reinigungs- & Reinigungsmittelprotokoll</p>
                          <p className="text-sm text-gray-600">Aufzeichnung der verwendeten Reinigungsmittel und Reinigungsarbeiten</p>
                        </div>
                      </div>

                      <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                        <p className="text-sm text-gray-700">
                          <strong>Hinweis:</strong> Gastronomen können in alle Abschnitte (2.1 - 3.7) hochladen. Externe Unternehmen sind auf bestimmte Wartungs-, Abfall- und Inspektionsabschnitte beschränkt.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "forms" && (

                <div>

                  {showSubscriptionBanner && (
                    <SubscriptionBanner
                      message="Your subscription is inactive. Please renew to submit new forms."
                      showRenewButton={true}
                    />
                  )}
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">Formularübermittlungen</h3>
                    <button
                      onClick={() => setShowFormModal(true)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-md">
                      <FileText className="w-4 h-4" />
                      Neues Formular
                    </button>
                  </div>

                  {locationForms.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500 text-lg">Für diesen Standort wurden noch keine Formulare eingereicht.</p>
                      <button
                        onClick={() => setShowFormModal(true)}
                        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold">
                        Reichen Sie Ihr erstes Formular ein
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {locationForms.map((form) => (
                        <div
                          key={form.id}
                          className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all bg-white"
                        >
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex-1">
                              <div className="flex items-start gap-3">
                                <FileText className="w-5 h-5 text-blue-500 mt-1" />
                                <div>
                                  <h4 className="font-bold text-lg text-gray-800">{form.section}</h4>
                                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                                    <span className="flex items-center gap-1">
                                      <Users className="w-4 h-4" />
                                      Eingereicht von: <strong>{getUsername(form.submitted_by)}</strong>
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Calendar className="w-4 h-4" />
                                      {new Date(form.submitted_at).toLocaleDateString('en-US', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${form.locked
                                  ? "bg-green-100 text-green-800"
                                  : "bg-amber-100 text-amber-800"
                                  }`}
                              >
                                {form.locked ? (
                                  <>
                                    <Lock className="w-4 h-4" />
                                    Gesperrt
                                  </>
                                ) : (
                                  <>
                                    <Unlock className="w-4 h-4" />
                                    Bearbeitbar
                                  </>
                                )}
                              </span>
                              <button
                                onClick={() => handleViewForm(form)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title="View Form"
                              >
                                <Eye className="w-5 h-5 text-gray-600" />
                              </button>
                              {!form.locked && (
                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                  <Edit className="w-5 h-5 text-blue-600" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {activeTab === "documents" && (
                <div>

                  {showSubscriptionBanner && (
                    <SubscriptionBanner
                      message="Your subscription is inactive. Please renew to submit new forms."
                      showRenewButton={true}
                    />
                  )}
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">Dokumenten-Uploads</h3>
                    <button
                      onClick={() => setShowDocumentModal(true)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-md">
                      <Upload className="w-4 h-4" />
                      Dokument hochladen
                    </button>
                  </div>

                  {locationDocuments.length === 0 ? (
                    <div className="text-center py-12">
                      <Upload className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500 text-lg">Für diesen Standort wurden noch keine Dokumente hochgeladen.</p>
                      <button
                        onClick={() => setShowDocumentModal(true)}
                        className="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold">
                        Laden Sie Ihr erstes Dokument hoch
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {locationDocuments.map((doc) => (
                        <div
                          key={doc.id}
                          className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all bg-white"
                        >
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex-1">
                              <div className="flex items-start gap-3">
                                <Upload className="w-5 h-5 text-green-500 mt-1" />
                                <div>
                                  <h4 className="font-bold text-lg text-gray-800">{doc.section}</h4>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {doc.file_url ? doc.file_url.split("/").pop() : "document.pdf"}
                                  </p>
                                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                                    <span className="flex items-center gap-1">
                                      <Users className="w-4 h-4" />
                                      Uploaded by: <strong>{getUsername(doc.uploaded_by)}</strong>
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Calendar className="w-4 h-4" />
                                      {new Date(doc.uploaded_at).toLocaleDateString("en-US", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 bg-green-100 text-green-800">
                                <Lock className="w-4 h-4" /> Gesperrt
                              </span>

                              {doc.file_url && (
                                <button
                                  onClick={() => {
                                    let fileUrl = doc.file_url;


                                    if (doc.resource_type === 'raw' && !fileUrl.endsWith('.pdf')) {
                                      fileUrl += '.pdf';
                                    }

                                    console.log('Opening document:', fileUrl);
                                    console.log('Resource type:', doc.resource_type);
                                    window.open(fileUrl, '_blank', 'noopener,noreferrer');
                                  }}
                                  className="p-2 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200 hover:border-blue-400"
                                  title="View Document"
                                >
                                  <Eye className="w-5 h-5 text-blue-600" />
                                </button>
                              )}

                              {doc.file_url && (
                                <a
                                  href={doc.file_url}
                                  download
                                  className="p-2 hover:bg-green-50 rounded-lg transition-colors border border-green-200 hover:border-green-400"
                                  title="Download Document"
                                >
                                  <Download className="w-5 h-5 text-green-600" />
                                </a>
                              )}


                              {isAdmin && (
                                <button
                                  onClick={() => handleDeleteDocument(doc.id)}
                                  className="p-2 hover:bg-red-50 rounded-lg transition-colors border border-red-200 hover:border-red-400"
                                  title="Delete Document"
                                >
                                  <Trash2 className="w-5 h-5 text-red-600" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "access" && isGastronom && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">Zugriff für externe Firmen</h3>
                    <button
                      onClick={() => setShowGrantAccessModal(true)}
                      className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-md"
                    >
                      <Users className="w-4 h-4" />
                      Zugriff gewähren
                    </button>
                  </div>

                  {locationAccess.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500 text-lg">No external companies have been granted access yet.</p>
                      <button
                        onClick={() => setShowGrantAccessModal(true)}
                        className="mt-4 bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold"
                      >
                        Zugriff für externes Unternehmen gewähren
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-linear-to-r from-gray-50 to-gray-100">
                            <th className="p-4 text-left border-b-2 border-gray-300 font-bold text-gray-700">
                              Firmenname
                            </th>
                            <th className="p-4 text-left border-b-2 border-gray-300 font-bold text-gray-700">
                              Kontakt-E-Mail
                            </th>
                            <th className="p-4 text-left border-b-2 border-gray-300 font-bold text-gray-700">
                              Gewährt am
                            </th>
                            <th className="p-4 text-left border-b-2 border-gray-300 font-bold text-gray-700">
                              Status
                            </th>
                            <th className="p-4 text-left border-b-2 border-gray-300 font-bold text-gray-700">
                              Aktionen
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {locationAccess.map((access) => {

                            const externalUser = access.external_user_detail ||
                              (typeof access.external_user === 'object' ? access.external_user : null);


                            if (!externalUser) {
                              console.warn('⚠️ Missing external user details for access:', access);
                              return (
                                <tr key={access.id} className="hover:bg-gray-50 border-b transition-colors">
                                  <td colSpan={5} className="p-4 text-center text-red-500">
                                    <AlertCircle className="w-5 h-5 inline mr-2" />
                                    Benutzerdaten fehlen für Zugriffs-ID: {access.id}
                                  </td>
                                </tr>
                              );
                            }

                            return (
                              <tr
                                key={access.id}
                                className="hover:bg-gray-50 border-b transition-colors"
                              >
                                <td className="p-4 border-b">
                                  <div className="flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-gray-400" />
                                    <div>
                                      <p className="font-semibold text-gray-800">
                                        {externalUser.company_name || 'N/A'}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {externalUser.username || 'N/A'}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4 border-b">
                                  <div className="flex items-center gap-2 text-gray-700">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    {externalUser.email || 'N/A'}
                                  </div>
                                </td>
                                <td className="p-4 border-b text-gray-700">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    {new Date(access.granted_at).toLocaleDateString('en-US', {
                                      day: '2-digit',
                                      month: 'short',
                                      year: 'numeric'
                                    })}
                                  </div>
                                </td>
                                <td className="p-4 border-b">
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${access.is_active
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                      }`}
                                  >
                                    {access.is_active ? (
                                      <>
                                        <CheckCircle className="w-4 h-4" />
                                        Aktiv
                                      </>
                                    ) : (
                                      <>
                                        <XCircle className="w-4 h-4" />
                                        Widerrufen
                                      </>
                                    )}
                                  </span>
                                </td>
                                <td className="p-4 border-b">
                                  {access.is_active ? (
                                    <button
                                      onClick={() => handleRevokeAccess(access.id)}
                                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1"
                                    >
                                      <XCircle className="w-4 h-4" />
                                      Widerrufen
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleRestoreAccess(access.id)}
                                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                      Wiederherstellen
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>


      {showGrantAccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleGrantAccess}
            className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-600" />
              Externem Unternehmen Zugriff gewähren
            </h2>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                *Externes Unternehmen auswählen*
              </label>
              <select
                value={selectedExternalUser}
                onChange={(e) => setSelectedExternalUser(e.target.value)}
                className="w-full border-2 border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                required
              >
                <option value=""> Unternehmen auswählen </option>
                {externalUsers.map((ext) => (
                  <option key={ext.id} value={ext.id}>
                    {ext.company_name} ({ext.email})
                  </option>
                ))}
              </select>
              {externalUsers.length === 0 && (
                <div className="flex items-start gap-2 mt-2 text-sm text-amber-600">
                  <AlertCircle className="w-4 h-4 mt-0.5" />
                  <p>
                    {isAdmin
                      ? "Keine externen Firmen verfügbar. Erstellen Sie zuerst externe Benutzerkonten."
                      : "Keine externen Firmen verfügbar. Bitte kontaktieren Sie Ihren Administrator, um externe Benutzerkonten zu erstellen."
                    }
                  </p>
                </div>
              )}
            </div>

            <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-700">
                    <strong>Hinweis:</strong> Dieses Unternehmen kann Dokumente hochladen und Informationen einsehen für <strong>{selectedLocation?.name}</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowGrantAccessModal(false);
                  setSelectedExternalUser("");
                }}
                className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold transition-all"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                disabled={!selectedExternalUser}
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Zugriff gewähren
              </button>
            </div>
          </form>
        </div>
      )}

      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <form
            onSubmit={handleFormSubmit}
            className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-3xl my-8"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              Neues Formular einrei
            </h2>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Formularbereich *
              </label>
              <select
                value={formSection}
                onChange={(e) => {
                  setFormSection(e.target.value);
                  setFormData({});
                }}
                className="w-full border-2 border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              >
                <option value=""> Abschnitt auswählen </option>
                {formSectionChoices.map((section) => (
                  <option key={section.value} value={section.value}>
                    {section.label}
                  </option>
                ))}
              </select>
            </div>

            {formSection && (
              <div className="mb-6 space-y-4 max-h-96 overflow-y-auto pr-2">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 sticky top-0 bg-white z-10">Form Fields</h3>
                {getFormFields(formSection).map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>

                    {field.type === "text" && (
                      <input
                        type="text"
                        value={formData[field.name] || ""}
                        onChange={(e) => handleFormFieldChange(field.name, e.target.value)}
                        className="w-full border-2 border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder={field.placeholder || ""}
                        required={field.required}
                      />
                    )}

                    {field.type === "date" && (
                      <input
                        type="date"
                        value={formData[field.name] || ""}
                        onChange={(e) => handleFormFieldChange(field.name, e.target.value)}
                        className="w-full border-2 border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required={field.required}
                      />
                    )}

                    {field.type === "select" && (
                      <select
                        value={formData[field.name] || ""}
                        onChange={(e) => handleFormFieldChange(field.name, e.target.value)}
                        className="w-full border-2 border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required={field.required}
                      >
                        <option value="">-- Select {field.label} --</option>
                        {field.options?.map((option: string) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}

                    {field.type === "textarea" && (
                      <textarea
                        value={formData[field.name] || ""}
                        onChange={(e) => handleFormFieldChange(field.name, e.target.value)}
                        className="w-full border-2 border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        rows={4}
                        placeholder={field.placeholder || ""}
                        required={field.required}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-700">
                    <strong>Standort:</strong> {selectedLocation?.name}<br />
                    <strong>Hinweis:</strong> Nach dem Absenden sind Formulare standardmäßig gesperrt und können nicht mehr bearbeitet werden.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowFormModal(false);
                  setFormSection("");
                  setFormData({});
                }}
                className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold transition-all"
                disabled={submittingForm}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!formSection || submittingForm}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                {submittingForm ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Wird gesendet…
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Formular absenden
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {showDocumentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleDocumentUpload}
            className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              <Upload className="w-6 h-6 text-green-600" />
              Dokument hochladen
            </h2>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Dokumentenbereich *
              </label>
              <select
                value={documentSection}
                onChange={(e) => setDocumentSection(e.target.value)}
                className="w-full border-2 border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                required
              >
                <option value=""> Bereich auswählen </option>
                {getDocumentSectionChoices().map((section) => (
                  <option key={section.value} value={section.value}>
                    {section.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Datei auswählen *
              </label>
              <input
                type="file"
                onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
                className="w-full border-2 border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                accept=".pdf,.jpg,.jpeg,.png"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                Akzeptierte Formate: PDF, JPG, PNG (Max. 10MB)
              </p>
            </div>

            {documentFile && (
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-3 mb-6">
                <p className="text-sm text-gray-700">
                  <strong>Selected File:</strong> {documentFile.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Größe: {(documentFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}

            {uploadingDocument && uploadProgress > 0 && (
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Hochladen…</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-700">
                    <strong>Standort:</strong> {selectedLocation?.name}<br />
                    <strong>Status:</strong> Dateien werden in Cloudinary hochgeladen und sicher gespeichert.<br />
                    <strong>Hinweis:</strong> Dokumente werden nach dem Hochladen standardmäßig gesperrt.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowDocumentModal(false);
                  setDocumentSection("");
                  setDocumentFile(null);
                  setUploadProgress(0);
                }}
                className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold transition-all"
                disabled={uploadingDocument}
              >
                Abbrechen
              </button>
              <button
                type="submit"
                disabled={!documentSection || !documentFile || uploadingDocument}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                {uploadingDocument ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Hochladen…
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Dokument hochladen
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {showViewFormModal && viewingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-3xl my-8">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" />
                Formulareinreichung ansehen
              </h2>
              <button
                onClick={() => {
                  setShowViewFormModal(false);
                  setViewingForm(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-linear-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Abschnitt</p>
                  <p className="text-lg font-semibold text-gray-800">{viewingForm.section}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Eingereicht von</p>
                  <p className="text-lg font-semibold text-gray-800">{getUsername(viewingForm.submitted_by)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Eingereicht am</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {new Date(viewingForm.submitted_at).toLocaleDateString('en-US', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${viewingForm.locked
                      ? "bg-green-100 text-green-800"
                      : "bg-amber-100 text-amber-800"
                      }`}
                  >
                    {viewingForm.locked ? (
                      <>
                        <Lock className="w-4 h-4" />
                        Gesperrt
                      </>
                    ) : (
                      <>
                        <Unlock className="w-4 h-4" />
                        Bearbeitbar
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Form Data</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {getFormFields(viewingForm.section).map((field) => {
                  const value = viewingForm.data[field.name];

                  return (
                    <div key={field.name} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {field.label}
                      </label>

                      {field.type === "textarea" ? (
                        <p className="text-gray-800 whitespace-pre-wrap">
                          {value || <span className="text-gray-400 italic">Not provided</span>}
                        </p>
                      ) : field.type === "date" ? (
                        <p className="text-gray-800">
                          {value ? new Date(value).toLocaleDateString('en-US', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          }) : <span className="text-gray-400 italic">Not provided</span>}
                        </p>
                      ) : (
                        <p className="text-gray-800">
                          {value || <span className="text-gray-400 italic">Not provided</span>}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowViewFormModal(false);
                  setViewingForm(null);
                }}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold transition-all"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};