import axios from 'axios';
import { ChatMessage, ChatSettings, LearningMetadata, ChatResponse } from './types';
import { FACH_MAPPING, INHALTSTYP_MAPPING } from './mappings';

const SOCRATIC_SYSTEM_PROMPT = `Du bist ein intelligenter, empathischer Lernbegleiter, der nach den Empfehlungen erfahrener Didaktiker:innen und Lehrkräfte gestaltet wurde. Dein Ziel ist es, Lernende dabei zu unterstützen, Wissen nachhaltig, verstehend und anwendungsorientiert aufzubauen. Du kombinierst aktuelle lernpsychologische Erkenntnisse (z. B. konstruktivistisches Lernen, selbstreguliertes Lernen, Retrieval Practice) mit bewährten didaktischen Methoden. Du bekommst thematisch passendes Lernmaterial von WirLernenOnline.de übergeben und nutzt dieses gezielt zur Unterstützung, Erklärung und Vertiefung der Lerninhalte.

**Dein lernendenzentriertes Vorgehen:** Du passt Inhalte an Vorkenntnisse, Ziele und Lernstil an, förderst aktives Lernen, nutzt einen sokratischen Dialog, knüpfst an Vorwissen an, vermittelst Inhalte mehrkanalig, reagierst konstruktiv auf Fehler, passt Schwierigkeit und Tiefe adaptiv an, förderst Metakognition, stärkst Motivation und wählst Methoden passend zu Ziel, Phase und Lerntyp.

**Interaktionsablauf:**
1. Begrüße freundlich, frage nach Ziel, Vorwissen und verfügbarem Zeitrahmen
2. Aktiviere vorhandenes Wissen durch eine kurze Frage oder ein Beispiel
3. Erkläre den neuen Inhalt klar, strukturiert und in kleinen Einheiten, nutze Analogien, Beispiele und ggf. humorvolle Elemente, binde das übergebene WLO-Material aktiv ein
4. Fordere den Lernenden auf, das Gelernte anzuwenden (z. B. Aufgabe, Beispiel, Reflexion)
5. Gib konstruktives Feedback, vertiefe den Inhalt oder erweitere ihn um Transferaufgaben
6. Fasse das Wichtigste zusammen, biete Ausblick oder Vertiefungsmöglichkeiten

**Kommunikationsstil:** Klar, präzise, freundlich und motivierend. Du vermeidest unnötigen Fachjargon und erklärst komplexe Begriffe verständlich. Du stellst gezielte Rückfragen, variierst Fragetypen (offen, geschlossen, reflektiv) und nutzt Storytelling, wenn es den Inhalt unterstützt.

**Methodische Elemente:** Du setzt gezielt methodische Elemente ein, z. B. sokratische Fragen („Warum? Wie weißt du das? Was wäre, wenn…?"), Beispiele und Gegenbeispiele, Vergleiche und Analogien, kurze Wiederholungsfragen (Retrieval Practice), Mini-Projekte oder Szenarien, Selbsterklärungsaufgaben und Visualisierungsideen wie Mindmaps.

**MATHEMATISCHE DARSTELLUNG:** 
Verwende einfache Textdarstellung für mathematische Ausdrücke.

**KORREKTE DARSTELLUNG:**
- Brüche als Schrägstrich: "3/8" oder "4/9"
- Brüche in Worten: "drei Achtel" oder "vier Neuntel"
- Potenzen: "x²" oder "x hoch 2" oder "x^2"
- Wurzeln: "√16" oder "Wurzel aus 16"
- Komplexere Ausdrücke: Verwende Klammern und Schrägstriche wie "(a + b)/c"

**BEISPIELE:**
✅ 3/8 + 4/8 = 7/8
✅ drei Achtel plus vier Achtel ergibt sieben Achtel
✅ (3/9) + (4/9) = 7/9
✅ Addiere 3/9 + 4/9 = 7/9
✅ x² + 2x + 1 = (x+1)²
✅ √16 = 4

**MARKDOWN-FORMATIERUNG (ZWINGEND ERFORDERLICH):**
- Verwende IMMER Markdown-Syntax für bessere Lesbarkeit
- **Fettdruck** für wichtige Begriffe und Konzepte
- *Kursiv* für Betonungen
- Code-Formatierung mit Backticks für Formeln oder technische Begriffe
- > Blockzitate für wichtige Definitionen
- - Aufzählungen für Listen
- ## Überschriften für Themenbereiche

**WLO-Integration (ABSOLUT PFLICHT, wenn Material vorhanden):**
- Du MUSST die bereitgestellten WLO-Materialien aktiv in deine Antwort einbauen
- Erwähne KONKRET den Inhalt und Nutzen jedes Materials
- Verlinke mit Titel: <a href="MATERIAL_URL" target="_blank">**MATERIAL_TITEL**</a>
- Erkläre, WIE das Material beim Lernen hilft
- Nutze AUSSCHLIESSLICH übergebenes Material; keine Eigenerfindungen
- Mindestens 1-2 Materialien pro Antwort verwenden, wenn verfügbar

**ABSOLUT KRITISCH - ANTWORTLÄNGE:** Halte deine Antworten kurz und fokussiert und arbeite Schritt für Schritt mit dem Lernenden im Dialog, um diesen nicht zu überfordern. Konzentriere dich auf EINEN Kernpunkt pro Antwort und stelle nur eine konkrete Frage.
Kombiniere NIEMALS zu viele Gesprächsziele wie z.B. Zielabstimmung, Abfrage des Vorwissen, Aktivierung des Vorwissens, Ausbildung auf die Vorgehensweise, Übungsbeispiele usw. in einer Antwort - arbeite kleinteiliger und dialogorientierter.
Nutze max. 2 verschiedene Aspekte in einer Antwort - besser nur einen. Bei nummerierten Listen: Verwende das Format "1. Punkt", "2. Punkt" OHNE Zeilenumbrüche nach den Zahlen.

**BEISPIEL FÜR GUTE ANTWORT MIT WLO-MATERIAL:**
"Das ist eine spannende Frage zu **Photosynthese**! 

> Die Photosynthese ist der Prozess, bei dem Pflanzen Lichtenergie in chemische Energie umwandeln.

Schauen Sie sich dazu dieses Video an: <a href="https://example.com" target="_blank">**Photosynthese einfach erklärt**</a> - es zeigt den Prozess sehr anschaulich mit Animationen.

Was wissen Sie bereits über die *Rolle des Chlorophylls* bei diesem Prozess?"`;


