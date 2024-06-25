# Image Editing Tools

- Author: [Lioba Brandhoff](https://github.com/liobabrandhoff)
- Date: 04.06.2024
- Issue: 2

## Context and Problem Statement

Es soll ein Frontend erstellt werden. Der Nutzer soll Eingaben machen können, wie das Hochladen eines Videos, Generierung einzelner Frames des Videos, Auswahl dieser Frames und Generierung eines Fotos mit Langzeitbelichtung anhand der ausgewählten Frames.

## Considered Options

- Vue.js

## Decision

Für die Erstellung eines Frontends habe ich mich dafür entschieden mit dem Framework Vue.js zu arbeiten.

## Consequences

Mit Vue.js ist es möglich über das Kürzel "v-" Schleifen, Bedingungen und Event-Handler in HTML zu verwenden. Durch die einfache Struktur bietet es eine leichte Erlernbarkeit und die Möglichkeit den Code schlanker zu gestalten.

Im Kontext dieses Projekts hat Vue.js besonders dabei geholfen, Event-Handler für die Generierungen oder den Upload nutzen zu können und die erstellten Frames in einer Schleife ausgeben zu können.

## Pros and Cons of the Options

### Vue.js

#### Pro

- einfache Erlernbarkeit
- gute Leistungsfähigkeit (sehr performant)
- Schleifen, Bedingungen und Event-Handler in HTML
- kompakt und überschaubar

#### Contra

- anfällig für Spaghetti-Code
- Reaktivität - Komplexität (Teilen von Daten zwischen einer Komponentenklasse und ihrem Template führt manchmal zu Fehlern beim Lesen der Daten - weiteres dazu: [Vue.js Reactivity in Depth](https://vuejs.org/guide/extras/reactivity-in-depth.html))