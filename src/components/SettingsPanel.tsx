
import { Settings, Brain, BookOpen, Bug } from 'lucide-react';
import { ChatSettings } from '../lib/types';

interface SettingsPanelProps {
  settings: ChatSettings;
  onSettingsChange: (settings: ChatSettings) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function SettingsPanel({ settings, onSettingsChange, isOpen, onToggle }: SettingsPanelProps) {
  const handleToggle = (key: keyof ChatSettings) => {
    onSettingsChange({
      ...settings,
      [key]: !settings[key]
    });
  };

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="btn-secondary"
        title="Einstellungen"
      >
        <Settings className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Einstellungen
          </h3>

          <div className="space-y-4">
            {/* KISS-KI Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary-600" />
                <div>
                  <label className="text-sm font-medium text-gray-900">
                    KISS-KI (GWDG)
                  </label>
                  <p className="text-xs text-gray-500">
                    Nutze GWDG API statt OpenAI
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleToggle('useKissKI')}
                className={`toggle-switch ${settings.useKissKI ? 'enabled' : 'disabled'}`}
              >
                <span />
              </button>
            </div>

            {/* WLO Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-secondary-600" />
                <div>
                  <label className="text-sm font-medium text-gray-900">
                    WLO-Vorschläge
                  </label>
                  <p className="text-xs text-gray-500">
                    Zeige Lernmaterial-Empfehlungen
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleToggle('enableWLO')}
                className={`toggle-switch ${settings.enableWLO ? 'enabled' : 'disabled'}`}
              >
                <span />
              </button>
            </div>

            {/* Debug Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bug className="w-4 h-4 text-orange-600" />
                <div>
                  <label className="text-sm font-medium text-gray-900">
                    Debug-Modus
                  </label>
                  <p className="text-xs text-gray-500">
                    Zeige technische Details
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleToggle('debugMode')}
                className={`toggle-switch ${settings.debugMode ? 'enabled' : 'disabled'}`}
              >
                <span />
              </button>
            </div>
          </div>

          {/* Current Model Info */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              <div className="flex items-center justify-between">
                <span>Aktuelles Modell:</span>
                <span className="font-mono">
                  {settings.useKissKI ? 'gpt-oss-120b' : 'gpt-4.1-mini'}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span>API:</span>
                <span className="font-mono">
                  {settings.useKissKI ? 'GWDG' : 'OpenAI'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
