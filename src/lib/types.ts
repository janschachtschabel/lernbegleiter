export interface WLOMetadata {
  title: string;
  collectionId?: string;
  refId?: string;
  parentPath?: string;
  parentId?: string;
  hierarchyLevel?: number;
  keywords: string[];
  description: string;
  subject: string;
  educationalContext: string[];
  wwwUrl: string | null;
  url?: string;
  previewUrl: string | null;
  resourceType?: string;
}

export interface WLOSearchParams {
  properties: string[];
  values: string[];
  maxItems?: number;
  skipCount?: number;
  propertyFilter?: string;
  combineMode?: 'OR' | 'AND';
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
  wloSuggestions?: WLOMetadata[];
}

export interface ChatSettings {
  useKissKI: boolean;
  enableWLO: boolean;
  debugMode: boolean;
}

export interface LearningMetadata {
  topic: string;
  subject: string | null;
  content_type: string | null;
}

// Lernfortschritt-System Typen
export interface LearningTopic {
  id: string;
  name: string;
  progress: number; // 1-5
  timeSpent: number; // in Minuten
  subtopics: LearningSubtopic[];
  startTime?: number;
}

export interface LearningSubtopic {
  id: string;
  name: string;
  progress: number; // 1-5
  selfAssessment?: number; // 1-5, vom Lernenden
}

export interface KeyTerm {
  term: string;
  definition?: string;
  wikipediaUrl: string;
}

export interface LearningProgress {
  currentTopic?: string;
  topics: LearningTopic[];
  successes: string[];
  challenges: string[];
  keyTerms: KeyTerm[];
  sessionStartTime: number;
}

export interface StructuredBotResponse {
  // Normale Chat-Antwort
  message: string;
  wloSuggestions?: WLOMetadata[];
  
  // Strukturierte Daten für Sidebar
  learningData?: {
    currentTopic?: string;
    topicProgress?: {
      topic: string;
      subtopic?: string;
      progressUpdate?: number; // 1-5
      selfAssessmentUpdate?: number; // 1-5
    };
    newKeyTerms?: KeyTerm[];
    newSuccesses?: string[];
    newChallenges?: string[];
    topicChanged?: boolean;
  };
  
  debugInfo?: {
    model: string;
    metadata: LearningMetadata;
    wloCount: number;
    wloSamples?: Array<{
      title: string;
      wwwUrl?: string | undefined;
      url?: string | undefined;
      refId: string;
      finalUrl: string | null;
    }>;
    error?: string;
  };
}

export interface ChatResponse {
  message: string;
  wloSuggestions?: WLOMetadata[];
  debugInfo?: {
    model: string;
    metadata: LearningMetadata;
    wloCount: number;
    wloSamples?: Array<{
      title: string;
      wwwUrl?: string | undefined;
      url?: string | undefined;
      refId: string;
      finalUrl: string | null;
    }>;
    error?: string;
  };
}
