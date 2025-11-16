import { Link } from "react-router-dom";
import image from '../images/greaseseperator.png'

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-linear-to-br bg-[#ECECEC]">

      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Verwalten Sie Ihre Fettfangvorrichtung <br className="hidden lg:block" />Protokolle digitalisieren
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            ChatGPT said:

            Die moderne Lösung für eine unkomplizierte Verwaltung von Fettfangvorrichtungen und Einhaltung von Vorschriften
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="inline-block bg-indigo-600 text-white px-10 py-4 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-lg text-lg"
            >
              Loslegen
            </Link>
          </div>
        </div>


        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mt-12 mb-16">
          <div className="flex-1 space-y-5">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              Compliance vereinfachen und Abläufe optimieren
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
            Willkommen bei GreaseLog – Ihre Lösung für die unkomplizierte Verwaltung von Fettfangvorrichtungen. Verabschieden Sie sich von verlorenen Unterlagen und manuellen Fehlern und freuen Sie sich auf mühelose Einhaltung von Vorschriften und Sicherheit.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
           Unsere digitale Plattform ermöglicht es Ihnen, Entsorgungsnachweise einfach einzutragen, monatliche Selbstkontrollen durchzuführen und jederzeit auf historische Daten zuzugreifen – egal wo Sie sind. Optimieren Sie die Zusammenarbeit mit Ihrem Team und Ihren Lieferanten und stellen Sie gleichzeitig die Einhaltung gesetzlicher Vorschriften sicher.
            </p>
            <p className="text-lg font-semibold text-indigo-600 pt-2">
              Ready to revolutionize your grease trap management?
            </p>
          </div>
          <div className="flex-1 flex justify-center lg:justify-end">
            <img
              src={image}
              alt="Grease trap management"
              className="w-full max-w-md rounded-xl shadow-xl"
            />
          </div>
        </div>

       
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 mt-16 mb-12">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            <div className="lg:w-2/5">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Lass uns Holen<br />
                Um uns kennenzulernen
              </h2>
            </div>
            <div className="lg:w-3/5">
              <p className="text-lg text-gray-700 leading-relaxed">
                Unsere Website ist die Anlaufstelle für Fachleute aus der Gastronomiebranche, die auf der Suche nach effizienten Fettabscheiderlösungen sind. Mit einem umfassenden Verständnis der deutschen Vorschriften stellen wir sicher, dass jedes Restaurant die Compliance-Standards einhält. Von der Installation über die Wartung bis hin zu digitalen Betriebsprotokollen optimieren unsere Dienstleistungen das Abfallmanagement. Durch flexible Abonnementpläne bieten wir einen nahtlosen Datenzugriff bei Eigentümerwechseln und sorgen so für Sicherheit für unsere Kunden. Vertrauen Sie uns für zuverlässige Wartung und innovative technologische Lösungen, die auf Ihre Bedürfnisse zugeschnieben sind.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}