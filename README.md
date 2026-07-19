# Music – Offline PWA

Offline-fähiger Musik-Player als Progressive Web App. Läuft nach dem ersten Öffnen vollständig ohne Internetverbindung.

## Dateien im Repository

```
/
├── index.html          ← Die komplette App
├── manifest.json       ← PWA-Konfiguration (Name, Icon, Farbe)
├── sw.js               ← Service Worker (Offline-Cache)
├── App_Music_Icon.png  ← App-Icon (musst du selbst hinzufügen)
└── README.md
```

> **Wichtig:** Die Datei `App_Music_Icon.png` musst du selbst in das Repository-Stammverzeichnis legen. Das Icon sollte quadratisch sein und mindestens 512×512 px.

---

## Deployment auf GitHub Pages

1. Repository auf GitHub erstellen
2. Alle Dateien in den `main`-Branch pushen
3. Im Repository: **Settings → Pages**
4. Unter *Build and deployment* auswählen:
   - Source: **Deploy from a branch**
   - Branch: **main**, Ordner: **/ (root)**
5. **Save** klicken

Die App ist dann unter erreichbar:
```
https://DEIN-USERNAME.github.io/REPO-NAME/
```

---

## Offline-Funktion

- **Erster Besuch** (muss online sein): Der Service Worker lädt die App-Shell und cached alle benötigten Dateien.
- **Alle weiteren Besuche**: Die App startet sofort aus dem Cache – auch ohne WLAN oder Mobilfunk.
- **Musik-Dateien** werden in IndexedDB des Browsers gespeichert (separat vom SW-Cache).

## Als App installieren

- **iOS/iPadOS**: Safari öffnen → Teilen-Symbol → *Zum Home-Bildschirm*
- **Android**: Chrome öffnen → Drei-Punkte-Menü → *App installieren*
- **Desktop (Chrome/Edge)**: Adressleiste → Install-Symbol

Das Icon `App_Music_Icon.png` erscheint dann auf dem Homescreen.

---

## Backup

Der Export (Einstellungen → Bibliothek sichern) erzeugt eine kleine JSON-Datei ohne Audiodaten. Beim Import müssen JSON + Original-Audiodateien zusammen ausgewählt werden – die App ordnet sie per Dateiname zu. Playlists werden vollständig wiederhergestellt.
