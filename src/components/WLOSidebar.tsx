import React from 'react';
import { BookOpen, ExternalLink, RefreshCw } from 'lucide-react';
import { WLOMetadata } from '../lib/types';
import { WLOResourceCard } from './WLOResourceCard';

interface WLOSidebarProps {
  suggestions: WLOMetadata[];
  isLoading: boolean;
  onRefresh?: () => void;
  className?: string;
}

export function WLOSidebar({ suggestions, isLoading, onRefresh, className = '' }: WLOSidebarProps) {
  if (!suggestions.length && !isLoading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">
            Stellen Sie eine Lernfrage, um passende WLO-Materialien zu erhalten.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-secondary-600" />
            WLO-Empfehlungen
          </h2>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="Empfehlungen aktualisieren"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
        {suggestions.length > 0 && (
          <p className="text-xs text-gray-500 mt-1">
            {suggestions.length} Materialien gefunden
          </p>
        )}
      </div>

      <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <WLOResourceCard 
                key={`${suggestion.refId}-${index}`} 
                resource={suggestion} 
                compact 
              />
            ))}
          </div>
        )}
      </div>

      {suggestions.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <a
            href="https://wirlernenonline.de"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            Powered by WirLernenOnline.de
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
}