export async function extractLearningMetadata(userText: string, settings: ChatSettings): Promise<LearningMetadata> {
  // Check if API keys are available from .env or system environment
  const openaiKey = (import.meta as any).env?.VITE_OPENAI_API_KEY || 
                    (typeof process !== 'undefined' && process.env?.OPENAI_API_KEY);
  const gwdgKey = (import.meta as any).env?.VITE_GWDG_API_KEY || 
                  (typeof process !== 'undefined' && process.env?.GWDG_API_KEY);
  
  if (!openaiKey && !gwdgKey) {
    throw new Error('Keine API-Schlüssel verfügbar. Bitte konfigurieren Sie OPENAI_API_KEY oder GWDG_API_KEY.');
  }

  const availableSubjects = Object.keys(FACH_MAPPING);
  const availableTypes = Object.keys(INHALTSTYP_MAPPING);
  
  const userPrompt = `Analysiere diese Lernfrage: '${userText}'

Extrahiere:
- topic: Hauptthema/Konzept als Suchbegriff (z.B. 'Photosynthese', 'Quadratische Gleichungen')
- subject: Schulfach aus dieser Liste: ${availableSubjects.slice(0, 10).join(', ')}... (oder null wenn nicht erkennbar)
- content_type: Materialtyp aus dieser Liste: ${availableTypes.slice(0, 8).join(', ')}... (oder null wenn nicht erkennbar)

Wichtig: Verwende EXAKT die Begriffe aus den Listen oder null.
JSON-Format: {"topic": "...", "subject": "...", "content_type": "..."}`;

  try {
    const apiEndpoint = settings.useKissKI ? '/api/gwdg/v1/chat/completions' : '/api/openai/v1/chat/completions';
    const model = settings.useKissKI ? 'gpt-oss-120b' : 'gpt-4.1-mini';
    const apiKey = settings.useKissKI ? gwdgKey : openaiKey;

    if (!apiKey) {
      throw new Error(`Kein ${settings.useKissKI ? 'GWDG' : 'OpenAI'} API-Schlüssel verfügbar.`);
    }

    const response = await axios.post(apiEndpoint, {
      model,
      messages: [
        { role: 'system', content: 'Du extrahierst Lernmetadaten aus Nutzerfragen. Antworte als JSON mit: topic (Hauptthema), subject (Schulfach), content_type (Materialart).' },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });

    return JSON.parse(response.data.choices[0].message.content);
  } catch (error) {
    console.error('Metadata extraction failed:', error);
    throw new Error('Fehler bei der Metadaten-Extraktion: ' + (error instanceof Error ? error.message : 'Unbekannter Fehler'));
  }
}



export async function generateChatResponse(
  messages: ChatMessage[], 
  wloSuggestions: any[] = [],
  settings: ChatSettings
): Promise<ChatResponse> {
  // Check if API keys are available from .env or system environment
  const openaiKey = (import.meta as any).env?.VITE_OPENAI_API_KEY || 
                    (typeof process !== 'undefined' && process.env?.OPENAI_API_KEY);
  const gwdgKey = (import.meta as any).env?.VITE_GWDG_API_KEY || 
                  (typeof process !== 'undefined' && process.env?.GWDG_API_KEY);
  
  if (!openaiKey && !gwdgKey) {
    throw new Error('Keine API-Schlüssel verfügbar. Bitte konfigurieren Sie OPENAI_API_KEY oder GWDG_API_KEY.');
  }

  try {
    let systemPrompt = SOCRATIC_SYSTEM_PROMPT;
    
    // Add WLO context if suggestions are available
    if (wloSuggestions.length > 0) {
      systemPrompt += `\n\n**VERFÜGBARE WLO-LERNMATERIALIEN:**\n`;
      systemPrompt += `Du hast Zugang zu ${wloSuggestions.length} thematisch passenden Lernmaterialien von WirLernenOnline.de. Nutze diese gezielt zur Unterstützung, Erklärung und Vertiefung der Lerninhalte.\n\n`;
      
      wloSuggestions.forEach((s, i) => {
        const url = s.wwwUrl || s.url || (s.refId ? `https://redaktion.openeduhub.net/edu-sharing/components/render/${s.refId}` : '');
        systemPrompt += `**Material ${i + 1}:**\n`;
        systemPrompt += `- Titel: ${s.title || 'Unbekannt'}\n`;
        systemPrompt += `- URL: ${url}\n`;
        systemPrompt += `- Fach: ${s.subject || 'Allgemein'}\n`;
        systemPrompt += `- Typ: ${s.resourceType || 'Lernressource'}\n`;
        systemPrompt += `- Beschreibung: ${s.description || 'Keine Beschreibung verfügbar'}\n\n`;
      });
      
    }

    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(msg => ({ role: msg.role, content: msg.content }))
    ];

    const apiEndpoint = settings.useKissKI ? '/api/gwdg/v1/chat/completions' : '/api/openai/v1/chat/completions';
    const model = settings.useKissKI ? 'gpt-oss-120b' : 'gpt-4.1-mini';
    const apiKey = settings.useKissKI ? gwdgKey : openaiKey;

    if (!apiKey) {
      throw new Error(`Kein ${settings.useKissKI ? 'GWDG' : 'OpenAI'} API-Schlüssel verfügbar.`);
    }

    const response = await axios.post(apiEndpoint, {
      model,
      messages: apiMessages,
      temperature: 0.7,
      max_tokens: 1000
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });

    const assistantMessage = response.data.choices[0].message.content;

    return {
      message: assistantMessage,
      wloSuggestions: wloSuggestions.slice(0, 10),
      debugInfo: settings.debugMode ? {
        model: model,
        metadata: { topic: '', subject: null, content_type: null },
        wloCount: wloSuggestions.length
      } : undefined
    };

  } catch (error) {
    console.error('Chat response generation failed:', error);
    throw new Error('Fehler bei der Chat-Antwort-Generierung: ' + (error instanceof Error ? error.message : 'Unbekannter Fehler'));
  }
}

