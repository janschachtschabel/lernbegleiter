# WLO Lernbegleiter - Vercel Edition

Ein moderner, sokratischer Lernbegleiter mit intelligenten WLO-Empfehlungen, gebaut mit React, TypeScript und Vite für optimale Performance auf Vercel.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/wlo-socratic-chatbot)

## 📋 Inhaltsverzeichnis

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Sicherheit](#-sicherheit)
- [Architektur](#️-architektur)
- [Konfiguration](#️-konfiguration)
- [Development](#-development)
- [Deployment](#-deployment)
- [API-Endpunkte](#-api-endpunkte)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

## ✨ Features

- **🎓 Sokratische Lernbegleitung**: Intelligente Diagnosefragen und Hinweise statt direkte Antworten
- **📚 WLO-Integration**: Automatische Empfehlungen von deutschen Bildungsmaterialien
- **🧠 Dual-LLM-Support**: Umschaltung zwischen OpenAI (`gpt-4.1-mini`) und KISS-KI (`gpt-oss-120b`)
- **🔍 Debug-Modus**: Transparente Einblicke in Metadaten-Extraktion und API-Aufrufe
- **📱 Responsive Design**: Optimiert für Desktop und Mobile mit Tailwind CSS
- **⚡ Performance**: Vite-basiert für schnelle Entwicklung und Builds
- **🔒 Sicherheit**: Umfassender Schutz für API-Keys und sensible Daten
- **🔐 Passwort-Schutz**: Zugriffsbeschränkung für autorisierte Nutzer
- **⚖️ Rechtssicherheit**: Vollständiges Impressum nach deutschem TMG

## 🚀 Quick Start

### Lokale Entwicklung

1. **Dependencies installieren:**
```bash
cd vercellernchat
npm install
```

2. **Umgebungsvariablen konfigurieren:**
```bash
cp .env.example .env.local
```

Bearbeiten Sie `.env.local` und fügen Sie Ihre API-Keys hinzu:
```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_GWDG_API_KEY=your_gwdg_api_key_here
```

3. **Development Server starten:**
```bash
npm run dev
```

Die App läuft auf `http://localhost:5173`

## 🔐 Authentifizierung

Die Anwendung ist durch ein Passwort-System geschützt:

### **Zugang**
- **Passwort**: `lernbegleiter2025`
- **Session-Dauer**: 24 Stunden (automatische Abmeldung)
- **Speicherung**: Lokaler Browser-Speicher (localStorage)

### **Funktionen**
- **Login-Screen**: Blockiert Zugang bis zur korrekten Eingabe
- **Logout-Button**: Sicheres Abmelden im Header (🚪-Symbol)
- **Session-Persistenz**: Bleibt bei Browser-Refresh erhalten
- **Auto-Logout**: Nach 24h oder bei manueller Abmeldung

## 🔒 Sicherheit

⚠️ **WICHTIG**: Diese Anwendung verwendet sensible API-Keys, die geschützt werden müssen!

### API-Key-Schutz
- **Niemals** `.env.local` Dateien committen - sie enthalten echte API-Keys
- Verwenden Sie `.env.example` als Vorlage für erforderliche Umgebungsvariablen
- API-Keys werden in folgender Reihenfolge gelesen:
  1. `VITE_*` Variablen aus `.env.local` (Development)
  2. System-Umgebungsvariablen (`OPENAI_API_KEY`, `GWDG_API_KEY`)
  3. Vercel Environment Variables (Production)

### Erforderliche API-Keys
```env
# OpenAI API (empfohlen für bessere Performance)
VITE_OPENAI_API_KEY=sk-proj-...

# GWDG/KISS-KI API (deutsche Alternative)
VITE_GWDG_API_KEY=your_gwdg_key_here
```

### Sicherheitsmaßnahmen
- ✅ `.gitignore` schützt sensible Dateien
- ✅ `SECURITY.md` mit Sicherheitsrichtlinien
- ✅ Pull Request Template mit Sicherheitscheckliste
- ✅ Keine API-Keys im Quellcode hardcodiert

## ⚖️ Rechtliche Compliance

### **Impressum (TMG-konform)**
- **Vollständige Anbieterkennzeichnung** nach § 5 TMG
- **Kontaktdaten**: Jan Schachtschabel, Steubenstr. 34, 99423 Weimar
- **E-Mail-Kontakt**: info@schachtschabel.net
- **Zugriff**: "Impressum"-Button im Header der Anwendung

### **Datenschutz**
- **Transparenz**: Hinweise auf Datenverarbeitung durch OpenAI und GWDG
- **Kontaktformular**: Öffnet E-Mail-Client (keine Server-seitige Speicherung)
- **Minimale Datenerhebung**: Nur funktionsnotwendige Verarbeitung

### **Haftungsausschlüsse**
- **Inhalte**: Nach §§ 7-10 TMG
- **Links**: Keine Verantwortung für externe Inhalte
- **Urheberrecht**: Schutz eigener Inhalte nach deutschem Recht

### Vercel Deployment

1. **Repository zu Vercel verbinden**
2. **Environment Variables in Vercel Dashboard setzen:**
   - `VITE_OPENAI_API_KEY`
   - `VITE_GWDG_API_KEY`
3. **Deploy** - Vercel erkennt automatisch die Vite-Konfiguration

## 🛠️ Tech Stack

### Frontend
- **React 18** - Moderne UI-Bibliothek mit Hooks
- **TypeScript** - Typsichere JavaScript-Entwicklung
- **Vite** - Schneller Build-Tool und Dev-Server
- **Tailwind CSS** - Utility-first CSS-Framework
- **Lucide React** - Moderne Icon-Bibliothek

### APIs & Integration
- **OpenAI API** - GPT-4o-mini für intelligente Antworten
- **GWDG KISS-KI** - Deutsche Alternative mit gpt-oss-120b
- **WLO API** - Zugriff auf deutsche Bildungsmaterialien
- **Axios** - HTTP-Client für API-Aufrufe

### Development & Deployment
- **ESLint** - Code-Qualität und Konsistenz
- **Vercel** - Serverless Deployment-Plattform
- **Git** - Versionskontrolle mit GitHub-Integration

## 🏗️ Architektur

### Frontend (React + TypeScript)
```
src/
├── components/          # React-Komponenten
│   ├── ChatMessage.tsx  # Chat-Nachrichten
│   ├── SettingsPanel.tsx # Einstellungen
│   ├── WLOSidebar.tsx   # WLO-Empfehlungen
│   └── DebugPanel.tsx   # Debug-Informationen
├── lib/                 # Utilities und APIs
│   ├── types.ts         # TypeScript-Definitionen
│   ├── mappings.ts      # WLO-Fach/Typ-Mappings
│   ├── wloApi.ts        # WLO-API-Integration
│   ├── llmApi.ts        # LLM-API-Aufrufe
│   └── chatUtils.ts     # Chat-Logik
└── App.tsx              # Haupt-App-Komponente
```

### API-Proxying
- **Development**: Vite Proxy für CORS-freie API-Aufrufe
- **Production**: Vercel Rewrites für nahtlose API-Integration

### WLO-Integration
- **Intelligente Suche**: Metadaten-Extraktion aus Benutzereingaben
- **Präzise Filter**: Fach-, Bildungsstufe- und Inhaltstyp-Mappings
- **10→5 Auswahl**: System holt 10 Materialien, KI wählt 5 beste aus

## 🎛️ Konfiguration

### LLM-Einstellungen
- **KISS-KI (GWDG)**: `gpt-oss-120b` über GWDG Academic Cloud
- **OpenAI**: `gpt-4o-mini` über OpenAI API
- **Umschaltung**: Live-Umschaltung in der UI

### WLO-Einstellungen
- **Auto-Empfehlungen**: Automatische Materialsuche bei jeder Eingabe
- **Deutsche Inhalte**: Fokus auf deutschsprachige Bildungsmaterialien
- **Relevanz-Filter**: Intelligente Auswahl basierend auf Kontext

## 🔧 Development

### Scripts
```bash
npm run dev      # Development Server
npm run build    # Production Build
npm run preview  # Build Preview
npm run lint     # ESLint Check
```

### Code Style
- **TypeScript**: Strenge Typisierung für bessere DX
- **Tailwind CSS**: Utility-first Styling
- **ESLint**: Code-Qualität und Konsistenz

## 🌐 Deployment

### Vercel (Empfohlen)
```bash
# Automatisches Deployment via Git
git push origin main
```

### Andere Plattformen
```bash
npm run build
# Deploy dist/ Ordner zu beliebiger Static-Hosting-Plattform
```

## 🔍 API-Endpunkte

### Development Proxies
- `/api/edu-sharing/rest/*` → `https://redaktion.openeduhub.net/edu-sharing/rest/*`
- `/api/openai/*` → `https://api.openai.com/*`
- `/api/gwdg/*` → `https://chat-ai.academiccloud.de/*`

### Production Rewrites
Siehe `vercel.json` für Produktions-Routing-Konfiguration.

## 🐛 Troubleshooting

### Häufige Probleme

#### 🔑 API-Key-Probleme
```bash
# Problem: "API key not found" oder 401 Unauthorized
# Lösung: Überprüfen Sie Ihre Environment Variables
```
- **Development**: Prüfen Sie `.env.local` auf korrekte `VITE_*` Variablen
- **Production**: Überprüfen Sie Vercel Environment Variables
- **System**: Stellen Sie sicher, dass `OPENAI_API_KEY` und `GWDG_API_KEY` gesetzt sind

#### 🌐 CORS-Fehler
```bash
# Problem: "Access to fetch at '...' has been blocked by CORS policy"
# Lösung: Proxy-Konfiguration überprüfen
```
- **Development**: `vite.config.ts` Proxy-Einstellungen prüfen
- **Production**: `vercel.json` Rewrites überprüfen

#### 🏗️ Build-Fehler
```bash
# Problem: TypeScript-Fehler beim Build
npm run build
```
- TypeScript-Typen in `src/lib/types.ts` überprüfen
- Dependencies aktualisieren: `npm update`
- Cache löschen: `rm -rf node_modules package-lock.json && npm install`

#### 📚 WLO-Integration Probleme
- **Keine Materialien gefunden**: Debug-Modus aktivieren und Suchparameter prüfen
- **Metadaten "N/A"**: Überprüfen Sie die WLO-Filter-Methode in den Einstellungen
- **Langsame Antworten**: Cross-Encoder-Methode kann langsamer sein als AI-basierte Extraktion

### Debug-Modus
Aktivieren Sie den Debug-Modus in der UI für detaillierte Informationen:
- **Extrahierte Metadaten**: Topic, Subject, Content Type
- **WLO-Suchparameter**: Verwendete Filter und Suchanfragen  
- **LLM-Model-Informationen**: Aktives Modell und API-Endpunkt
- **API-Response-Details**: Vollständige API-Antworten und Timing
- **Console-Logs**: Zusätzliche Debugging-Informationen in Browser-Konsole

### Performance-Optimierung
- **Langsame Builds**: Vite Cache löschen mit `rm -rf node_modules/.vite`
- **Speicher-Probleme**: Node.js Heap-Size erhöhen: `NODE_OPTIONS="--max-old-space-size=4096"`
- **WLO-Anfragen**: Rate-Limiting beachten, nicht mehr als 10 Anfragen/Minute

## 📄 Lizenz

MIT License - Siehe LICENSE-Datei für Details.

## 🤝 Contributing

Wir freuen uns über Beiträge! Bitte befolgen Sie diese Schritte:

### Development Setup
1. **Repository forken** und lokal klonen
2. **Dependencies installieren**: `npm install`
3. **Environment Setup**: `.env.example` zu `.env.local` kopieren und API-Keys hinzufügen
4. **Development Server starten**: `npm run dev`

### Contribution Workflow
1. **Feature Branch erstellen**:
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Code-Qualität sicherstellen**:
   ```bash
   npm run lint        # ESLint prüfen
   npm run build       # Build testen
   ```

3. **Sicherheit prüfen**:
   - ✅ Keine API-Keys im Code
   - ✅ Keine `.env.local` Dateien committen
   - ✅ Pull Request Template befolgen

4. **Changes committen**:
   ```bash
   git commit -m "feat: Add amazing feature"
   ```

5. **Branch pushen und Pull Request öffnen**:
   ```bash
   git push origin feature/amazing-feature
   ```

### Code-Standards
- **TypeScript**: Vollständige Typisierung erforderlich
- **Tailwind CSS**: Für alle Styles verwenden
- **Komponenten**: Funktionale Komponenten mit Hooks
- **API-Calls**: Über `llmApi.ts` und `wloApi.ts` abstrahieren

### Commit-Konventionen
- `feat:` - Neue Features
- `fix:` - Bug-Fixes  
- `docs:` - Dokumentation
- `style:` - Code-Formatierung
- `refactor:` - Code-Refactoring
- `security:` - Sicherheits-Updates

## 📞 Support

Bei Fragen oder Problemen erstellen Sie bitte ein Issue im Repository.

---

**Powered by WirLernenOnline.de** 🎓
