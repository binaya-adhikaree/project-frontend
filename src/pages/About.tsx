import { Wrench, FileText, Shield, CheckCircle, Clock, Award, User, Target } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-yellow-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-linear-to-r from-amber-600 via-orange-600 to-yellow-600 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 pb-32 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Über uns</h1>
            <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto">
              Fettabscheider Sanierung Berlin — Ihr Partner für sichere, professionelle und digitale Fettabscheider-Dokumentation
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#fffbeb"/>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        
        <div className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="prose max-w-none">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
                <span className="font-bold text-orange-600">Fettabscheider Sanierung Berlin</span> wurde von <span className="font-semibold">Ferdinand Potel</span> gegründet und steht für zuverlässige, fachgerechte Dienstleistungen rund um Fettabscheideranlagen in der Gastronomie.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Mit Sitz in <span className="font-semibold">Berlin</span> und <span className="font-semibold">Petershagen/Eggersdorf</span> unterstützen wir gastronomische Betriebe dabei, ihre gesetzlichen Pflichten zur Wartung, Dokumentation und Entsorgung von Fettabscheidern sicher und lückenlos zu erfüllen.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Unser Fokus liegt darauf, Restaurantbetreibern eine praktische Lösung zu bieten, die Zeit spart, Ausfälle verhindert und Rechtssicherheit schafft.
              </p>
            </div>
          </div>
        </div>

        {/* Was wir tun */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
              <Wrench className="w-10 h-10 text-orange-600" />
              Was wir tun
            </h2>
            <p className="text-gray-600 text-lg">Unser Unternehmen ist spezialisiert auf:</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300 border-t-4 border-orange-600">
              <div className="bg-orange-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Wrench className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Reparaturarbeiten</h3>
              <p className="text-gray-600">Reparaturarbeiten an Fettabscheideranlagen</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300 border-t-4 border-amber-600">
              <div className="bg-amber-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Beschichtungen</h3>
              <p className="text-gray-600">Neuauftrag und Erneuerung von Beschichtungen</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300 border-t-4 border-yellow-600">
              <div className="bg-yellow-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-7 h-7 text-yellow-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Austausch</h3>
              <p className="text-gray-600">Austausch von Zu- und Ablauf-Einrichtungen</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300 border-t-4 border-orange-500">
              <div className="bg-orange-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-7 h-7 text-orange-500" />
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Entsorgungsnachweise</h3>
              <p className="text-gray-600">Organisation und Dokumentation von Entsorgungsnachweisen</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300 border-t-4 border-amber-500">
              <div className="bg-amber-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-7 h-7 text-amber-500" />
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Digitale Verwaltung</h3>
              <p className="text-gray-600">Digitale Verwaltung und Archivierung aller relevanten Unterlagen</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300 border-t-4 border-yellow-500">
              <div className="bg-yellow-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Award className="w-7 h-7 text-yellow-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Normenkonformität</h3>
              <p className="text-gray-600">Erfüllung von DIN, Umwelt- und Hygienevorschriften</p>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <div className="bg-linear-to-to-br from-orange-600 to-amber-700 rounded-2xl shadow-2xl p-8 md:p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 flex items-center gap-3">
              <FileText className="w-10 h-10" />
              Warum wir das digitale Betriebstagebuch entwickelt haben
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-bold mb-4 text-orange-100">Das Problem im Alltag:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-red-300 text-xl">✗</span>
                    <span>Verlust von Unterlagen</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-300 text-xl">✗</span>
                    <span>Unübersichtliche Ordnerstrukturen</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-300 text-xl">✗</span>
                    <span>Fehlende Nachweise bei Kontrollen</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-300 text-xl">✗</span>
                    <span>Zeitaufwändige Kommunikation</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4 text-orange-100">Unsere Lösung:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-green-300 text-xl">✓</span>
                    <span>Einträge digital erfassen</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-300 text-xl">✓</span>
                    <span>Entsorgungen dokumentieren</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-300 text-xl">✓</span>
                    <span>PDF-Nachweise hochladen</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-300 text-xl">✓</span>
                    <span>Fotos ablegen</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-300 text-xl">✓</span>
                    <span>Zeitstempel manipulationssicher speichern</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
              <p className="text-lg leading-relaxed">
                So bleiben alle Daten zentral, sicher und jederzeit abrufbar – auch bei einem Betreiberwechsel.
              </p>
            </div>
          </div>
        </div>

        {/* Mission */}
        <div className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Target className="w-10 h-10 text-orange-600" />
              Unsere Mission
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              Wir bringen Technik, Service und Rechtssicherheit zusammen – damit Gastronomiebetriebe:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-linear-to-br from-orange-50 to-orange-100 rounded-xl p-6 text-center">
                <CheckCircle className="w-12 h-12 text-orange-600 mx-auto mb-3" />
                <p className="font-semibold text-gray-800">gesetzeskonform arbeiten</p>
              </div>
              <div className="bg-linear-to-br from-amber-50 to-amber-100 rounded-xl p-6 text-center">
                <Shield className="w-12 h-12 text-amber-600 mx-auto mb-3" />
                <p className="font-semibold text-gray-800">jederzeit auditbereit sind</p>
              </div>
              <div className="bg-linear-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 text-center">
                <Target className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                <p className="font-semibold text-gray-800">sich auf ihr Kerngeschäft konzentrieren können</p>
              </div>
            </div>
          </div>
        </div>

        {/* Inhaber */}
        <div className="mb-16">
          <div className="bg-yellow-600 rounded-2xl shadow-2xl p-8 md:p-12 text-white">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="bg-orange-400 w-32 h-32 rounded-full flex items-center justify-center flex-0">
                <User className="w-20 h-20" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">Ferdinand Potel</h2>
                <p className="text-xl text-white mb-4">Gründer & Betriebsinhaber</p>
                <p className="text-lg text-white">Fettabscheider Sanierung Berlin</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">Unser Versprechen</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-linear-to-br from-orange-50 to-orange-100 rounded-xl">
                <CheckCircle className="w-16 h-16 text-orange-600 mx-auto mb-4" />
                <h3 className="font-bold text-gray-800 text-lg">Zuverlässigkeit</h3>
              </div>
              <div className="text-center p-6 bg-linear-to-br from-amber-50 to-amber-100 rounded-xl">
                <FileText className="w-16 h-16 text-amber-600 mx-auto mb-4" />
                <h3 className="font-bold text-gray-800 text-lg">Transparente Prozesse</h3>
              </div>
              <div className="text-center p-6 bg-linear-to-br from-yellow-50 to-yellow-100 rounded-xl">
                <Shield className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
                <h3 className="font-bold text-gray-800 text-lg">Gesetzeskonforme Dokumentation</h3>
              </div>
              <div className="text-center p-6 bg-linear-to-br from-orange-50 to-orange-200 rounded-xl">
                <Award className="w-16 h-16 text-orange-700 mx-auto mb-4" />
                <h3 className="font-bold text-gray-800 text-lg">Moderne digitale Lösungen</h3>
              </div>
            </div>
            <p className="text-center text-xl text-gray-700 font-semibold mt-8">
              Wir sind erst zufrieden, wenn unsere Kunden es auch sind.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-yellow-600 rounded-2xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Bereit für professionelle Fettabscheider-Wartung?</h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Kontaktieren Sie uns für eine unverbindliche Beratung und erfahren Sie, wie wir Ihren Betrieb unterstützen können.
          </p>
          <button className="bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            Jetzt Kontakt aufnehmen
          </button>
        </div>
      </div>
    </div>
  );
}