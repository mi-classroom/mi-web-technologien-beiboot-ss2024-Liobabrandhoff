# Backend Implementation

- Author: [Lioba Brandhoff](https://github.com/liobabrandhoff)
- Date: 30.04.2024
- Issue: 1
- Workload: 8:15h

## Context and Problem Statement

In dem Beiboot-Projekt soll ein Video hochgeladen werden können, aus dem ein Foto mit einer Langzeitbelichtung entsteht.

## Considered Options

- Node.js
- ffmpeg
- Jimp / Sharp / Magickwand (Auswahl des Bildbearbeitungstools im Detail: [0002 - Image editing tools](0002-image-editing-tools.md))

## Decision

Bei der Entwicklung meines Backends habe ich JavaScript, Node.js, ffmpeg und Jimp genutzt.

- ffmpeg habe ich als Hilfestellung genutzt, um das Video in einzelne Frames umzuwandeln.
- Mit Jimp habe ich die Deckkraft der einzelnen frames reduziert und diese dann im Anschluss übereinandergelegt.

## Pros and Cons of the Options

### Node.js

#### Pro

- Schnelle Geschwindigkeit
- Nur eine Programmiersprache für Backend und Frontend nötig
- Synchronisierte Anfragebearbeitung (Single-Thread-Programm)

#### Contra

- Effizienz nimmt ab, wenn CPU-Last wächst - keine schweren Rechenvorgänge
- Schlecht mit relationalen Datenbanken

### JavaScript

#### Pro

- JavaScript wird von allen modernen Webbrowsern unterstützt
- Für client- und serverseitige Entwicklung einsetzbar

#### Contra

- dynamische Typisierung von JavaScript kann zu Laufzeitfehlern führen
- Codevervollständigung, Refactoring und Fehlererkennungsfunktionen leider schlecht

### ffmpeg

#### Pro

- Einfache Konvertierung eines Videos zu Bildern (bzw. auch andersherum)
- Für Windows, Mac und Linux geeignet
- Für Node geeignet

### Jimp

Weiteres zu Jimp unter: [0002 - Image editing tools](0002-image-editing-tools.md)