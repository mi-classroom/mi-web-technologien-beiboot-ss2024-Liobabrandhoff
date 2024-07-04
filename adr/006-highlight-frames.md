# Image Editing Tools

- Author: [Lioba Brandhoff](https://github.com/liobabrandhoff)
- Date: 02.07.2024
- Issue: 3
- Workload: 5:15h

## Context and Problem Statement

Wie kann ein Nutzer ein oder mehrere Schlüsselbilder aus den einzelnen Frames auswählen, um diese im Endergebnis zu highlighten?

## Considered Options

- Jimp
- Vue.js

## Decision

Für die Auswahl des Nutzers habe ich mit Vue.js ein Input-Feld erstellt, in dem der Nutzer eine Eingabe machen kann, welche Bilder man highlighten möchte. Anhand dieser Eingabe werden dann die entsprechenden Frames mit einer höheren Opazität versehen (mit Jimp), als die anderen Bilder.

## Consequences

Da ich keinen Zwischenschritt eingebaut habe, in dem erst die Auswahl der Frames generiert und dann erneut die Auswahl für die Highlights eingegeben und generiert wird, ist der Schritt für die Generierung des Endergebnisses deutlich langsamer geworden. Die Frames werden nun doppelt durchlaufen, da einmal wird, welche Frames überhaupt selektiert wurden und dann, ob sie noch hervorgehoben werden sollen. Dieser Prozess könnte möglicherweise noch optimiert werden.

## Pros and Cons of the Options

### Nur eine Generierung für die Auswahl der Frames und Highlighting

#### Pro

- Eine Generierung -> weniger Klicks für den Nutzer

#### Contra

- Auffällig längere Ladezeit bei der Generierung