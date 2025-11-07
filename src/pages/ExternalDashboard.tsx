import React, { useState, useEffect } from 'react';
import { Building2, FileText, Upload, Lock, Eye, Download, AlertCircle, CheckCircle, Edit, Save, X, Plus } from 'lucide-react';
import api from "../api/axios";


interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  company_name?: string;
  role: string;
}

interface Location {
  id: number;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  location_id?: string;
}

interface LocationAccess {
  id: number;
  location: number | Location;
  location_detail?: Location;
  is_active: boolean;
  granted_at: string;
}

interface Document {
  id: number;
  file_name?: string;
  file_url: string;
  section: string;
  uploaded_by: string | { username: string };
  uploaded_at: string;
  locked: boolean;
  location: number;
}

interface FormSubmission {
  id: number;
  section: string;
  data: any;
  submitted_by: {
    username: string;
    id: number;
  } | string;
  submitted_at: string;
  locked: boolean;
  location: number;
}

interface Message {
  type: 'success' | 'error' | '';
  text: string;
}

const ExternalDashboard: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [forms, setForms] = useState<FormSubmission[]>([]);
  const [activeTab, setActiveTab] = useState<'documents' | 'forms' | 'upload' | 'create-form'>('documents');
  const [loading, setLoading] = useState(true);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadSection, setUploadSection] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<Message>({ type: '', text: '' });
  
  const [editingForm, setEditingForm] = useState<FormSubmission | null>(null);
  const [newFormSection, setNewFormSection] = useState('');
  const [formData, setFormData] = useState<any>({});
  const [savingForm, setSavingForm] = useState(false);
  const [viewingForm, setViewingForm] = useState<FormSubmission | null>(null);

  const user: User = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('access');


  const API_BASE = import.meta.env.VITE_BASE_URL

  const documentSections = [
    { value: "2.4", label: "2.4 - Maintenance certificate" },
    { value: "3.5", label: "3.5 - Waste removal record" },
    { value: "3.6", label: "3.6 - Inspection report (General inspection)" },
    { value: "3.7", label: "3.7 - Record of cleaning and detergents used" },
  ];

  const formSections = [
    {
      value: "3.1",
      label: "3.1 - Proof of disposal, maintenance, and inspection",
      fields: [
        { name: "disposal_date", label: "Disposal Date", type: "date" },
        { name: "disposal_method", label: "Disposal Method", type: "text" },
        { name: "maintenance_performed", label: "Maintenance Performed", type: "textarea" },
        { name: "inspection_notes", label: "Inspection Notes", type: "textarea" },
        { name: "inspector_name", label: "Inspector Name", type: "text" },
      ]
    },
    {
      value: "3.2",
      label: "3.2 - Disposal and self-inspection report",
      fields: [
        { name: "inspection_date", label: "Inspection Date", type: "date" },
        { name: "disposal_items", label: "Items Disposed", type: "textarea" },
        { name: "self_inspection_result", label: "Self-Inspection Result", type: "select", options: ["Pass", "Fail", "Needs Attention"] },
        { name: "findings", label: "Findings", type: "textarea" },
        { name: "corrective_actions", label: "Corrective Actions Taken", type: "textarea" },
      ]
    },
    {
      value: "3.3",
      label: "3.3 - Maintenance report",
      fields: [
        { name: "maintenance_date", label: "Maintenance Date", type: "date" },
        { name: "equipment_serviced", label: "Equipment Serviced", type: "text" },
        { name: "work_performed", label: "Work Performed", type: "textarea" },
        { name: "parts_replaced", label: "Parts Replaced", type: "textarea" },
        { name: "next_maintenance_due", label: "Next Maintenance Due", type: "date" },
        { name: "technician_name", label: "Technician Name", type: "text" },
      ]
    },
    {
      value: "3.4",
      label: "3.4 - Report of defects and repairs",
      fields: [
        { name: "defect_reported_date", label: "Defect Reported Date", type: "date" },
        { name: "defect_description", label: "Defect Description", type: "textarea" },
        { name: "severity", label: "Severity", type: "select", options: ["Low", "Medium", "High", "Critical"] },
        { name: "repair_date", label: "Repair Date", type: "date" },
        { name: "repair_description", label: "Repair Description", type: "textarea" },
        { name: "repaired_by", label: "Repaired By", type: "text" },
        { name: "status", label: "Status", type: "select", options: ["Pending", "In Progress", "Completed"] },
      ]
    },
  ];

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      fetchDocuments();
      fetchForms();
    }
  }, [selectedLocation]);