// Asynchrone Analyse-Funktionen für Lernfortschritt

export async function analyzeTopics(botMessage: string, userMessage: string, settings: any, currentState?: any) {
  const prompt = `Analysiere diese Lernunterhaltung und extrahiere die Hauptthemen und Teilthemen.

AKTUELLER STAND:
${currentState ? `Existierende Themen: ${JSON.stringify(currentState.existingTopics, null, 2)}` : 'Keine existierenden Themen'}

NEUE UNTERHALTUNG:
BENUTZER-FRAGE: "${userMessage}"
BOT-ANTWORT: "${botMessage}"

Antworte NUR mit einem JSON-Objekt in diesem Format:
{
  "topics": [
    {
      "name": "Hauptthema (z.B. Bruchrechnung, Photosynthese, Eiszeit)",
      "subtopics": [
        {"id": "subtopic-id", "name": "Teilthema", "progress": 1}
      ]
    }
  ]
}

WICHTIG:
- Erkenne spezifische Lernthemen, nicht nur Fachbereiche
- Beispiele: "Bruchrechnung" statt "Mathematik", "Photosynthese" statt "Biologie"
- Wenn bereits Themen existieren, erweitere sie oder füge neue hinzu
- Nur relevante Themen aus der aktuellen Unterhaltung extrahieren`;

  try {
    // Verwende direkte OpenAI API für Analyse
    const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!openaiKey) {
      console.log('⚠️ Kein OpenAI API Key für Topic-Analyse');
      return { topics: [] };
    }

    const response = await fetch('/api/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
        temperature: 0.3
      })
    });

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);
    console.log('✅ Topic analysis result:', result);
    return result;
  } catch (error) {
    console.error('❌ Topic analysis failed:', error);
    return { topics: [] };
  }
}

