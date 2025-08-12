import React from 'react';
import { ExternalLink, BookOpen, Video, FileText, Image, Headphones } from 'lucide-react';
import { WLOMetadata } from '../lib/types';

interface WLOResourceCardProps {
  resource: WLOMetadata;
  compact?: boolean;
}

export function WLOResourceCard({ resource, compact = false }: WLOResourceCardProps) {
  const getResourceIcon = (resourceType: string) => {
    const type = resourceType.toLowerCase();
    if (type.includes('video')) return <Video className="w-4 h-4" />;
    if (type.includes('audio')) return <Headphones className="w-4 h-4" />;
    if (type.includes('bild') || type.includes('image')) return <Image className="w-4 h-4" />;
    if (type.includes('arbeitsblatt') || type.includes('worksheet')) return <FileText className="w-4 h-4" />;
    return <BookOpen className="w-4 h-4" />;
  };

  if (compact) {
    return (
      <div className="wlo-suggestion">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            {getResourceIcon(resource.resourceType || '')}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm text-gray-900 mb-1">
              {resource.wwwUrl ? (
                <a 
                  href={resource.wwwUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 hover:underline flex items-center gap-1"
                >
                  {resource.title}
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                resource.title
              )}
            </h4>
            
            {resource.description && (
              <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                {resource.description}
              </p>
            )}
            
            <div className="flex flex-wrap gap-1">
              {resource.subject && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  {resource.subject}
                </span>
              )}
              {resource.resourceType && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800">
                  {resource.resourceType}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden">
      {resource.previewUrl && (
        <div className="h-32 bg-gray-100 relative">
          <img
            src={resource.previewUrl}
            alt={resource.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-700">
              {getResourceIcon(resource.resourceType || '')}
              <span className="ml-1">{resource.resourceType}</span>
            </span>
          </div>
        </div>
      )}
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {resource.wwwUrl ? (
            <a 
              href={resource.wwwUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 hover:underline flex items-center gap-1"
            >
              {resource.title}
              <ExternalLink className="w-4 h-4 flex-shrink-0" />
            </a>
          ) : (
            resource.title
          )}
        </h3>
        
        {resource.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-3">
            {resource.description}
          </p>
        )}
        
        <div className="flex flex-wrap gap-2">
          {resource.subject && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              {resource.subject}
            </span>
          )}
          {resource.educationalContext?.map((context, idx) => (
            <span 
              key={idx}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800"
            >
              {context}
            </span>
          ))}
          {!resource.previewUrl && resource.resourceType && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              {getResourceIcon(resource.resourceType)}
              <span className="ml-1">{resource.resourceType}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
