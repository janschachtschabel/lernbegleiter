import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, GraduationCap } from 'lucide-react';
import { ChatMessage } from './components/ChatMessage';
import { SettingsPanel } from './components/SettingsPanel';
import { WLOSidebar } from './components/WLOSidebar';
import { DebugPanel } from './components/DebugPanel';
import { LearningProgressSidebar } from './components/LearningProgressSidebar';
import { KeyTermsPanel } from './components/KeyTermsPanel';
import { processChatMessage } from './lib/chatUtils';
import { ChatMessage as ChatMessageType, ChatSettings, WLOMetadata, LearningProgress, KeyTerm } from './lib/types';

function App() {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      role: 'assistant',
      content: 'Hallo! Ich bin Ihr interaktiver Lernbegleiter. Stellen Sie mir eine Lernfrage und ich helfe Ihnen dabei, das Thema durch gezielte Fragen und Hinweise zu verstehen. Womit kann ich Ihnen heute helfen?',
      timestamp: Date.now()
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<ChatSettings>({
    useKissKI: false,
    enableWLO: true,
    debugMode: false
  });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [wloSuggestions, setWloSuggestions] = useState<WLOMetadata[]>([]);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  
  // Lernfortschritt-System State
  const [learningProgress, setLearningProgress] = useState<LearningProgress>({
    topics: [],
    successes: [],
    challenges: [],
    keyTerms: [],
    sessionStartTime: Date.now()
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Intelligente LLM-basierte Lerninhalt-Analyse mit Ist-Stand-Übertragung
  const analyzeLearningContentAsync = async (botMessage: string, userMessage: string) => {
    console.log('🔍 Starte intelligente LLM-Analyse...');
    console.log('User:', userMessage);
    console.log('Bot:', botMessage.substring(0, 100) + '...');
    
    try {
      // Aktueller Ist-Stand für Kontext
      const currentState = {
        currentTopic: learningProgress.currentTopic,
        topics: learningProgress.topics.map(t => ({ 
          id: t.id, 
          name: t.name, 
          progress: t.progress,
          subtopics: t.subtopics.map(st => ({ id: st.id, name: st.name, progress: st.progress }))
        })),
        keyTerms: learningProgress.keyTerms.map(kt => kt.term),
        successes: learningProgress.successes,
        challenges: learningProgress.challenges
      };

      console.log('📊 Aktueller Ist-Stand:', currentState);

      // LLM-Analyse-Prompt mit Ist-Stand
      const analysisPrompt = `Du bist ein intelligenter Lernfortschritt-Analyzer. Analysiere die folgende Unterhaltung und aktualisiere den Lernstand.

AKTUELLER IST-STAND:
${JSON.stringify(currentState, null, 2)}

NEUE UNTERHALTUNG:
LERNENDER: "${userMessage}"
TUTOR: "${botMessage}"

Analysiere und antworte NUR mit einem JSON-Objekt in diesem Format:
{
  "topicChange": {
    "newMainTopic": "Name des Hauptthemas oder null",
    "isMainTopicChange": true/false,
    "subtopics": [{"id": "id", "name": "Name", "progress": 1-5}]
  },
  "keyTerms": [
    {
      "term": "Fachbegriff",
      "definition": "Kurze Definition",
      "wikipediaUrl": "https://de.wikipedia.org/wiki/Begriff"
    }
  ],
  "progressUpdate": {
    "currentTopicProgress": 1-5,
    "newSuccesses": ["Erfolg 1", "Erfolg 2"],
    "newChallenges": ["Herausforderung 1"]
  }
}

WICHTIGE REGELN:
1. Bei Hauptthemenwechsel: keyTerms zurücksetzen und neu aufbauen
2. Bei Unterthemen: keyTerms erweitern, nicht zurücksetzen
3. Nur wirklich wichtige Fachbegriffe als keyTerms (max 3-5)
4. Erfolge: Übungsabschlüsse, Verständnisfortschritte, korrekte Antworten
5. Herausforderungen: Schwierigkeiten, Verständnisprobleme
6. Fortschritt: 1=Anfänger, 2=Grundlagen, 3=Verstanden, 4=Angewandt, 5=Beherrscht`;

      // Direkte OpenAI API für bessere Kontrolle
      const openaiKey = (import.meta as any).env.VITE_OPENAI_API_KEY;
      if (!openaiKey) {
        console.log('⚠️ Kein OpenAI API Key für Analyse');
        return;
      }

      const response = await fetch('/api/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: analysisPrompt }],
          max_tokens: 800,
          temperature: 0.2
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const analysisResult = JSON.parse(data.choices[0].message.content);
      
      console.log('📈 LLM-Analyse-Ergebnis:', analysisResult);

      // State basierend auf LLM-Analyse aktualisieren
      setLearningProgress(prev => {
        const newProgress = { ...prev };
        
        // Themenwechsel verarbeiten
        if (analysisResult.topicChange?.newMainTopic) {
          const topicId = analysisResult.topicChange.newMainTopic.toLowerCase().replace(/\s+/g, '-');
          let existingTopic = newProgress.topics.find(t => t.id === topicId);
          
          if (!existingTopic) {
            existingTopic = {
              id: topicId,
              name: analysisResult.topicChange.newMainTopic,
              progress: 1,
              timeSpent: 0,
              startTime: Date.now(),
              subtopics: analysisResult.topicChange.subtopics || []
            };
            newProgress.topics.push(existingTopic);
            console.log('➕ Neues Hauptthema:', analysisResult.topicChange.newMainTopic);
          }
          
          // Bei Hauptthemenwechsel: Schlüsselbegriffe zurücksetzen
          if (analysisResult.topicChange.isMainTopicChange && newProgress.currentTopic !== topicId) {
            newProgress.keyTerms = [];
            console.log('🔄 Hauptthemenwechsel - Schlüsselbegriffe zurückgesetzt');
          }
          
          newProgress.currentTopic = topicId;
          existingTopic.startTime = Date.now();
        }

        // Schlüsselbegriffe aktualisieren (nur LLM-ausgewählte)
        if (analysisResult.keyTerms && analysisResult.keyTerms.length > 0) {
          analysisResult.keyTerms.forEach((newTerm: any) => {
            if (!newProgress.keyTerms.some(existing => existing.term === newTerm.term)) {
              newProgress.keyTerms.push({
                term: newTerm.term,
                definition: newTerm.definition,
                wikipediaUrl: newTerm.wikipediaUrl
              });
              console.log('🔑 LLM-ausgewählter Schlüsselbegriff:', newTerm.term);
            }
          });
        }

        // Fortschritt aktualisieren
        if (analysisResult.progressUpdate) {
          const currentTopic = newProgress.topics.find(t => t.id === newProgress.currentTopic);
          if (currentTopic && analysisResult.progressUpdate.currentTopicProgress) {
            currentTopic.progress = analysisResult.progressUpdate.currentTopicProgress;
            console.log('📈 Fortschritt aktualisiert:', currentTopic.progress);
          }

          // Neue Erfolge hinzufügen
          if (analysisResult.progressUpdate.newSuccesses) {
            analysisResult.progressUpdate.newSuccesses.forEach((success: string) => {
              if (!newProgress.successes.includes(success)) {
                newProgress.successes.push(success);
                console.log('🏆 Neuer Erfolg:', success);
              }
            });
          }

          // Neue Herausforderungen hinzufügen
          if (analysisResult.progressUpdate.newChallenges) {
            analysisResult.progressUpdate.newChallenges.forEach((challenge: string) => {
              if (!newProgress.challenges.includes(challenge)) {
                newProgress.challenges.push(challenge);
                console.log('⚠️ Neue Herausforderung:', challenge);
              }
            });
          }
        }

        console.log('✅ Intelligente Analyse abgeschlossen:', {
          topics: newProgress.topics.length,
          keyTerms: newProgress.keyTerms.length,
          successes: newProgress.successes.length,
          challenges: newProgress.challenges.length
        });

        return newProgress;
      });

    } catch (error) {
      console.error('❌ Fehler bei der intelligenten LLM-Analyse:', error);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Zeit-Tracking für aktuelles Thema
  useEffect(() => {
    const interval = setInterval(() => {
      setLearningProgress(prev => {
        if (!prev.currentTopic) return prev;
        
        const newProgress = { ...prev };
        const currentTopic = newProgress.topics.find(t => t.id === prev.currentTopic);
        
        if (currentTopic && currentTopic.startTime) {
          const timeSpent = Math.floor((Date.now() - currentTopic.startTime) / 60000);
          currentTopic.timeSpent = timeSpent;
        }
        
        return newProgress;
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [learningProgress.currentTopic]);

  useEffect(() => {
    // Close settings panel when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsOpen && !(event.target as Element).closest('.settings-panel')) {
        setSettingsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [settingsOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    // Add user message immediately
    const newUserMessage: ChatMessageType = {
      role: 'user',
      content: userMessage,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, newUserMessage]);

    try {
      // Process the message and get response
      const response = await processChatMessage(messages, userMessage, settings);
      
      // Add assistant response
      const assistantMessage: ChatMessageType = {
        role: 'assistant',
        content: response.message,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Asynchrone Lerninhalt-Analyse starten (läuft parallel im Hintergrund)
      setTimeout(() => {
        analyzeLearningContentAsync(response.message, userMessage);
      }, 100); // Kurze Verzögerung, damit Chat-UI zuerst aktualisiert wird
      
      // Update WLO suggestions if available
      if (response.wloSuggestions) {
        console.log('Setting WLO suggestions:', response.wloSuggestions.length, response.wloSuggestions);
        setWloSuggestions(response.wloSuggestions);
      } else {
        console.log('No WLO suggestions in response:', response);
      }
      
      // Update debug info if available
      if (response.debugInfo) {
        setDebugInfo(response.debugInfo);
      }
      
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessageType = {
        role: 'assistant',
        content: 'Entschuldigung, es gab einen Fehler bei der Verarbeitung Ihrer Nachricht. Bitte versuchen Sie es erneut.',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Linke Sidebar - Lernfortschritt */}
      <LearningProgressSidebar 
        learningProgress={learningProgress}
        onTopicSelect={(topicId) => {
          // TODO: Implementiere Topic-Wechsel
          console.log('Topic selected:', topicId);
        }}
      />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Interaktiver Lernbegleiter</h1>
                <p className="text-sm text-gray-600">Tutor mit intelligenten Inhalts-Empfehlungen</p>
              </div>
            </div>
            
            <div className="settings-panel">
              <SettingsPanel
                settings={settings}
                onSettingsChange={setSettings}
                isOpen={settingsOpen}
                onToggle={() => setSettingsOpen(!settingsOpen)}
              />
            </div>
          </div>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          
          {isLoading && (
            <ChatMessage
              message={{
                role: 'assistant',
                content: '',
                timestamp: Date.now()
              }}
              isTyping={true}
            />
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Debug Panel */}
        {settings.debugMode && debugInfo && (
          <div className="p-4">
            <DebugPanel debugInfo={debugInfo} />
          </div>
        )}

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Stellen Sie eine Lernfrage..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={1}
                style={{
                  minHeight: '52px',
                  maxHeight: '120px',
                  height: 'auto'
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                }}
                disabled={isLoading}
              />
            </div>
            
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>
          
          <p className="text-xs text-gray-500 mt-2 text-center">
            Drücken Sie Enter zum Senden, Shift+Enter für neue Zeile
          </p>
        </div>
      </div>

      {/* Rechte Sidebar - WLO & Schlüsselbegriffe */}
      <div className="w-80 bg-gray-50 border-l border-gray-200 p-4 space-y-4 overflow-y-auto">
        {/* WLO Materialien */}
        {settings.enableWLO && (
          <WLOSidebar
            suggestions={wloSuggestions}
            isLoading={isLoading && settings.enableWLO}
          />
        )}
        
        {/* Schlüsselbegriffe */}
        <KeyTermsPanel 
          keyTerms={learningProgress.keyTerms}
        />
      </div>
    </div>
  );
}

export default App;