export async function analyzeKeyTerms(botMessage: string, userMessage: string, settings: any, currentState?: any) {
  const prompt = `Extrahiere die wichtigsten Fachbegriffe aus dieser Lernunterhaltung.

AKTUELLER STAND:
${currentState ? `Existierende Begriffe: ${currentState.existingKeyTerms.join(', ')}` : 'Keine existierenden Begriffe'}

NEUE UNTERHALTUNG:
BENUTZER-FRAGE: "${userMessage}"
BOT-ANTWORT: "${botMessage}"

Antworte NUR mit einem JSON-Objekt in diesem Format:
{
  "keyTerms": [
    {
      "term": "Fachbegriff",
      "definition": "Kurze Definition des Begriffs",
      "wikipediaUrl": "https://de.wikipedia.org/wiki/Fachbegriff"
    }
  ]
}

Wähle nur die 3-5 wichtigsten Fachbegriffe aus. Ignoriere unwichtige Wörter.
Fokussiere auf Begriffe, die für das Verständnis zentral sind.`;

  try {
    const analysisMessages = [{ role: 'user' as const, content: prompt, timestamp: Date.now() }];
    const response = await generateChatResponse(analysisMessages, prompt, settings);
    return JSON.parse(response.message);
  } catch (error) {
    console.error('Key terms analysis failed:', error);
    return { keyTerms: [] };
  }
}

export async function analyzeProgress(botMessage: string, userMessage: string, settings: any, currentState?: any) {
  const prompt = `Bewerte den Lernfortschritt basierend auf dieser Unterhaltung.

AKTUELLER STAND:
${currentState ? `Erfolge: ${currentState.currentSuccesses.join(', ')}
Herausforderungen: ${currentState.currentChallenges.join(', ')}` : 'Keine bisherigen Erfolge/Herausforderungen'}

NEUE UNTERHALTUNG:
BENUTZER-FRAGE: "${userMessage}"
BOT-ANTWORT: "${botMessage}"

Antworte NUR mit einem JSON-Objekt in diesem Format:
{
  "progress": 3,
  "successes": ["Erfolg 1", "Erfolg 2"],
  "challenges": ["Herausforderung 1", "Herausforderung 2"]
}

- progress: 1-5 (1=Anfänger, 5=Experte)
- successes: Was hat der Lernende gut verstanden?
- challenges: Wo gibt es noch Verbesserungsbedarf?

Bewerte realistisch basierend auf der Qualität der Fragen und dem Verständnis.`;

  try {
    const analysisMessages = [{ role: 'user' as const, content: prompt, timestamp: Date.now() }];
    const response = await generateChatResponse(analysisMessages, prompt, settings);
    return JSON.parse(response.message);
  } catch (error) {
    console.error('Progress analysis failed:', error);
    return { progress: 1, successes: [], challenges: [] };
  }
}


