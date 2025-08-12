import { useState } from 'react';
import { Bug, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

interface DebugPanelProps {
  debugInfo?: any;
  className?: string;
}

export function DebugPanel({ debugInfo, className = '' }: DebugPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!debugInfo) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy debug info:', error);
    }
  };

  return (
    <div className={`bg-gray-900 text-gray-200 rounded-lg border border-gray-700 ${className}`}>
      <div className="p-3 border-b border-gray-700">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left"
        >
          <div className="flex items-center gap-2">
            <Bug className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-medium">Debug-Informationen</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopy();
              }}
              className="p-1 text-gray-400 hover:text-gray-200 transition-colors"
              title="Debug-Info kopieren"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </button>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>
      </div>

      {isExpanded && (
        <div className="p-3">
          <div className="space-y-3 text-xs">
            {/* Model Info */}
            <div>
              <span className="text-orange-400 font-medium">Modell:</span>
              <span className="ml-2 font-mono">{debugInfo.model}</span>
            </div>

            {/* Metadata */}
            {debugInfo.metadata && (
              <div>
                <span className="text-orange-400 font-medium">Extrahierte Metadaten:</span>
                <div className="mt-1 bg-gray-800 rounded p-2 font-mono">
                  <div>Topic: <span className="text-green-400">{debugInfo.metadata.topic || 'N/A'}</span></div>
                  <div>Subject: <span className="text-blue-400">{debugInfo.metadata.subject || 'N/A'}</span></div>
                  <div>Content Type: <span className="text-purple-400">{debugInfo.metadata.content_type || 'N/A'}</span></div>
                </div>
              </div>
            )}

            {/* WLO Count */}
            <div>
              <span className="text-orange-400 font-medium">WLO-Materialien:</span>
              <span className="ml-2">{debugInfo.wloCount || 0} gefunden</span>
            </div>

            {/* Timestamp */}
            <div>
              <span className="text-orange-400 font-medium">Timestamp:</span>
              <span className="ml-2 font-mono">{new Date().toISOString()}</span>
            </div>

            {/* Full JSON */}
            <details className="mt-3">
              <summary className="cursor-pointer text-orange-400 font-medium hover:text-orange-300">
                Vollständige Debug-Daten
              </summary>
              <pre className="mt-2 bg-gray-800 rounded p-2 text-xs overflow-auto max-h-40 scrollbar-thin">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      )}
    </div>
  );
}
