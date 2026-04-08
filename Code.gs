/**
 * TRMNL Spanish Mnemonics - Google Apps Script Backend
 * 
 * Dieses Skript dient als Web App Endpoint für das TRMNL-Device.
 * Es lädt die Vokabeldaten via jsDelivr vom GitHub-Repository,
 * speichert die aktuelle Position in der Queue (PropertiesService)
 * und liefert bei jedem Aufruf das JSON mit dem Markup für die *nächste* Vokabel zurück.
 */

// KONFIGURATION:
// Passe diese URLs an dein GitHub-Repository an!
const GITHUB_USER = "DEIN_GITHUB_USERNAME";
const GITHUB_REPO = "trmnl_spanish";
const BRANCH = "main"; // oder "master"

const WORDS_JSON_URL = `https://cdn.jsdelivr.net/gh/${GITHUB_USER}/${GITHUB_REPO}@${BRANCH}/words.json`;
const BASE_IMAGE_URL = `https://cdn.jsdelivr.net/gh/${GITHUB_USER}/${GITHUB_REPO}@${BRANCH}/images/processed/`;

function doGet() {
  try {
    // 1. Datenwörterbuch abrufen (words.json)
    const response = UrlFetchApp.fetch(WORDS_JSON_URL);
    const words = JSON.parse(response.getContentText());

    if (!words || words.length === 0) {
      return buildErrorResponse("Keine Vokabeln in der words.json gefunden.");
    }

    // 2. Aktuellen Index aus dem PropertiesService lesen
    const scriptProperties = PropertiesService.getScriptProperties();
    let currentIndex = parseInt(scriptProperties.getProperty('currentIndex'), 10);

    // Initialisieren oder zurücksetzen, falls nicht vorhanden oder am Ende der Liste
    if (isNaN(currentIndex) || currentIndex >= words.length) {
      currentIndex = 0;
    }

    // 3. Aktuelles Wort extrahieren
    const currentWord = words[currentIndex];

    // 4. Index für den nächsten Aufruf erhöhen und speichern
    scriptProperties.setProperty('currentIndex', (currentIndex + 1).toString());

    // 5. TRMNL Markup zusammenbauen
    const markup = buildMarkup(currentWord, currentIndex + 1, words.length);

    // 6. JSON im TRMNL-Format zurückgeben
    return ContentService.createTextOutput(JSON.stringify({ markup: markup }))
                         .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return buildErrorResponse(error.message);
  }
}

/**
 * Baut das HTML Markup für das TRMNL Split-Screen Layout zusammen.
 */
function buildMarkup(word, currentNumber, totalNumber) {
  const imageUrl = BASE_IMAGE_URL + word.image;

  // Wir nutzen Inline-CSS und TRMNL-taugliche Strukturen
  return `
    <div style="display: flex; width: 800px; height: 480px; font-family: sans-serif; background-color: #fff; color: #000;">
      
      <!-- Linke Hälfte: Bild -->
      <div style="width: 400px; height: 480px; position: relative; border-right: 2px solid #000; box-sizing: border-box;">
        <img src="${imageUrl}" alt="${word.word_es}" style="width: 100%; height: 100%; object-fit: cover;" />
        <div style="position: absolute; bottom: 0; left: 0; width: 100%; background: rgba(255, 255, 255, 0.9); padding: 5px 10px; font-size: 14px; border-top: 1px solid #000; box-sizing: border-box;">
          TRMNL Spanish • Vokabel ${currentNumber} / ${totalNumber}
        </div>
      </div>
      
      <!-- Rechte Hälfte: Textinhalte -->
      <div style="width: 400px; height: 480px; padding: 40px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between;">
        
        <div>
          <h1 style="font-size: 60px; font-weight: bold; margin: 0; line-height: 1;">${word.word_es}</h1>
          <div style="font-size: 26px; color: #444; margin-top: 5px;">${word.translation_de}</div>
          
          <div style="background-color: #f4f4f4; padding: 20px; border-radius: 8px; margin-top: 35px; font-style: italic; font-size: 22px; line-height: 1.4; border-left: 5px solid #000;">
            ${word.mnemonic}
          </div>
        </div>
        
        <div style="margin-top: auto;">
          <div style="font-weight: bold; font-size: 20px; margin-bottom: 5px;">${word.example_es}</div>
          <div style="font-size: 18px; color: #444;">${word.example_de}</div>
        </div>
        
      </div>
    
    </div>
  `;
}

/**
 * Hilfsfunktion für Fehler-Responses im TRMNL-Format
 */
function buildErrorResponse(errorMessage) {
  const markup = `
    <div style="padding: 40px; font-family: sans-serif;">
      <h2>Fehler beim Laden der Vokabeln</h2>
      <p>${errorMessage}</p>
    </div>
  `;
  return ContentService.createTextOutput(JSON.stringify({ markup: markup }))
                       .setMimeType(ContentService.MimeType.JSON);
}
