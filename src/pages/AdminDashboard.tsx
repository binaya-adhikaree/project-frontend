import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { Eye, Trash2, Lock, Unlock, Edit, ArrowLeft, FileText, Upload as UploadIcon } from "lucide-react";

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'ADMIN' | "GASTRONOM" | "EXTERNAL";
  phone?: string;
  company_name?: string;
  assigned_location?: number | null;
}

interface Location {
  id: number;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  location_id: string;
  current_operator?: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
  } | null;
}

interface Document {
  id: number;
  section: string;
  file_url: string;
  uploaded_by: string | { username: string; first_name: string; last_name: string };
  location: number;
  locked: boolean;
  uploaded_at: string;
  resource_type: string
}

interface FormSubmission {
  id: number;
  section: string;
  data: any;
  submitted_by: string | { username: string; first_name: string; last_name: string };
  location: number;
  locked: boolean;
  submitted_at: string;
}

const getFormFields = (section: string) => {
  const formConfigs: Record<string, any[]> = {
    "3.1": [
      { name: "disposal_company", label: "Name des Entsorgungsunternehmens", type: "text" },
      { name: "disposal_date", label: "Letztes Entsorgungsdatum", type: "date" },
      { name: "maintenance_company", label: "Wartungsunternehmen", type: "text" },
      { name: "maintenance_date", label: "Letztes Wartungsdatum", type: "date" },
      { name: "inspection_company", label: "Inspektionsunternehmen", type: "text" },
      { name: "inspection_date", label: "Letztes Inspektionsdatum", type: "date" },
      { name: "notes", label: "Zusätzliche Anmerkungen", type: "textarea" },
    ],
    "3.2": [
      { name: "disposal_method", label: "Entsorgungsmethode", type: "select", options: ["Reguläre Abholung", "Sonderentsorgung", "Recycling", "Andere"] },
      { name: "disposal_frequency", label: "Entsorgungsfrequenz", type: "select", options: ["Täglich", "Wöchentlich", "Alle zwei Wochen", "Monatlich"] },
      { name: "waste_types", label: "Abfallarten", type: "text" },
      { name: "self_inspection_date", label: "Selbstinspektionsdatum", type: "date" },
      { name: "inspector_name", label: "Name des Inspektors", type: "text" },
      { name: "defects_found", label: "Gefundene Mängel", type: "select", options: ["Keine", "Geringfügig", "Erheblich"] },
      { name: "corrective_actions", label: "Ergriffene Korrekturmaßnahmen", type: "textarea" },
    ],
    "3.3": [
      { name: "equipment_name", label: "Name des Geräts/Systems", type: "text" },
      { name: "maintenance_type", label: "Wartungsart", type: "select", options: ["Präventiv", "Korrektiv", "Notfall", "Routine"] },
      { name: "technician_name", label: "Name des Technikers", type: "text" },
      { name: "company_name", label: "Serviceunternehmen", type: "text" },
      { name: "maintenance_date", label: "Wartungsdatum", type: "date" },
      { name: "work_performed", label: "Durchgeführte Arbeiten", type: "textarea" },
      { name: "parts_replaced", label: "Ausgetauschte Teile", type: "text" },
      { name: "next_maintenance_due", label: "Nächster Wartungstermin", type: "date" },
    ],
    "3.4": [
      { name: "defect_description", label: "Fehlerbeschreibung", type: "textarea" },
      { name: "defect_location", label: "Ort des Fehlers", type: "text" },
      { name: "severity", label: "Schweregrad", type: "select", options: ["Niedrig", "Mittel", "Hoch", "Kritisch"] },
      { name: "detected_date", label: "Erfassungsdatum", type: "date" },
      { name: "detected_by", label: "Erfasst von", type: "text" },
      { name: "repair_date", label: "Reparaturdatum", type: "date" },
      { name: "repaired_by", label: "Repariert von", type: "text" },
      { name: "repair_description", label: "Reparaturbeschreibung", type: "textarea" },
      { name: "status", label: "Status", type: "select", options: ["Ausstehend", "In Bearbeitung", "Abgeschlossen"] },
    ],
  };

  return formConfigs[section] || [];
};



const getUsername = (user: string | { username: string; first_name?: string; last_name?: string }): string => {
  if (typeof user === 'string') return user;
  if (user?.first_name && user?.last_name) {
    return `${user.first_name} ${user.last_name}`;
  }
  return user?.username || 'Unknown';
};

const getFileNameFromUrl = (url: string): string => {
  try {

    const parts = url.split('/');
    const filename = parts[parts.length - 1];

    return decodeURIComponent(filename);
  } catch {
    return 'document.pdf';
  }
};

