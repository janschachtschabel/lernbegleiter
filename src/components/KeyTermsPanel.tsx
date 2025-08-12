import React from 'react';
import { ExternalLink, Book } from 'lucide-react';
import { KeyTerm } from '../lib/types';

interface KeyTermsPanelProps {
  keyTerms: KeyTerm[];
  className?: string;
}

export function KeyTermsPanel({ keyTerms, className = '' }: KeyTermsPanelProps) {
  if (keyTerms.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Book className="w-4 h-4 text-purple-600" />
        <h3 className="text-sm font-semibold text-gray-700">Schlüsselbegriffe</h3>
      </div>
      
      <div className="space-y-3">
        {keyTerms.map((term, index) => (
          <div key={index} className="group">
            <a
              href={term.wikipediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-purple-50 transition-colors"
            >
              <div className="flex-1">
                <div className="font-medium text-purple-900 text-sm group-hover:text-purple-700">
                  {term.term}
                </div>
                {term.definition && (
                  <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {term.definition}
                  </div>
                )}
              </div>
              <ExternalLink className="w-3 h-3 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <ExternalLink className="w-3 h-3" />
          Links öffnen Wikipedia in neuem Tab
        </p>
      </div>
    </div>
  );
}
