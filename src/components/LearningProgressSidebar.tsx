import React from 'react';
import { Clock, Trophy, AlertCircle, BookOpen } from 'lucide-react';
import { LearningProgress, LearningTopic } from '../lib/types';

interface LearningProgressSidebarProps {
  learningProgress: LearningProgress;
  onTopicSelect?: (topicId: string) => void;
  onSelfAssessment?: (topicId: string, subtopicId: string, rating: number) => void;
}

export function LearningProgressSidebar({ 
  learningProgress, 
  onTopicSelect, 
  onSelfAssessment 
}: LearningProgressSidebarProps) {
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  const getCurrentTopicTime = () => {
    const currentTopic = learningProgress.topics.find(t => t.id === learningProgress.currentTopic);
    if (!currentTopic?.startTime) return 0;
    return Math.floor((Date.now() - currentTopic.startTime) / 60000);
  };

  const ProgressBar = ({ progress, size = 'normal' }: { progress: number; size?: 'small' | 'normal' }) => {
    const barCount = 5;
    const filledBars = Math.max(0, Math.min(barCount, progress));
    
    return (
      <div className={`flex gap-1 ${size === 'small' ? 'gap-0.5' : 'gap-1'}`}>
        {Array.from({ length: barCount }, (_, i) => (
          <div
            key={i}
            className={`
              ${size === 'small' ? 'w-2 h-2' : 'w-3 h-3'} 
              rounded-sm transition-colors
              ${i < filledBars 
                ? 'bg-green-500' 
                : 'bg-gray-200'
              }
            `}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto h-full">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Lernfortschritt</h2>
        </div>

        {/* Aktuelle Session Zeit */}
        <div className="bg-white rounded-lg p-3 border">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">Aktuelle Session</span>
          </div>
          <div className="text-lg font-semibold text-blue-600">
            {formatTime(Math.floor((Date.now() - learningProgress.sessionStartTime) / 60000))}
          </div>
          {learningProgress.currentTopic && (
            <div className="text-xs text-gray-500 mt-1">
              Aktuelles Thema: {getCurrentTopicTime()} min
            </div>
          )}
        </div>

        {/* Themen und Fortschritt */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Themen & Teilthemen</h3>
          <div className="space-y-3">
            {learningProgress.topics.map((topic) => (
              <div
                key={topic.id}
                className={`
                  bg-white rounded-lg p-3 border transition-all cursor-pointer
                  ${learningProgress.currentTopic === topic.id 
                    ? 'border-blue-300 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
                onClick={() => onTopicSelect?.(topic.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 text-sm">{topic.name}</h4>
                  <div className="flex items-center gap-2">
                    <ProgressBar progress={topic.progress} size="small" />
                    <span className="text-xs text-gray-500">{formatTime(topic.timeSpent)}</span>
                  </div>
                </div>
                
                {/* Teilthemen */}
                {topic.subtopics.length > 0 && (
                  <div className="space-y-2 mt-2 pl-2 border-l-2 border-gray-100">
                    {topic.subtopics.map((subtopic) => (
                      <div key={subtopic.id} className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">{subtopic.name}</span>
                        <div className="flex items-center gap-2">
                          <ProgressBar progress={subtopic.progress} size="small" />
                          {subtopic.selfAssessment && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-gray-400">Self:</span>
                              <ProgressBar progress={subtopic.selfAssessment} size="small" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Erfolge */}
        {learningProgress.successes.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-4 h-4 text-green-600" />
              <h3 className="text-sm font-semibold text-gray-700">Erfolge</h3>
            </div>
            <div className="space-y-2">
              {learningProgress.successes.map((success, index) => (
                <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-2">
                  <p className="text-xs text-green-800">{success}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Herausforderungen */}
        {learningProgress.challenges.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-orange-600" />
              <h3 className="text-sm font-semibold text-gray-700">Herausforderungen</h3>
            </div>
            <div className="space-y-2">
              {learningProgress.challenges.map((challenge, index) => (
                <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-2">
                  <p className="text-xs text-orange-800">{challenge}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