export const AdminDashboard = () => {
  const { user: admin } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState<"users" | "locations">("users");
  const [users, setUsers] = useState<User[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);


  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [locationDocuments, setLocationDocuments] = useState<Document[]>([]);
  const [locationForms, setLocationForms] = useState<FormSubmission[]>([]);
  const [loadingLocationDetail, setLoadingLocationDetail] = useState(false);

  const [newUser, setNewUser] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password2: "",
    role: "GASTRONOM",
    phone: "",
    company_name: "",
    assigned_location: "",
  });



  const [locationSearchTerm, setLocationSearchTerm] = useState('');
  const [operatorFilter, setOperatorFilter] = useState<string>('ALL');
  const [currentLocationPage, setCurrentLocationPage] = useState(1);
  const [locationItemsPerPage] = useState(10);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);




  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editingUser, setEditingUser] = useState<any>({});


  const [newLocation, setNewLocation] = useState({
    name: "",
    address: "",
    city: "Berlin",
    postal_code: "",
    location_id: "",
  });

  const [editingLocationId, setEditingLocationId] = useState<number | null>(null);
  const [editingLocation, setEditingLocation] = useState<any>({});


  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assigningLocationId, setAssigningLocationId] = useState<number | null>(null);
  const [selectedOperatorId, setSelectedOperatorId] = useState("");


  const [viewingForm, setViewingForm] = useState<FormSubmission | null>(null);
  const [editingForm, setEditingForm] = useState<FormSubmission | null>(null);
  const [editFormData, setEditFormData] = useState<any>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchUsers(), fetchLocations()]);
    setLoading(false);
  };



  const fetchUsers = async () => {
    try {
      const res = await api.get("/users/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      });
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await api.get("/locations/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      });
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setLocations(data);
    } catch (err) {
      console.error("Failed to fetch locations:", err);
    }
  };

  const fetchLocationDetails = async (locationId: number) => {
    setLoadingLocationDetail(true);
    try {
      const [docsRes, formsRes] = await Promise.all([
        api.get(`/documents/?location=${locationId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
        }),
        api.get(`/forms/?location=${locationId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
        }),
      ]);

      const docs = Array.isArray(docsRes.data) ? docsRes.data : docsRes.data.results || [];
      const forms = Array.isArray(formsRes.data) ? formsRes.data : formsRes.data.results || [];

      console.log('📄 Documents fetched:', docs);
      console.log('📋 Forms fetched:', forms);

      setLocationDocuments(docs);
      setLocationForms(forms);
    } catch (err) {
      console.error("Failed to fetch location details:", err);
      alert("❌ Failed to load location details. Check console for errors.");
    } finally {
      setLoadingLocationDetail(false);
    }
  };

  const handleViewLocation = (location: Location) => {
    setSelectedLocation(location);
    fetchLocationDetails(location.id);
  };

  const handleBackToList = () => {
    setSelectedLocation(null);
    setLocationDocuments([]);
    setLocationForms([]);
  };

  const handleLocationSearchChange = (value: string) => {
    setLocationSearchTerm(value);
    setCurrentLocationPage(1);
  };

  const handleOperatorFilterChange = (value: string) => {
    setOperatorFilter(value);
    setCurrentLocationPage(1);
  };


  const filteredLocations = locations.filter((location) => {
    const matchesSearch =
      location.name.toLowerCase().includes(locationSearchTerm.toLowerCase()) ||
      location.location_id.toLowerCase().includes(locationSearchTerm.toLowerCase()) ||
      location.address.toLowerCase().includes(locationSearchTerm.toLowerCase()) ||
      location.city.toLowerCase().includes(locationSearchTerm.toLowerCase()) ||
      location.postal_code.toLowerCase().includes(locationSearchTerm.toLowerCase()) ||
      (location.current_operator?.username.toLowerCase().includes(locationSearchTerm.toLowerCase()) || false) ||
      (location.current_operator?.first_name.toLowerCase().includes(locationSearchTerm.toLowerCase()) || false) ||
      (location.current_operator?.last_name.toLowerCase().includes(locationSearchTerm.toLowerCase()) || false);

    const matchesOperator =
      operatorFilter === 'ALL' ||
      (operatorFilter === 'ASSIGNED' && location.current_operator) ||
      (operatorFilter === 'UNASSIGNED' && !location.current_operator);

    return matchesSearch && matchesOperator;
  });

  const indexOfLastLocation = currentLocationPage * locationItemsPerPage;
  const indexOfFirstLocation = indexOfLastLocation - locationItemsPerPage;
  const currentLocations = filteredLocations.slice(indexOfFirstLocation, indexOfLastLocation);
  const totalLocationPages = Math.ceil(filteredLocations.length / locationItemsPerPage);

  const handleToggleDocumentLock = async (docId: number) => {
    try {
      const res = await api.post(
        `/documents/${docId}/toggle_lock/`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
        }
      );
      alert(res.data.detail);
      if (selectedLocation) {
        fetchLocationDetails(selectedLocation.id);
      }
    } catch (err: any) {
      console.error("Failed to toggle document lock:", err);
      alert(err.response?.data?.detail || "Failed to toggle document lock");
    }
  };

  const handleDeleteDocument = async (docId: number) => {
    if (!confirm("⚠️ Are you sure you want to delete this document? This action cannot be undone.")) return;

    try {
      await api.delete(`/documents/${docId}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      });
      alert("✅ Document deleted successfully!");
      if (selectedLocation) {
        fetchLocationDetails(selectedLocation.id);
      }
    } catch (err) {
      console.error("Failed to delete document:", err);
      alert("❌ Failed to delete document");
    }
  };



  const handleToggleFormLock = async (formId: number) => {
    try {
      const res = await api.post(
        `/forms/${formId}/toggle_lock/`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
        }
      );
      alert(res.data.detail);
      if (selectedLocation) {
        fetchLocationDetails(selectedLocation.id);
      }
    } catch (err: any) {
      console.error("Failed to toggle form lock:", err);
      alert(err.response?.data?.detail || "Failed to toggle form lock");
    }
  };

  const handleViewForm = (form: FormSubmission) => {
    setViewingForm(form);
  };

  const handleEditForm = (form: FormSubmission) => {
    setEditingForm(form);
    setEditFormData(form.data || {});
  };

  const handleFormFieldChange = (fieldName: string, value: any) => {
    setEditFormData((prev: any) => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleUpdateForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingForm) return;

    try {
      await api.patch(
        `/forms/${editingForm.id}/`,
        { data: editFormData },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
        }
      );
      alert("✅ Form updated successfully!");
      setEditingForm(null);
      setEditFormData({});
      if (selectedLocation) {
        fetchLocationDetails(selectedLocation.id);
      }
    } catch (err: any) {
      console.error("Failed to update form:", err);
      alert(err.response?.data?.detail || "❌ Failed to update form");
    }
  };

  const handleDeleteForm = async (formId: number) => {
    if (!confirm("⚠️ Are you sure you want to delete this form? This action cannot be undone.")) return;

    try {
      await api.delete(`/forms/${formId}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      });
      alert("✅ Form deleted successfully!");
      if (selectedLocation) {
        fetchLocationDetails(selectedLocation.id);
      }
    } catch (err) {
      console.error("Failed to delete form:", err);
      alert("❌ Failed to delete form");
    }
  };


  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      username: newUser.username,
      email: newUser.email,
      password: newUser.password,
      password2: newUser.password2,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      role: newUser.role,
      phone: newUser.phone || "",
      company_name: newUser.role === "EXTERNAL" ? newUser.company_name : "",
    };

    try {
      const res = await api.post("/users/", payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      });

      if (newUser.assigned_location && res.data.id) {
        await assignLocationToUser(res.data.id, Number(newUser.assigned_location));
      }

      await fetchUsers();

      setNewUser({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        password2: "",
        role: "GASTRONOM",
        phone: "",
        company_name: "",
        assigned_location: "",
      });

      alert("✅ User created successfully!");
    } catch (err: any) {
      console.error("❌ Create user failed:", err.response?.data || err);

      if (err.response?.data) {
        const errors = err.response.data;
        const errorMessages = Object.entries(errors)
          .map(([field, msgs]: [string, any]) => {
            const message = Array.isArray(msgs) ? msgs.join(", ") : msgs;
            return `${field}: ${message}`;
          })
          .join("\n");
        alert(`Failed to create user:\n\n${errorMessages}`);
      } else {
        alert("Failed to create user. Check console for details.");
      }
    }
  };

  const assignLocationToUser = async (userId: number, locationId: number) => {
    try {
      await api.post(
        `/locations/${locationId}/assign_operator/`,
        { operator_id: userId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
        }
      );
      console.log("✅ Location assigned successfully");
    } catch (err) {
      console.error("❌ Failed to assign location:", err);
      alert("User created but failed to assign location. Please assign manually.");
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUserId) return;

    const payload = {
      email: editingUser.email,
      first_name: editingUser.first_name,
      last_name: editingUser.last_name,
      phone: editingUser.phone || "",
      company_name: editingUser.company_name || "",
    };

    try {
      const res = await api.patch(`/users/${editingUserId}/`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      });
      setUsers(users.map((u) => (u.id === editingUserId ? res.data : u)));
      setEditingUserId(null);
      setEditingUser({});
      alert("✅ User updated successfully!");
    } catch (err: any) {
      console.error("❌ Edit user failed:", err.response?.data || err);
      alert("Failed to edit user. Check console for details.");
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.delete(`/users/${id}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      });
      setUsers(users.filter((u) => u.id !== id));
      alert("✅ User deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete user.");
    }
  };



  const handleCreateLocation = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post("/locations/", newLocation, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      });

      await fetchLocations();

      setNewLocation({
        name: "",
        address: "",
        city: "Berlin",
        postal_code: "",
        location_id: "",
      });

      alert("✅ Location created successfully!");
    } catch (err: any) {
      console.error("❌ Create location failed:", err.response?.data || err);

      if (err.response?.data) {
        const errors = err.response.data;
        const errorMessages = Object.entries(errors)
          .map(([field, msgs]: [string, any]) => {
            const message = Array.isArray(msgs) ? msgs.join(", ") : msgs;
            return `${field}: ${message}`;
          })
          .join("\n");
        alert(`Failed to create location:\n\n${errorMessages}`);
      } else {
        alert("Failed to create location. Check console for details.");
      }
    }
  };

  const handleEditLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLocationId) return;

    try {
      const res = await api.patch(`/locations/${editingLocationId}/`, editingLocation, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      });
      setLocations(locations.map((loc) => (loc.id === editingLocationId ? res.data : loc)));
      setEditingLocationId(null);
      setEditingLocation({});
      alert("✅ Location updated successfully!");
    } catch (err: any) {
      console.error("❌ Edit location failed:", err.response?.data || err);
      alert("Failed to edit location. Check console for details.");
    }
  };

  const handleDeleteLocation = async (id: number) => {
    if (!confirm("Are you sure you want to delete this location? All associated data will remain but the location will be removed.")) return;

    try {
      await api.delete(`/locations/${id}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      });
      setLocations(locations.filter((loc) => loc.id !== id));
      alert("✅ Location deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete location.");
    }
  };

  const handleAssignOperator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningLocationId || !selectedOperatorId) return;

    try {
      await api.post(
        `/locations/${assigningLocationId}/assign_operator/`,
        { operator_id: Number(selectedOperatorId) },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
        }
      );

      await fetchLocations();
      await fetchUsers();

      setShowAssignModal(false);
      setAssigningLocationId(null);
      setSelectedOperatorId("");

      alert("✅ Operator assigned successfully!");
    } catch (err: any) {
      console.error("❌ Assign operator failed:", err.response?.data || err);
      alert("Failed to assign operator. Check console for details.");
    }
  };

  const getGastronomUsers = () => {
    return users.filter((u) => u.role === "GASTRONOM");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false);

    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });


  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);




  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };


  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);
    setCurrentPage(1);
  };

  if (selectedLocation) {
    return (
      <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">

        <button
          onClick={handleBackToList}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Zurück zu den Standorten
        </button>
        <div className="bg-linear-to-r from-amber-50 to-yellow-50 rounded-2xl shadow-xl p-6 mb-6 border-2 border-amber-300">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            📍 {selectedLocation.name}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Location ID</p>
              <p className="text-lg font-semibold text-amber-700">{selectedLocation.location_id}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Address</p>
              <p className="text-lg font-semibold text-gray-800">
                {selectedLocation.address}, {selectedLocation.city} {selectedLocation.postal_code}
              </p>
            </div>
            {selectedLocation.current_operator && (
              <div className="bg-white rounded-lg p-4 shadow-sm md:col-span-2">
                <p className="text-sm text-gray-600 mb-1">Current Operator</p>
                <p className="text-lg font-semibold text-gray-800">
                  {selectedLocation.current_operator.first_name} {selectedLocation.current_operator.last_name}
                  <span className="text-sm text-gray-500 ml-2">(@{selectedLocation.current_operator.username})</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {loadingLocationDetail ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Lade Standortdetails…</p>
          </div>
        ) : (
          <>
            <div className="mb-8 bg-white border rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-yellow-600 p-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <FileText className="w-6 h-6" />
                  Formularübermittlungen ({locationForms.length})
                </h2>
              </div>
              {locationForms.length === 0 ? (
                <div className="p-12 text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500 text-lg">Für diesen Standort wurden keine Formularübermittlungen gefunden.</p>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  {locationForms.map((form) => (
                    <div
                      key={form.id}
                      className="border-2 border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all bg-gray-50"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800 mb-2">{form.section}</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <span>
                              <strong>Eingereicht von:</strong> {getUsername(form.submitted_by)}
                            </span>
                            <span>
                              <strong>Datum:</strong> {new Date(form.submitted_at).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${form.locked
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
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
                                Entsperrt
                              </>
                            )}
                          </span>
                          <button
                            onClick={() => handleViewForm(form)}
                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                            title="View Form"
                          >
                            <Eye className="w-5 h-5 text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleEditForm(form)}
                            className="p-2 hover:bg-yellow-100 rounded-lg transition-colors"
                            title="Edit Form"
                          >
                            <Edit className="w-5 h-5 text-yellow-500" />
                          </button>
                          <button
                            onClick={() => handleToggleFormLock(form.id)}
                            className={`p-2 rounded-lg transition-colors ${form.locked
                              ? "hover:bg-green-100"
                              : "hover:bg-orange-100"
                              }`}
                            title={form.locked ? "Unlock Form" : "Lock Form"}
                          >
                            {form.locked ? (
                              <Unlock className="w-5 h-5 text-green-600" />
                            ) : (
                              <Lock className="w-5 h-5 text-orange-600" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteForm(form.id)}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                            title="Delete Form"
                          >
                            <Trash2 className="w-5 h-5 text-red-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>


            <div className="bg-white border rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-yellow-500 p-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <UploadIcon className="w-6 h-6" />
                  Dokumente ({locationDocuments.length})
                </h2>
              </div>
              {locationDocuments.length === 0 ? (
                <div className="p-12 text-center">
                  <UploadIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500 text-lg">Für diesen Standort wurden keine Dokumente hochgeladen.</p>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  {locationDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="border-2 border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all bg-gray-50"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800 mb-2">{doc.section}</h3>
                          <p className="text-sm text-gray-600 mb-2 break-all">
                            {getFileNameFromUrl(doc.file_url)}
                          </p>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <span>
                              <strong>Hochgeladen von:</strong> {getUsername(doc.uploaded_by)}
                            </span>
                            <span>
                              <strong>Datum:</strong> {new Date(doc.uploaded_at).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${doc.locked
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                              }`}
                          >
                            {doc.locked ? (
                              <>
                                <Lock className="w-4 h-4" />
                                Gesperrt
                              </>
                            ) : (
                              <>
                                <Unlock className="w-4 h-4" />
                                Entsperrt
                              </>
                            )}
                          </span>
                          <button
                            onClick={() => {
                              let fileUrl = doc.file_url;


                              if (doc.resource_type === 'raw' && !fileUrl.endsWith('.pdf')) {
                                fileUrl += '.pdf';
                              }
                              window.open(fileUrl, '_blank', 'noopener,noreferrer');
                            }}
                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                            title="View Document"
                          >
                            <Eye className="w-5 h-5 text-blue-600" />
                          </button>

                          <button
                            onClick={() => handleToggleDocumentLock(doc.id)}
                            className={`p-2 rounded-lg transition-colors ${doc.locked
                              ? "hover:bg-green-100"
                              : "hover:bg-orange-100"
                              }`}
                            title={doc.locked ? "Unlock Document" : "Lock Document"}
                          >
                            {doc.locked ? (
                              <Unlock className="w-5 h-5 text-green-600" />
                            ) : (
                              <Lock className="w-5 h-5 text-orange-600" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                            title="Delete Document"
                          >
                            <Trash2 className="w-5 h-5 text-red-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}


        {viewingForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-3xl my-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-blue-600" />
                  Formular ansehen - {viewingForm.section}
                </h2>
                <button
                  onClick={() => setViewingForm(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="bg-linear-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Eingereicht von</p>
                    <p className="text-lg font-semibold text-gray-800">{getUsername(viewingForm.submitted_by)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Submitted At</p>
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
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Formulardaten</h3>
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
                            {value || <span className="text-gray-400 italic">Nicht angegeben</span>}
                          </p>
                        ) : field.type === "date" ? (
                          <p className="text-gray-800">
                            {value ? new Date(value).toLocaleDateString('en-US', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            }) : <span className="text-gray-400 italic">Nicht bereitgestellt</span>}
                          </p>
                        ) : (
                          <p className="text-gray-800">
                            {value || <span className="text-gray-400 italic">Nicht bereitgestellt</span>}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setViewingForm(null)}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold transition-all"
                >
                  Schließen
                </button>
              </div>
            </div>
          </div>
        )}


        {editingForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <form
              onSubmit={handleUpdateForm}
              className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-3xl my-8"
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Edit className="w-6 h-6 text-yellow-600" />
                  Edit Form - {editingForm.section}
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setEditingForm(null);
                    setEditFormData({});
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="mb-6 space-y-4 max-h-96 overflow-y-auto pr-2">
                {getFormFields(editingForm.section).map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {field.label}
                    </label>

                    {field.type === "text" && (
                      <input
                        type="text"
                        value={editFormData[field.name] || ""}
                        onChange={(e) => handleFormFieldChange(field.name, e.target.value)}
                        className="w-full border-2 border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    )}

                    {field.type === "date" && (
                      <input
                        type="date"
                        value={editFormData[field.name] || ""}
                        onChange={(e) => handleFormFieldChange(field.name, e.target.value)}
                        className="w-full border-2 border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    )}

                    {field.type === "select" && (
                      <select
                        value={editFormData[field.name] || ""}
                        onChange={(e) => handleFormFieldChange(field.name, e.target.value)}
                        className="w-full border-2 border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                        value={editFormData[field.name] || ""}
                        onChange={(e) => handleFormFieldChange(field.name, e.target.value)}
                        className="w-full border-2 border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        rows={4}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700">
                  <strong>Administratorüberschreibung:</strong> Sie können dieses Formular bearbeiten, auch wenn es gesperrt ist. Änderungen werden sofort gespeichert.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingForm(null);
                    setEditFormData({});
                  }}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  }


  return (
    <div className="p-8 max-w-7xl mx-auto">

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2"> Admin Dashboard</h1>
        <p className="text-gray-600">
          Logged in as: <span className="font-semibold">{admin?.username}</span> ({admin?.role})
        </p>
      </div>


      <div className="flex space-x-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-6 py-3 font-semibold transition-all ${activeTab === "users"
            ? "border-b-4 border-yellow-500 text-yellow-600"
            : "text-gray-500 hover:text-gray-700"
            }`}
        >
          Benutzerverwaltung
        </button>
        <button
          onClick={() => setActiveTab("locations")}
          className={`px-6 py-3 font-semibold transition-all ${activeTab === "locations"
            ? "border-b-4 border-yellow-500 text-yellow-600"
            : "text-gray-500 hover:text-gray-700"
            }`}
        >
          Standortverwaltung
        </button>
      </div>

      {activeTab === "users" && (
        <>
          <div className="mb-8 border border-yellow-400 p-6 rounded-lg bg-yellow-50 shadow-md">
            <h2 className="text-xl mb-4 font-bold text-gray-800">➕ Neuen Benutzer erstellen</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={handleCreateUser}>
              <input
                type="text"
                placeholder="Username *"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                className="border p-2 rounded focus:ring-2 focus:ring-yellow-500"
                required
              />
              <input
                type="email"
                placeholder="E-mail *"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="border p-2 rounded focus:ring-2 focus:ring-yellow-500"
                required
              />
              <input
                type="text"
                placeholder="Vorname *"
                value={newUser.first_name}
                onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
                className="border p-2 rounded focus:ring-2 focus:ring-yellow-500"
                required
              />
              <input
                type="text"
                placeholder="Nachname *"
                value={newUser.last_name}
                onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
                className="border p-2 rounded focus:ring-2 focus:ring-yellow-500"
                required
              />
              <input
                type="password"
                placeholder="Passwort *"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="border p-2 rounded focus:ring-2 focus:ring-yellow-500"
                required
              />
              <input
                type="password"
                placeholder="Passwort bestätigen *"
                value={newUser.password2}
                onChange={(e) => setNewUser({ ...newUser, password2: e.target.value })}
                className="border p-2 rounded focus:ring-2 focus:ring-yellow-500"
                required
              />
              <input
                type="tel"
                placeholder="Telefon (optional)"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                className="border p-2 rounded focus:ring-2 focus:ring-yellow-500"
              />
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="border p-2 rounded focus:ring-2 focus:ring-yellow-500"
              >
                <option value="ADMIN">ADMIN</option>
                <option value="GASTRONOM">GASTRONOM</option>
                <option value="EXTERNAL">EXTERN</option>
              </select>

              {newUser.role === "EXTERNAL" && (
                <input
                  type="text"
                  placeholder="Company Name (required for External) *"
                  value={newUser.company_name}
                  onChange={(e) => setNewUser({ ...newUser, company_name: e.target.value })}
                  className="border p-2 rounded focus:ring-2 focus:ring-yellow-500"
                  required
                />
              )}

              <select
                value={newUser.assigned_location}
                onChange={(e) => setNewUser({ ...newUser, assigned_location: e.target.value })}
                className="border p-2 rounded focus:ring-2 focus:ring-yellow-500"
                disabled={newUser.role !== "GASTRONOM"}
              >
                <option value="">Standort zuweisen (optional))</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} - {loc.location_id}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded col-span-2 font-semibold transition-all shadow-md"
              >
                Benutzer erstellen
              </button>
            </form>
          </div>

          <div className="p-4 max-w-7xl mx-auto">
            <div className="bg-white border rounded-lg shadow-md overflow-hidden">
              <h2 className="text-2xl p-4 font-bold bg-gray-100 border-b">
                Alle Benutzer ({filteredUsers.length})
              </h2>

              <div className="p-4 bg-gray-50 border-b space-y-3">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Suche nach Name, E-Mail, Firma, Standort..."
                      value={searchTerm}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:w-48">
                    <select
                      value={roleFilter}
                      onChange={(e) => handleRoleFilterChange(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="ALL">Alle Rollen</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="GASTRONOM">GASTRONOM</option>
                      <option value="EXTERNAL">EXTERNAL</option>
                    </select>
                  </div>
                </div>

                {/* Active Filters Display */}
                {(searchTerm || roleFilter !== 'ALL') && (
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-sm text-gray-600">Aktive Filter:</span>
                    {searchTerm && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1">
                        Suche: "{searchTerm}"
                        <button onClick={() => handleSearchChange('')} className="hover:text-blue-900">×</button>
                      </span>
                    )}
                    {roleFilter !== 'ALL' && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-1">
                        Rolle: {roleFilter}
                        <button onClick={() => handleRoleFilterChange('ALL')} className="hover:text-green-900">×</button>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-3 text-left border-b">Benutzername</th>
                      <th className="p-3 text-left border-b">E-Mail</th>
                      <th className="p-3 text-left border-b">Name</th>
                      <th className="p-3 text-left border-b">Rolle</th>
                      <th className="p-3 text-left border-b">Telefon</th>
                      <th className="p-3 text-left border-b">Firma</th>
                      <th className="p-3 text-left border-b">Standort</th>
                      <th className="p-3 text-left border-b">Aktionen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-gray-500">
                          Keine Benutzer gefunden
                        </td>
                      </tr>
                    ) : (
                      currentUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50 border-b">
                          <td className="p-3">{u.username}</td>
                          <td className="p-3">{u.email}</td>
                          <td className="p-3">{u.first_name} {u.last_name}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${u.role === "ADMIN"
                                ? "bg-red-100 text-red-800"
                                : u.role === "GASTRONOM"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                                }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="p-3">{u.phone || "-"}</td>
                          <td className="p-3">{u.company_name || "-"}</td>
                          <td className="p-3">{u.assigned_location || "-"}</td>
                          <td className="p-3 space-x-2">
                            <button
                              className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm font-semibold"
                              onClick={() => {
                                setEditingUserId(u.id);
                                setEditingUser(u);
                              }}
                            >
                              Bearbeiten
                            </button>
                            <button
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold"
                              onClick={() => handleDeleteUser(u.id)}
                            >
                              Löschen
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden">
                {currentUsers.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    Keine Benutzer gefunden
                  </div>
                ) : (
                  currentUsers.map((u) => (
                    <div key={u.id} className="p-4 border-b hover:bg-gray-50">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-lg">{u.first_name} {u.last_name}</p>
                            <p className="text-sm text-gray-600">@{u.username}</p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${u.role === "ADMIN"
                              ? "bg-red-100 text-red-800"
                              : u.role === "GASTRONOM"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                              }`}
                          >
                            {u.role}
                          </span>
                        </div>

                        <div className="text-sm space-y-1">
                          <p className="text-gray-700">
                            <span className="font-semibold">E-Mail:</span> {u.email}
                          </p>
                          {u.phone && (
                            <p className="text-gray-700">
                              <span className="font-semibold">Telefon:</span> {u.phone}
                            </p>
                          )}
                          {u.company_name && (
                            <p className="text-gray-700">
                              <span className="font-semibold">Firma:</span> {u.company_name}
                            </p>
                          )}
                          {u.assigned_location && (
                            <p className="text-gray-700">
                              <span className="font-semibold">Standort:</span> {u.assigned_location}
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-2 rounded text-sm font-semibold"
                            onClick={() => {
                              setEditingUserId(u.id);
                              setEditingUser(u);
                            }}
                          >
                            Bearbeiten
                          </button>
                          <button
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold"
                            onClick={() => handleDeleteUser(u.id)}
                          >
                            Löschen
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination */}
              {filteredUsers.length > 0 && (
                <div className="p-4 bg-gray-50 border-t flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-sm text-gray-600">
                    Zeige {indexOfFirstUser + 1} bis {Math.min(indexOfLastUser, filteredUsers.length)} von {filteredUsers.length} Benutzern
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ‹
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                      // Show first page, last page, current page, and pages around current
                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-1 border rounded ${currentPage === pageNum
                              ? 'bg-blue-500 text-white'
                              : 'hover:bg-gray-100'
                              }`}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (
                        pageNum === currentPage - 2 ||
                        pageNum === currentPage + 2
                      ) {
                        return <span key={pageNum} className="px-2">...</span>;
                      }
                      return null;
                    })}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ›
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}


      {activeTab === "locations" && (
        <>

          <div className="mb-8 border border-blue-400 p-6 rounded-lg bg-yellow-50 shadow-md">
            <h2 className="text-xl mb-4 font-bold text-gray-800">➕ Neuen Standort erstellen</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={handleCreateLocation}>
              <input
                type="text"
                placeholder="Restaurantname *"
                value={newLocation.name}
                onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Standort-ID (z. B. BERLIN-001) *"
                value={newLocation.location_id}
                onChange={(e) => setNewLocation({ ...newLocation, location_id: e.target.value })}
                className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Adresse *"
                value={newLocation.address}
                onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })}
                className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Stadt *"
                value={newLocation.city}
                onChange={(e) => setNewLocation({ ...newLocation, city: e.target.value })}
                className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Postleitzahl *"
                value={newLocation.postal_code}
                onChange={(e) => setNewLocation({ ...newLocation, postal_code: e.target.value })}
                className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="bg-[#DFA927] hover:bg-[#c4901f] cursor-pointer text-white p-2 rounded font-semibold transition-all shadow-md"
              >
                Standort erstellen
              </button>
            </form>
          </div>

          <div className="bg-white border rounded-lg shadow-md overflow-hidden">
            <h2 className="text-2xl p-4 font-bold bg-gray-100 border-b">
              Alle Standorte ({filteredLocations.length})
            </h2>

            {/* Search and Filter Section */}
            <div className="p-4 bg-gray-50 border-b space-y-3">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Suche nach Name, Standort-ID, Adresse, Stadt, Betreiber..."
                    value={locationSearchTerm}
                    onChange={(e) => handleLocationSearchChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:w-48">
                  <select
                    value={operatorFilter}
                    onChange={(e) => handleOperatorFilterChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ALL">Alle Standorte</option>
                    <option value="ASSIGNED">Mit Betreiber</option>
                    <option value="UNASSIGNED">Ohne Betreiber</option>
                  </select>
                </div>
              </div>

              {/* Active Filters Display */}
              {(locationSearchTerm || operatorFilter !== 'ALL') && (
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm text-gray-600">Aktive Filter:</span>
                  {locationSearchTerm && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1">
                      Suche: "{locationSearchTerm}"
                      <button onClick={() => handleLocationSearchChange('')} className="hover:text-blue-900">×</button>
                    </span>
                  )}
                  {operatorFilter !== 'ALL' && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-1">
                      Status: {operatorFilter === 'ASSIGNED' ? 'Mit Betreiber' : 'Ohne Betreiber'}
                      <button onClick={() => handleOperatorFilterChange('ALL')} className="hover:text-green-900">×</button>
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-left border-b">Restaurantname</th>
                    <th className="p-3 text-left border-b">Standort-ID</th>
                    <th className="p-3 text-left border-b">Adresse</th>
                    <th className="p-3 text-left border-b">Stadt</th>
                    <th className="p-3 text-left border-b w-[200px]">Aktueller Betreiber</th>
                    <th className="p-3 text-left border-b w-[380px]">Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {currentLocations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-500">
                        Keine Standorte gefunden
                      </td>
                    </tr>
                  ) : (
                    currentLocations.map((loc) => (
                      <tr key={loc.id} className="hover:bg-gray-50 border-b">
                        <td className="p-3 font-semibold">
                          <button
                            onClick={() => handleViewLocation(loc)}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {loc.name}
                          </button>
                        </td>
                        <td className="p-3">
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-mono">
                            {loc.location_id}
                          </span>
                        </td>
                        <td className="p-3">{loc.address}</td>
                        <td className="p-3">{loc.city}, {loc.postal_code}</td>
                        <td className="p-3 w-[200px]">
                          {loc.current_operator ? (
                            <div className="max-w-full">
                              <p className="font-semibold truncate" title={`${loc.current_operator.first_name} ${loc.current_operator.last_name}`}>
                                {loc.current_operator.first_name} {loc.current_operator.last_name}
                              </p>
                              <p className="text-xs text-gray-500 truncate" title={`@${loc.current_operator.username}`}>
                                @{loc.current_operator.username}
                              </p>
                            </div>
                          ) : (
                            <span className="text-gray-400 italic">Nicht zugewiesen</span>
                          )}
                        </td>
                        <td className="p-3 w-[380px]">
                          <div className="flex flex-wrap gap-2">
                            <button
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-semibold whitespace-nowrap"
                              onClick={() => handleViewLocation(loc)}
                            >
                              Details anzeigen
                            </button>
                            <button
                              className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm font-semibold whitespace-nowrap"
                              onClick={() => {
                                setAssigningLocationId(loc.id);
                                setShowAssignModal(true);
                              }}
                            >
                              Zuweisen
                            </button>
                            <button
                              className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm font-semibold whitespace-nowrap"
                              onClick={() => {
                                setEditingLocationId(loc.id);
                                setEditingLocation(loc);
                              }}
                            >
                              Bearbeiten
                            </button>
                            <button
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold whitespace-nowrap"
                              onClick={() => handleDeleteLocation(loc.id)}
                            >
                              Löschen
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredLocations.length > 0 && (
              <div className="p-4 bg-gray-50 border-t flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-sm text-gray-600">
                  Zeige {indexOfFirstLocation + 1} bis {Math.min(indexOfLastLocation, filteredLocations.length)} von {filteredLocations.length} Standorten
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => setCurrentLocationPage(currentLocationPage - 1)}
                    disabled={currentLocationPage === 1}
                    className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ‹
                  </button>

                  {Array.from({ length: totalLocationPages }, (_, i) => i + 1).map((pageNum) => {
                    if (
                      pageNum === 1 ||
                      pageNum === totalLocationPages ||
                      (pageNum >= currentLocationPage - 1 && pageNum <= currentLocationPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentLocationPage(pageNum)}
                          className={`px-3 py-1 border rounded ${currentLocationPage === pageNum
                            ? 'bg-blue-500 text-white'
                            : 'hover:bg-gray-100'
                            }`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (
                      pageNum === currentLocationPage - 2 ||
                      pageNum === currentLocationPage + 2
                    ) {
                      return <span key={pageNum} className="px-2">...</span>;
                    }
                    return null;
                  })}

                  <button
                    onClick={() => setCurrentLocationPage(currentLocationPage + 1)}
                    disabled={currentLocationPage === totalLocationPages}
                    className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ›
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}


      {editingUserId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form
            onSubmit={handleEditUser}
            className="bg-white p-6 rounded-lg shadow-xl space-y-3 w-96"
          >
            <h2 className="text-xl mb-2 font-bold">Edit User</h2>
            <input
              type="email"
              placeholder="E-mail"
              value={editingUser.email || ""}
              onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
              className="border p-2 w-full rounded"
              required
            />
            <input
              type="text"
              placeholder="Vorname"
              value={editingUser.first_name || ""}
              onChange={(e) => setEditingUser({ ...editingUser, first_name: e.target.value })}
              className="border p-2 w-full rounded"
              required
            />
            <input
              type="text"
              placeholder="Nachname"
              value={editingUser.last_name || ""}
              onChange={(e) => setEditingUser({ ...editingUser, last_name: e.target.value })}
              className="border p-2 w-full rounded"
              required
            />
            <input
              type="tel"
              placeholder="Telefon"
              value={editingUser.phone || ""}
              onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
              className="border p-2 w-full rounded"
            />
            <input
              type="text"
              placeholder="Firmenname"
              value={editingUser.company_name || ""}
              onChange={(e) => setEditingUser({ ...editingUser, company_name: e.target.value })}
              className="border p-2 w-full rounded"
            />
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  setEditingUserId(null);
                  setEditingUser({});
                }}
              >
                Abbrechen
              </button>
              <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                Änderungen speichern
              </button>
            </div>
          </form>
        </div>
      )}


      {editingLocationId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form
            onSubmit={handleEditLocation}
            className="bg-white p-6 rounded-lg shadow-xl space-y-3 w-96"
          >
            <h2 className="text-xl mb-2 font-bold">Edit Location</h2>
            <input
              type="text"
              placeholder="Restaurantname"
              value={editingLocation.name || ""}
              onChange={(e) => setEditingLocation({ ...editingLocation, name: e.target.value })}
              className="border p-2 w-full rounded"
              required
            />
            <input
              type="text"
              placeholder="Adresse"
              value={editingLocation.address || ""}
              onChange={(e) => setEditingLocation({ ...editingLocation, address: e.target.value })}
              className="border p-2 w-full rounded"
              required
            />
            <input
              type="text"
              placeholder="Stadt"
              value={editingLocation.city || ""}
              onChange={(e) => setEditingLocation({ ...editingLocation, city: e.target.value })}
              className="border p-2 w-full rounded"
              required
            />
            <input
              type="text"
              placeholder="Postleitzahl"
              value={editingLocation.postal_code || ""}
              onChange={(e) => setEditingLocation({ ...editingLocation, postal_code: e.target.value })}
              className="border p-2 w-full rounded"
              required
            />
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  setEditingLocationId(null);
                  setEditingLocation({});
                }}
              >
                Abbrechen
              </button>
              <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                Änderungen speichern
              </button>
            </div>
          </form>
        </div>
      )}


      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form
            onSubmit={handleAssignOperator}
            className="bg-white p-6 rounded-lg shadow-xl w-96"
          >
            <h2 className="text-xl mb-4 font-bold">Assign Operator to Location</h2>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Gastronom (Restaurantbetreiber) auswählen
              </label>
              <select
                value={selectedOperatorId}
                onChange={(e) => setSelectedOperatorId(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="">-- Select Gastronom --</option>
                {getGastronomUsers().map((gastro) => (
                  <option key={gastro.id} value={gastro.id}>
                    {gastro.first_name} {gastro.last_name} (@{gastro.username})
                  </option>
                ))}
              </select>
              {getGastronomUsers().length === 0 && (
                <p className="text-xs text-red-500 mt-1">
                  Keine Gastronom-Benutzer verfügbar. Erstellen Sie zuerst einen Gastronom-Benutzer.
                </p>
              )}
            </div>

            <div className="bg-yellow-50 border border-yellow-300 rounded p-3 mb-4">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> Wenn dieser Standort bereits einen Betreiber hat, wird dieser ersetzt. Der vorherige Betreiber verliert den Zugriff, aber alle historischen Daten bleiben erhalten.
              </p>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setShowAssignModal(false);
                  setAssigningLocationId(null);
                  setSelectedOperatorId("");
                }}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded font-semibold"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                disabled={!selectedOperatorId}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Betreiber zuweisen
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}; 