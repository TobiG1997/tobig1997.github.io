# eBook Bibliothek 📚

Eine moderne, Apple-inspirierte Web-Anwendung zum Verwalten und Herunterladen von eBooks.

## 🚀 Verwendung

1. **PDF-Dateien hinzufügen**: Lege deine PDF-eBooks in den `eBooks/` Ordner
2. **ebooks.json aktualisieren**: Füge Metadaten für jedes neue eBook hinzu
3. **Auf GitHub Pages deployen**: Die Seite wird automatisch bereitgestellt

## 📝 eBooks hinzufügen

Bearbeite die `ebooks.json` Datei und füge einen neuen Eintrag für jedes eBook hinzu:

```json
{
    "title": "Titel des Buches",
    "author": "Autor Name",
    "file": "eBooks/dateiname.pdf"
}
```

**Hinweis:** Dateigröße und Seitenanzahl werden automatisch berechnet!

### Beispiel:

```json
[
    {
        "title": "Mein erstes eBook",
        "author": "Max Mustermann",
        "file": "eBooks/mein-erstes-ebook.pdf"
    }
]
```

## ✨ Features

- 🎨 Modernes Apple-Design
- 🌓 Dark Mode Support
- 🔍 Suchfunktion nach Titel und Autor
- 📱 Responsive Design für alle Geräte
- ⚡ Schnelle und flüssige Animationen
- 💾 Direkter Download aller eBooks

## 🎨 Design-Features

- SF Pro Display Schriftart (Apple System Font)
- Gradient-Effekte
- Smooth Animationen
- Hover-Effekte
- Responsive Grid-Layout

## 📦 Struktur

```
.
├── index.html          # Hauptseite
├── styles.css          # Apple-Style CSS
├── app.js             # JavaScript Logik
├── ebooks.json        # eBook Metadaten
├── eBooks/            # PDF Dateien
└── README.md          # Diese Datei
```

## 🧪 Lokal Testen

Um die Website lokal zu testen, starte einen HTTP Server:

```bash
python3 -m http.server 8000
```

Dann öffne im Browser: **http://localhost:8000**

## 🌐 GitHub Pages

Die Anwendung ist optimiert für GitHub Pages und wird automatisch bereitgestellt.

## 📄 Lizenz

Frei verwendbar für persönliche Projekte.
