import { Mail, Phone } from "lucide-react";

export default function Contact() {
  const recipientEmail = "your-email@gmail.com"; // Replace with your actual email
  const subject = "Contact from Website";

  const handleContactClick = () => {
    
    const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Contact Us</h1>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <Mail className="w-16 h-16 text-indigo-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900">
                Get in Touch
              </h2>
              
              <p className="text-gray-600 max-w-md mx-auto">
                Have questions or need assistance? Click the button below to send us an email directly.
              </p>

              <button
                onClick={handleContactClick}
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition inline-flex items-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Send Email
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <Mail className="w-6 h-6 text-indigo-600" />
                <h3 className="text-xl font-bold">Email</h3>
              </div>
              <p className="text-gray-600">{recipientEmail}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <Phone className="w-6 h-6 text-indigo-600" />
                <h3 className="text-xl font-bold">Phone</h3>
              </div>
              <p className="text-gray-600">+1 (555) 123-4567</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}