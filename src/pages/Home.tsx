import { Link } from "react-router-dom";
import image from '../images/greaseseperator.png'

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#ECECEC]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12">
        {/* Hero Section */}
        <div className="text-center mb-6 sm:mb-10 lg:mb-12">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 leading-tight px-2">
            Verwalten Sie Ihre Fettfangvorrichtung <br className="hidden sm:block" />
            Protokolle digitalisieren
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-600 max-w-3xl mx-auto mb-4 sm:mb-6 lg:mb-8 px-4 leading-relaxed">
            Die moderne Lösung für eine unkomplizierte Verwaltung von Fettfangvorrichtungen und Einhaltung von Vorschriften
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link
              to="/login"
              className="inline-block bg-[#DFA927] text-white px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-4 rounded-lg font-semibold hover:bg-[#c4901f] transition shadow-lg text-sm sm:text-base md:text-lg lg:text-xl"
            >
              Loslegen
            </Link>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-10 lg:gap-12 mt-6 sm:mt-10 lg:mt-12 mb-8 sm:mb-12 lg:mb-16">
          {/* Text Content */}
          <div className="flex-1 space-y-3 sm:space-y-4 lg:space-y-5 px-4 lg:px-0">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight">
              Compliance vereinfachen und Abläufe optimieren
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
              Willkommen bei GreaseLog – Ihre Lösung für die unkomplizierte Verwaltung von Fettfangvorrichtungen. Verabschieden Sie sich von verlorenen Unterlagen und manuellen Fehlern und freuen Sie sich auf mühelose Einhaltung von Vorschriften und Sicherheit.
            </p>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
              Unsere digitale Plattform ermöglicht es Ihnen, Entsorgungsnachweise einfach einzutragen, monatliche Selbstkontrollen durchzuführen und jederzeit auf historische Daten zuzugreifen – egal wo Sie sind. Optimieren Sie die Zusammenarbeit mit Ihrem Team und Ihren Lieferanten und stellen Sie gleichzeitig die Einhaltung gesetzlicher Vorschriften sicher.
            </p>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-[#DFA927] pt-2">
              Ready to revolutionize your grease trap management?
            </p>
          </div>

          {/* Image */}
          <div className="flex-1 flex justify-center lg:justify-end w-full px-4 lg:px-0">
            <img
              src={image}
              alt="Grease trap management"
              className="w-full max-w-[280px] xs:max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg rounded-lg sm:rounded-xl shadow-xl"
            />
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 lg:p-12 mt-8 sm:mt-12 lg:mt-16 mb-6 sm:mb-10 lg:mb-12 mx-4 sm:mx-0">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8 lg:gap-12 items-start">
            {/* Left Column - Heading */}
            <div className="w-full lg:w-2/5">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                Lass uns Holen<br className="hidden sm:block" />
                Um uns kennenzulernen
              </h2>
            </div>

            {/* Right Column - Description */}
            <div className="w-full lg:w-3/5">
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed">
                Unsere Website ist die Anlaufstelle für Fachleute aus der Gastronomiebranche, die auf der Suche nach effizienten Fettabscheiderlösungen sind. Mit einem umfassenden Verständnis der deutschen Vorschriften stellen wir sicher, dass jedes Restaurant die Compliance-Standards einhält. Von der Installation über die Wartung bis hin zu digitalen Betriebsprotokollen optimieren unsere Dienstleistungen das Abfallmanagement. Durch flexible Abonnementpläne bieten wir einen nahtlosen Datenzugriff bei Eigentümerwechseln und sorgen so für Sicherheit für unsere Kunden. Vertrauen Sie uns für zuverlässige Wartung und innovative technologische Lösungen, die auf Ihre Bedürfnisse zugeschnitten sind.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}