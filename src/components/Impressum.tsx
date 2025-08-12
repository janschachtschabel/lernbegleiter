import React, { useState } from 'react';
import { X, Mail, MapPin, User, Send, CheckCircle } from 'lucide-react';

interface ImpressumProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Impressum({ isOpen, onClose }: ImpressumProps) {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create mailto link with form data
    const mailtoLink = `mailto:info@schachtschabel.net?subject=${encodeURIComponent(
      `[WLO Lernbegleiter] ${contactForm.subject}`
    )}&body=${encodeURIComponent(
      `Name: ${contactForm.name}\nE-Mail: ${contactForm.email}\n\nNachricht:\n${contactForm.message}`
    )}`;

    // Open default email client
    window.location.href = mailtoLink;

    // Show success message
    setSubmitSuccess(true);
    setContactForm({ name: '', email: '', subject: '', message: '' });
    
    setTimeout(() => {
      setSubmitSuccess(false);
      setIsSubmitting(false);
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Impressum & Kontakt</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Impressum Section */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Impressum
            </h3>
            
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Angaben gemäß § 5 TMG:</h4>
                <div className="space-y-1 text-gray-700">
                  <p><strong>Jan Schachtschabel</strong></p>
                  <p className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Steubenstr. 34<br />
                    99423 Weimar<br />
                    Deutschland
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Kontakt:</h4>
                <p className="flex items-center text-gray-700">
                  <Mail className="h-4 w-4 mr-2" />
                  <a href="mailto:info@schachtschabel.net" className="text-blue-600 hover:text-blue-800">
                    info@schachtschabel.net
                  </a>
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</h4>
                <p className="text-gray-700">Jan Schachtschabel (Anschrift wie oben)</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Haftungsausschluss:</h4>
                <div className="text-sm text-gray-600 space-y-2">
                  <p><strong>Haftung für Inhalte:</strong> Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht unter der Verpflichtung, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.</p>
                  
                  <p><strong>Haftung für Links:</strong> Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.</p>
                  
                  <p><strong>Urheberrecht:</strong> Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Datenschutz:</h4>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>Diese Anwendung verarbeitet personenbezogene Daten nur im zur Funktionserbringung erforderlichen Umfang. Es werden keine Daten an Dritte weitergegeben, außer an die genutzten KI-Dienste (OpenAI, GWDG) zur Bereitstellung der Lernbegleitung.</p>
                  <p>Ihre Eingaben werden zur Verbesserung der Lernbegleitung verarbeitet. Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Widerspruch bezüglich Ihrer Daten.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Form Section */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Kontaktformular
            </h3>

            {submitSuccess ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-green-900 mb-2">Nachricht versendet!</h4>
                <p className="text-green-700">Ihr E-Mail-Programm sollte sich geöffnet haben. Bitte senden Sie die vorausgefüllte E-Mail ab.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ihr Name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      E-Mail *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="ihre.email@beispiel.de"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Betreff *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    required
                    value={contactForm.subject}
                    onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Worum geht es?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Nachricht *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ihre Nachricht..."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Wird versendet...
                    </div>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Nachricht senden
                    </>
                  )}
                </button>
                
                <p className="text-xs text-gray-500 text-center">
                  * Pflichtfelder. Das Formular öffnet Ihr E-Mail-Programm mit vorausgefüllten Daten.
                </p>
              </form>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
