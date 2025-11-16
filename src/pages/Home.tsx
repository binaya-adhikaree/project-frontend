import { Link } from "react-router-dom";
import image from '../images/greaseseperator.png'

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-linear-to-br bg-[#ECECEC]">

      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Manage Your Grease Trap <br className="hidden lg:block" />Logs Digitally
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            The modern solution for hassle-free grease trap management and compliance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="inline-block bg-indigo-600 text-white px-10 py-4 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-lg text-lg"
            >
              Get Started
            </Link>
          </div>
        </div>


        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mt-12 mb-16">
          <div className="flex-1 space-y-5">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              Simplify Compliance and Optimize Operations
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Welcome to GreaseLog – your solution for the hassle-free management of grease traps. Say goodbye to lost paperwork and manual errors and look forward to effortless compliance and security.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our digital platform allows you to easily enter disposal records, perform monthly self-inspections and access historical data anytime, anywhere. Optimize collaboration with your team and suppliers while ensuring regulatory compliance.
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

        {/* New Section - Get to Know Us */}
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