const fetchLocations = async () => {
  try {
    console.log("🔄 Fetching locations for external user...");
    
    const response = await fetch(`${API_BASE}/location-access/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Failed to fetch location access:", response.status, errorText);
      throw new Error(`Failed to fetch location access: ${response.status}`);
    }
    
    const accessData: LocationAccess[] = await response.json();
    console.log("📦 Raw Location Access Data:", accessData);
    console.log("📊 Total access records:", accessData.length);
    
    // Filter active access
    const activeAccess = accessData.filter((access: LocationAccess) => {
      console.log("🔍 Checking access:", {
        id: access.id,
        is_active: access.is_active,
        location: access.location,
        location_detail: access.location_detail
      });
      return access.is_active;
    });
    
    console.log("✅ Active Access Records:", activeAccess.length);
    
    if (activeAccess.length === 0) {
      console.warn("⚠️ No active access found for this user");
      setLocations([]);
      setLoading(false);
      return;
    }
    
    // Extract locations from active access
    const locationsList: Location[] = activeAccess
      .map((access: LocationAccess, index: number) => {
        console.log(`🔍 Processing access ${index + 1}:`, access);
        
        // Priority 1: location_detail (most complete)
        if (access.location_detail) {
          console.log(`✅ Found location_detail:`, access.location_detail);
          return access.location_detail;
        }
        
        // Priority 2: location as object
        if (typeof access.location === 'object' && access.location !== null) {
          console.log(`✅ Found location as object:`, access.location);
          return access.location as Location;
        }
        
        // Priority 3: location as ID (can't use directly)
        if (typeof access.location === 'number') {
          console.warn(`⚠️ Location is just an ID (${access.location}), cannot extract details`);
          return null;
        }
        
        console.warn("⚠️ No usable location data found in access record");
        return null;
      })
      .filter((loc): loc is Location => {
        if (loc === null) {
          console.warn("⚠️ Filtered out null location");
          return false;
        }
        console.log("✅ Valid location:", loc.name);
        return true;
      });
    
    console.log("📍 Final Extracted Locations:", locationsList);
    console.log("📊 Total valid locations:", locationsList.length);
    
    if (locationsList.length === 0) {
      console.error("❌ No valid locations extracted from access data");
      setMessage({ 
        type: 'error', 
        text: 'Could not load location details. Please contact support.' 
      });
    }
    
    setLocations(locationsList);
    
    if (locationsList.length > 0) {
      setSelectedLocation(locationsList[0]);
      console.log("✅ Auto-selected first location:", locationsList[0].name);
    }
    
    setLoading(false);
    
  } catch (error: any) {
    console.error('❌ Error fetching locations:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response,
      stack: error.stack
    });
    
    setMessage({ 
      type: 'error', 
      text: `Failed to load locations: ${error.message}` 
    });
    setLocations([]);
    setLoading(false);
  }
};
  const fetchDocuments = async () => {
    if (!selectedLocation) return;
    
    try {
      const response = await fetch(
        `${API_BASE}/documents/?location=${selectedLocation.id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        const docList = Array.isArray(data) ? data : data.results || [];
        setDocuments(docList);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const fetchForms = async () => {
    if (!selectedLocation) return;
    
    try {
      const response = await fetch(
        `${API_BASE}/forms/?location=${selectedLocation.id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        const formList = Array.isArray(data) ? data : data.results || [];
        setForms(formList);
      }
    } catch (error) {
      console.error('Error fetching forms:', error);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadFile || !uploadSection) {
      setMessage({ type: 'error', text: 'Please select a file and section' });
      return;
    }

    if (!selectedLocation) {
      setMessage({ type: 'error', text: 'No location selected' });
      return;
    }

    setUploading(true);
    const formDataObj = new FormData();
    formDataObj.append('file', uploadFile);
    formDataObj.append('location', selectedLocation.id.toString());
    formDataObj.append('section', uploadSection);

    try {
      const response = await fetch(`${API_BASE}/documents/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataObj,
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Document uploaded successfully!' });
        setUploadFile(null);
        setUploadSection('');
        
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        fetchDocuments();
        setActiveTab('documents');
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.detail || error.error || 'Upload failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Upload failed. Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  const handleCreateForm = () => {
    if (!newFormSection) {
      setMessage({ type: 'error', text: 'Please select a form section' });
      return;
    }
    
    const section = formSections.find(s => s.value === newFormSection);
    if (!section) return;

    const initialData: any = {};
    section.fields.forEach(field => {
      initialData[field.name] = '';
    });

    setFormData(initialData);
    setEditingForm(null);
  };

  const handleEditForm = (form: FormSubmission) => {
    const section = formSections.find(s => s.value === form.section);
    if (!section) return;

    setNewFormSection(form.section);
    setFormData(form.data || {});
    setEditingForm(form);
    setActiveTab('create-form');
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedLocation) {
      setMessage({ type: 'error', text: 'No location selected' });
      return;
    }

    if (!newFormSection) {
      setMessage({ type: 'error', text: 'Please select a form section' });
      return;
    }

    setSavingForm(true);

    try {
      const url = editingForm 
        ? `${API_BASE}/forms/${editingForm.id}/`
        : `${API_BASE}/forms/`;
      
      const method = editingForm ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section: newFormSection,
          location: selectedLocation.id,
          data: formData,
        }),
      });

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: editingForm ? 'Form updated successfully!' : 'Form submitted successfully!' 
        });
        setNewFormSection('');
        setFormData({});
        setEditingForm(null);
        setActiveTab('forms');
        fetchForms();
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.detail || 'Failed to save form' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save form. Please try again.' });
    } finally {
      setSavingForm(false);
    }
  };

  const handleFormFieldChange = (fieldName: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const getSectionLabel = (value: string, type: 'document' | 'form' = 'document'): string => {
    const sections = type === 'document' ? documentSections : formSections;
    const section = sections.find(s => s.value === value);
    return section ? section.label : value;
  };

  const getUsername = (user: string | { username: string }): string => {
    if (typeof user === 'string') return user;
    return user?.username || 'Unknown';
  };

  const renderFormField = (field: any) => {
    const value = formData[field.name] || '';

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleFormFieldChange(field.name, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            required
          />
        );
      
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleFormFieldChange(field.name, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">-- Select --</option>
            {field.options?.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      
      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleFormFieldChange(field.name, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        );
      
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFormFieldChange(field.name, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">External Dashboard</h1>
                <p className="text-sm text-gray-600 mt-1">Welcome, {user.first_name || user.username}!</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">{user.company_name}</p>
                  <p className="text-xs text-gray-500">External User</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-8 text-center">
            <AlertCircle className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">No Locations Assigned</h2>
            <p className="text-gray-600 mb-6">
              You haven't been granted access to any locations yet.
            </p>
            <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
              <p className="text-sm text-gray-700 mb-4">To get started:</p>
              <ol className="text-left text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="font-semibold mr-2">1.</span>
                  <span>Contact the Gastronom (location operator) or administrator</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">2.</span>
                  <span>Request access to specific locations</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">3.</span>
                  <span>Once granted, you'll be able to view and upload documents</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">External Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">Welcome, {user.first_name || user.username}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">{user.company_name}</p>
                <p className="text-xs text-gray-500">External User • {locations.length} Location{locations.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${
            message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2" />
            )}
            <span>{message.text}</span>
            <button
              onClick={() => setMessage({ type: '', text: '' })}
              className="ml-auto text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        )}

        {locations.length > 1 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Location
            </label>
            <select
              value={selectedLocation?.id || ''}
              onChange={(e) => {
                const location = locations.find(l => l.id === parseInt(e.target.value));
                setSelectedLocation(location || null);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name} - {location.city}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedLocation && (
          <>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm p-6 mb-6 border border-blue-200">
              <div className="flex items-start">
                <Building2 className="w-6 h-6 text-blue-600 mt-1 mr-3" />
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">{selectedLocation.name}</h2>
                  <p className="text-gray-600 mt-1">{selectedLocation.address}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedLocation.city} - {selectedLocation.postal_code}
                  </p>
                  {selectedLocation.location_id && (
                    <p className="text-xs text-gray-500 mt-2">
                      Location ID: {selectedLocation.location_id}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('documents')}
                    className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                      activeTab === 'documents'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <FileText className="w-5 h-5 inline mr-2" />
                    Documents ({documents.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('forms')}
                    className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                      activeTab === 'forms'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <FileText className="w-5 h-5 inline mr-2" />
                    Forms ({forms.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                      activeTab === 'upload'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Upload className="w-5 h-5 inline mr-2" />
                    Upload Document
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('create-form');
                      setEditingForm(null);
                      setFormData({});
                      setNewFormSection('');
                    }}
                    className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                      activeTab === 'create-form'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Plus className="w-5 h-5 inline mr-2" />
                    Create Form
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'documents' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
                    {documents.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg mb-2">No documents uploaded yet.</p>
                        <button
                          onClick={() => setActiveTab('upload')}
                          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                        >
                          Upload Your First Document
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {documents.map((doc) => (
                          <div
                            key={doc.id}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center">
                                  <FileText className="w-5 h-5 text-blue-600 mr-2" />
                                  <span className="font-medium text-gray-900">
                                    {doc.file_name || doc.file_url.split('/').pop()}
                                  </span>
                                  {doc.locked && (
                                    <Lock className="w-4 h-4 text-gray-400 ml-2" />
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                  {getSectionLabel(doc.section, 'document')}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Uploaded by {getUsername(doc.uploaded_by)} on{' '}
                                  {new Date(doc.uploaded_at).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => window.open(doc.file_url, '_blank')}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="View"
                                >
                                  <Eye className="w-5 h-5" />
                                </button>
                                <a
                                  href={doc.file_url}
                                  download
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Download"
                                >
                                  <Download className="w-5 h-5" />
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'forms' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Form Submissions</h3>
                    {forms.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg mb-2">No forms submitted yet.</p>
                        <button
                          onClick={() => {
                            setActiveTab('create-form');
                            setEditingForm(null);
                            setFormData({});
                            setNewFormSection('');
                          }}
                          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                        >
                          Create Your First Form
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {forms.map((form) => {
                          const submittedBy = typeof form.submitted_by === 'object' 
                            ? form.submitted_by 
                            : { username: form.submitted_by, id: 0 };
                          
                          return (
                            <div
                              key={form.id}
                              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center">
                                    <FileText className="w-5 h-5 text-purple-600 mr-2" />
                                    <span className="font-medium text-gray-900">
                                      {getSectionLabel(form.section, 'form')}
                                    </span>
                                    {form.locked && (
                                      <Lock className="w-4 h-4 text-gray-400 ml-2" />
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Submitted by {submittedBy.username} on{' '}
                                    {new Date(form.submitted_at).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => setViewingForm(form)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="View Details"
                                  >
                                    <Eye className="w-5 h-5" />
                                  </button>
                                  {!form.locked && submittedBy.id === user.id && (
                                    <button
                                      onClick={() => handleEditForm(form)}
                                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                      title="Edit"
                                    >
                                      <Edit className="w-5 h-5" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'upload' && (
                  <div className="max-w-2xl">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Document</h3>
                    <form onSubmit={handleFileUpload} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Section
                        </label>
                        <select
                          value={uploadSection}
                          onChange={(e) => setUploadSection(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="">-- Select a section --</option>
                          {documentSections.map((section) => (
                            <option key={section.value} value={section.value}>
                              {section.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select File
                        </label>
                        <input
                          type="file"
                          onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Allowed: PDF, Images, Word documents (Max 10MB)
                        </p>
                      </div>

                      {uploadFile && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-sm text-gray-700">
                            <strong>Selected:</strong> {uploadFile.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Size: {(uploadFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={uploading}
                        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
                      >
                        <Upload className="w-5 h-5 mr-2" />
                        {uploading ? 'Uploading...' : 'Upload Document'}
                      </button>
                    </form>
                  </div>
                )}

                {activeTab === 'create-form' && (
                  <div className="max-w-3xl">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {editingForm ? 'Edit Form' : 'Create New Form'}
                    </h3>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Form Section
                      </label>
                      <select
                        value={newFormSection}
                        onChange={(e) => {
                          setNewFormSection(e.target.value);
                          setFormData({});
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={editingForm !== null}
                        required
                      >
                        <option value="">-- Select a form section --</option>
                        {formSections.map((section) => (
                          <option key={section.value} value={section.value}>
                            {section.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {newFormSection && Object.keys(formData).length === 0 && (
                      <button
                        onClick={handleCreateForm}
                        className="mb-6 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Initialize Form Fields
                      </button>
                    )}

                    {Object.keys(formData).length > 0 && (
                      <form onSubmit={handleSaveForm} className="space-y-4">
                        {formSections
                          .find(s => s.value === newFormSection)
                          ?.fields.map((field) => (
                            <div key={field.name}>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                {field.label}
                              </label>
                              {renderFormField(field)}
                            </div>
                          ))}

                        <div className="flex space-x-4 pt-4">
                          <button
                            type="submit"
                            disabled={savingForm}
                            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
                          >
                            <Save className="w-5 h-5 mr-2" />
                            {savingForm ? 'Saving...' : (editingForm ? 'Update Form' : 'Submit Form')}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setNewFormSection('');
                              setFormData({});
                              setEditingForm(null);
                              setActiveTab('forms');
                            }}
                            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center"
                          >
                            <X className="w-5 h-5 mr-2" />
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {viewingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                {getSectionLabel(viewingForm.section, 'form')}
              </h3>
              <button
                onClick={() => setViewingForm(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600">
                  <strong>Submitted by:</strong> {typeof viewingForm.submitted_by === 'object' ? viewingForm.submitted_by.username : viewingForm.submitted_by}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Submitted on:</strong> {new Date(viewingForm.submitted_at).toLocaleString()}
                </p>
                {viewingForm.locked && (
                  <p className="text-sm text-amber-600 flex items-center mt-2">
                    <Lock className="w-4 h-4 mr-1" />
                    This form is locked and cannot be edited
                  </p>
                )}
              </div>

              {formSections
                .find(s => s.value === viewingForm.section)
                ?.fields.map((field) => (
                  <div key={field.name} className="border-b border-gray-200 pb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                    <p className="text-gray-900">
                      {viewingForm.data[field.name] || <span className="text-gray-400 italic">No data</span>}
                    </p>
                  </div>
                ))}
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
              <button
                onClick={() => setViewingForm(null)}
                className="w-full bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExternalDashboard;