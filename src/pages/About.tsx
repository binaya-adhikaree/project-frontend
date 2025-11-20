
import image from '../images/greaseseperator.png'

const About = () => {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#ECECEC]">
      <div className="container mx-auto px-6 py-12">

        <div className="text-center mb-16">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Über GreaseLog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ihre verlässliche Lösung für die digitale Verwaltung von Fettfangvorrichtungen
          </p>
        </div>


        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 mb-12">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Unsere Mission
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Bei GreaseLog haben wir es uns zur Aufgabe gemacht, die Verwaltung von Fettfangvorrichtungen zu revolutionieren. Wir verstehen die Herausforderungen, mit denen Gastronomiebetriebe täglich konfrontiert sind – von der Einhaltung strenger Vorschriften bis hin zur Organisation unzähliger Dokumente.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Unsere digitale Plattform wurde entwickelt, um diese Prozesse zu vereinfachen und Ihnen Zeit, Geld und Stress zu sparen. Wir glauben an innovative Technologie, die echte Probleme löst.
              </p>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <img
                src={image}
                alt="Grease trap management"
                className="w-full max-w-md rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
            Warum GreaseLog?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition">
              <div className="w-12 h-12 bg-[#DFA927] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                100% Compliance
              </h3>
              <p className="text-gray-600">
                Erfüllen Sie alle deutschen Vorschriften automatisch. Unsere Plattform ist auf dem neuesten Stand der gesetzlichen Anforderungen.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition">
              <div className="w-12 h-12 bg-[#DFA927] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Zeitersparnis
              </h3>
              <p className="text-gray-600">
                Reduzieren Sie den Verwaltungsaufwand um bis zu 80%. Konzentrieren Sie sich auf Ihr Kerngeschäft, wir kümmern uns um die Dokumentation.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition">
              <div className="w-12 h-12 bg-[#DFA927] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Cloud-basiert
              </h3>
              <p className="text-gray-600">
                Greifen Sie von überall auf Ihre Daten zu. Ob im Restaurant, unterwegs oder im Homeoffice – Ihre Protokolle sind immer verfügbar.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition">
              <div className="w-12 h-12 bg-[#DFA927] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Team-Zusammenarbeit
              </h3>
              <p className="text-gray-600">
                Arbeiten Sie nahtlos mit Ihrem Team und Dienstleistern zusammen. Berechtigungen individuell anpassen und kontrollieren.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition">
              <div className="w-12 h-12 bg-[#DFA927] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Datensicherheit
              </h3>
              <p className="text-gray-600">
                Ihre Daten sind bei uns sicher. DSGVO-konform, verschlüsselt und regelmäßig gesichert auf deutschen Servern.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition">
              <div className="w-12 h-12 bg-[#DFA927] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                24/7 Support
              </h3>
              <p className="text-gray-600">
                Unser Kundenservice steht Ihnen jederzeit zur Verfügung. Schnelle Hilfe bei Fragen oder Problemen garantiert.
              </p>
            </div>
          </div>
        </div>


        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">
            Unsere Geschichte
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              GreaseLog wurde aus der Erfahrung heraus gegründet, dass die Verwaltung von Fettfangvorrichtungen in der Gastronomie oft ineffizient und fehleranfällig ist. Als Team mit langjähriger Erfahrung in der Gastronomiebranche und IT-Branche haben wir die Herausforderungen aus erster Hand kennengelernt.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Verlorene Papiere, vergessene Wartungstermine und der ständige Stress bei Kontrollen – diese Probleme wollten wir ein für alle Mal lösen. Mit moderner Technologie und einem tiefen Verständnis für die Bedürfnisse der Gastronomie haben wir eine Lösung geschaffen, die wirklich funktioniert.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Heute unterstützen wir Hunderte von Restaurants dabei, ihre Fettfangvorrichtungen effizient zu verwalten und sich dabei vollständig auf ihre Compliance verlassen zu können. Wir wachsen kontinuierlich und entwickeln unsere Plattform ständig weiter, um Ihnen den bestmöglichen Service zu bieten.
            </p>
          </div>
        </div>


        <div className="mb-16">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
            Unsere Werte
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-linear-to-br from-indigo-50 to-white rounded-xl p-8 border border-indigo-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Innovation
              </h3>
              <p className="text-gray-700">
                Wir setzen auf modernste Technologie, um Ihre Arbeit zu erleichtern und neue Maßstäbe in der Branche zu setzen.
              </p>
            </div>

            <div className="bg-linear-to-br from-indigo-50 to-white rounded-xl p-8 border border-indigo-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Zuverlässigkeit
              </h3>
              <p className="text-gray-700">
                Ihre Daten und Prozesse sind bei uns in sicheren Händen. Darauf können Sie sich verlassen – jeden Tag.
              </p>
            </div>

            <div className="bg-linear-to-br from-indigo-50 to-white rounded-xl p-8 border border-indigo-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Kundenfokus
              </h3>
              <p className="text-gray-700">
                Ihre Zufriedenheit steht für uns an erster Stelle. Wir hören zu und entwickeln Lösungen, die wirklich helfen.
              </p>
            </div>

            <div className="bg-linear-to-br from-indigo-50 to-white rounded-xl p-8 border border-indigo-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Transparenz
              </h3>
              <p className="text-gray-700">
                Keine versteckten Kosten, keine Überraschungen. Bei uns wissen Sie immer, woran Sie sind.
              </p>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default About;