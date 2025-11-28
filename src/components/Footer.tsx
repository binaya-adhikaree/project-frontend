import logo from "../images/logo.png";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 sm:py-10 lg:py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8 text-center sm:text-left">

          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2 justify-center sm:justify-start">
              <img src={logo} className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0" alt="Logo" />
              <span className="leading-tight">Fettabscheider Sanierung Berlin</span>
            </h3>
            <div className="text-gray-400 space-y-2 text-sm sm:text-base">
              <p className="flex items-start gap-2 justify-center sm:justify-start flex-wrap">
                <span className="font-medium whitespace-nowrap">Telefonnummer:</span>
                <a href="tel:017645769973" className="hover:text-blue-400 transition-colors">
                  017645769973
                </a>
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
              <li>
                <a href="#weekdays" className="hover:text-white transition-colors">
                  Wochentage
                </a>
              </li>
              <li>
                <a href="#timing" className="hover:text-white transition-colors">
                  Öffnungszeiten
                </a>
              </li>
              <li className="pt-2">
                <span className="font-medium">Telefonnummer:</span>
                <br />
                <a href="tel:017645769973" className="hover:text-blue-400 transition-colors break-all">
                  017645769973
                </a>
              </li>
              <li>
                <span className="font-medium">E-Mail-Adresse:</span>
                <br />
                <a href="mailto:info@geske-technik.de" className="hover:text-blue-400 transition-colors break-all">
                  info@geske-technik.de
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Schnellzugriff</h3>
            <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
              <li>
                <a href="#problems" className="hover:text-white transition-colors">
                  Probleme
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Preise
                </a>
              </li>
              <li>
                <a href="#help" className="hover:text-white transition-colors">
                  Hilfe
                </a>
              </li>
              <li>
                <a href="#feedback" className="hover:text-white transition-colors">
                  Feedback
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Kontakt</h3>
            <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
              <li>
                <a href="/home" className="hover:text-white transition-colors">
                  Startseite
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white transition-colors">
                  Kontakt
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-white transition-colors">
                  Über uns
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-4 sm:pt-6 text-center text-gray-400 text-xs sm:text-sm">
          <p>© {new Date().getFullYear()} Alle Rechte vorbehalten</p>
        </div>
      </div>
    </footer>
  );
}