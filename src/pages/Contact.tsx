import { Mail, Phone, Send } from "lucide-react";

export default function Contact() {
  const recipientEmail = "your-email@gmail.com";
  const subject = "Kontakt über die Website";

  const handleContactClick = () => {
    const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Kontakt
          </h1>
          <p className="text-gray-600 text-lg">
            Wir helfen Ihnen gerne weiter
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Mail className="w-8 h-8 text-[#DFA927]" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Schreiben Sie uns
            </h2>
            <p className="text-gray-600 mb-6">
              Haben Sie Fragen? Senden Sie uns eine E-Mail und wir melden uns schnellstmöglich bei Ihnen.
            </p>
            <button
              onClick={handleContactClick}
              className="bg-[#DFA927] hover:bg-[#c4901f] text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 transition-colors"    >
              <Send className="w-5 h-5" />
              E-Mail senden
            </button>
          </div>
        </div>


        <div className="grid md:grid-cols-2 gap-4">


          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="w-5 h-5 text-[#DFA927]" />
              <h3 className="font-semibold text-gray-900">E-Mail</h3>
            </div>
            <p className="text-gray-600 text-sm">{recipientEmail}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Phone className="w-5 h-5 text-[#DFA927]" />
              <h3 className="font-semibold text-gray-900">Telefon</h3>
            </div>
            <p className="text-gray-600 text-sm">+1 (555) 123-4567</p>
          </div>

        </div>
      </div>
    </div>
  );
}