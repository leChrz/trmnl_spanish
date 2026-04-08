# TRMNL Spanish Mnemonics (Eselsbrücken)

Dieses Projekt dient dazu, Spanisch-Vokabeln mithilfe von visuellen und textuellen Eselsbrücken auf einem [TRMNL](https://usetrmnl.com/) E-Ink Display zu lernen.

## 💡 Das Konzept

Vokabeln lassen sich oft leichter merken, wenn man sie mit einem bekannten Bild oder einem Wortspiel verknüpft (Mnemotechnik). 
Beispiel: **"cantar"** (singen) $\rightarrow$ Ein Vogel sitzt auf einer Dach**kante** und singt.

Dieses Repository enthält eine Datenbank von Vokabeln inklusive Mnemonics und Bildern, die zufällig auf dem TRMNL rotieren.

## 🛠 Die Architektur (Pipeline)

Das Projekt nutzt die folgende smarte Architektur, um ohne einen eigenen 24/7-Server auszukommen und deinen Lernfortschritt zu speichern:

1.  **Daten & Hosting (GitHub):** 
    *   Die `words.json` enthält alle Vokabeln.
    *   Im Ordner `images/processed/` liegen die fertigen, E-Ink-optimierten Bilder (2-Bit Dithered).
    *   Alles wird hier im Repo gepflegt und über das **jsDelivr CDN** bereitgestellt.
2.  **Logik & State (Google Apps Script):**
    *   Die Datei `Code.gs` wird als Google Web App deployed (kostenlos).
    *   TRMNL pollt diese Web App.
    *   Das Skript lädt die JSON, merkt sich über den `PropertiesService` deine aktuelle Position in der Warteschlange (Queue), baut das HTML zusammen und schickt es an dein Display. Danach wird der Index erhöht.
3.  **Anzeige (TRMNL):** 
    *   Dein 7.5" TRMNL Display nutzt das bereitgestellte Markup (Split-Screen Design) für eine gestochen scharfe Anzeige.

## 📁 Struktur

-   `words.json`: Die Datenbank der Vokabeln.
-   `/images`: Ordner für die generierten oder gesammelten Eselsbrücken-Bilder.

## 🎨 Design-Vorschlag für die TRMNL-Page

Da das TRMNL-Display ein E-Ink Screen ist, sollte das Design folgende Kriterien erfüllen:
- **Schwarz-Weiß / Hoher Kontrast**: Keine feinen Graustufen für wichtige Texte.
- **Hierarchie**:
    1.  Das spanische Wort (Groß, Fokus).
    2.  Das Eselsbrücken-Bild (Zentral).
    3.  Der Mnemonic-Text (Hervorgehoben, z.B. kursiv oder in einer Box).
    4.  Übersetzung & Beispiel (Dezent am unteren Rand).

---

*Viel Erfolg beim Spanisch lernen!*
