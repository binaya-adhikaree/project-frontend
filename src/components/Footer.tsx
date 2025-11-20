import logo from "../images/logo.png";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <img src={logo} className="h-12 w-12" alt="Logo" />
              Fettabscheider Sanierung Berlin
            </h3>
            <div className="text-gray-400 space-y-2">
              <p className="flex items-start gap-2">
                <span className="font-medium">Telefonnummer:</span>
                <a href="tel:017645769973" className="hover:text-blue-400 transition-colors">
                  017645769973
                </a>
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
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
                <a href="tel:017645769973" className="hover:text-blue-400 transition-colors">
                  017645769973
                </a>
              </li>
              <li>
                <span className="font-medium">E-Mail-Adresse:</span>
                <br />
                <a href="mailto:info@geske-technik.de" className="hover:text-blue-400 transition-colors">
                  info@geske-technik.de
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Schnellzugriff</h3>
            <ul className="space-y-2 text-gray-400">
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
            <h3 className="text-lg font-semibold mb-4">Kontakt</h3>
            <ul className="space-y-2 text-gray-400">
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

        <div className="border-t border-gray-800 pt-6 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Alle Rechte vorbehalten</p>
        </div>
      </div>
    </footer>
  );
}
