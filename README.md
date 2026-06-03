# fictional_portfolio

Eine **interaktive Portfolio-Seite, komplett in Vanilla JavaScript** – ohne
Framework, ohne Build-Schritt. Der gesamte Seiteninhalt wird zur Laufzeit aus
einer JSON-Datei gerendert, und über allem schwebt eine kleine Spielerei: per
Klick spawnen physikbasierte „Raketen“, die der Maus folgen, über Elemente fliegen
und Effekte auslösen.

> Die Inhalte sind **fiktiv** (Demo-Daten) – das Projekt ist eine Technik- und
> Interaktionsdemo, kein echter Lebenslauf.

![Übersicht](docs/gallery/overview.png)

## Features

Alle aufgeführten Features sind **implementiert und getestet** ✅:

- **Datengetriebenes Rendering** – die fünf Kapitel werden per AJAX aus
  `assets/data.json` geladen; das Feld `type` jedes Kapitels wählt den passenden
  Renderer (`value-bars`, `badges`, `logo-markdown-flex`, `slider-grid`).
- **Animiertes Balkendiagramm** mit Hover-Effekt: Der Balken verbreitert sich und
  blendet die zugehörige Projektnotiz ein.
- **Badges** für Interessensgebiete.
- **Logo-+-Markdown-Blöcke** für Zertifikate und Berufserfahrung (gerendert mit
  `marked.js`).
- **Projekt-Slider** mit Karten, die per Klick und automatisch (15–19 s) weiter­
  schalten und Bilder, Videos und GitHub-Badges anzeigen.
- **Raketen-System**: Klick auf das Pacman-Icon spawnt vier Raketen mit Physik
  (Beschleunigung, Dämpfung, Zufallslenkung), die sich in Flugrichtung drehen,
  beim Überfliegen von Elementen Effekte auslösen und per Klick zerstört werden.
- **Reparatur-Menü**: Rechtsklick öffnet ein eigenes Menü, über das zerstörte
  Raketen wieder repariert werden.
- **Responsives Layout** – Kapitel liegen auf breiten Screens nebeneinander und
  stapeln sich auf dem Smartphone.
- **Fixierter Header** mit Smooth-Scroll-Navigation.

![Skills-Diagramm mit Hover](docs/gallery/feature-skills-bars.png)

Die Raketen in Aktion (Spawn, Effekte, Treffer, Reparatur) – mehr in der
[Gallery](Gallery.md):

<video src="https://github.com/husaammaster/fictional_portfolio/raw/main/docs/gallery/rockets-spawn.mp4" controls autoplay loop muted playsinline width="720"></video>

## Tech-Stack

- **HTML5** + **CSS3** (Flexbox, CSS-Animationen, Media-Queries)
- **Vanilla JavaScript** (ES-Module, `XMLHttpRequest`, `getBoundingClientRect`-Physik)
- Laufzeit-Bibliotheken via CDN: **marked.js** (Markdown), **bootstrap-icons**
  (Raketen-Glyph), **shields.io** (GitHub-Badges im Slider)

Kein Build-System, kein Framework, kein Paketmanager.

## Lokal starten

Die Seite nutzt ES-Module und AJAX und muss daher über HTTP ausgeliefert werden
(nicht per `file://`):

```bash
python3 -m http.server 8099
# dann http://localhost:8099 öffnen
```

## Galerie

Eine ausführliche, bebilderte Tour durch alle Features steht in
**[Gallery.md](Gallery.md)**.
