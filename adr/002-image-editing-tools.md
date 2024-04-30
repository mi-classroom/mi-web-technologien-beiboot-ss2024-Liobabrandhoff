# Image Editing Tools

- Author: [Lioba Brandhoff](https://github.com/liobabrandhoff)
- Date: 30.04.2024
- Issue: 1

## Context and Problem Statement

Mit welchem Bearbeitungstool kann ich die frames aus dem Video mit einer geringeren Deckkraft übereinanderlegen, um eine Langzeitbelichtung aus dem Video zu erstellen?

## Considered Options

- Jimp
- Sharp
- Magickwand

## Decision

Bei der Erstellung eines überlagerten Fotos aus mehreren einzelnen Fotos, habe ich drei Tools getestet: Magickwand, Sharp und Jimp.

Letztendlich habe ich Jimp genutzt, da ich mit Magickwand und Sharp auf Probleme stieß, die ich nicht lösen konnte. Im Folgenden dazu mehr.

## Consequences

Magickwand schied leider aufgrund seiner doch sehr kurzen Dokumentation schnell aus. Ich hatte bereits kurz nach der Installation erste fehler, die sich nicht eindeutig identifizieren und beheben ließen.

Sharp hingegen war schon wesentlich besser geeignet. Ich habe die aus dem Video konvertierten Frames aus dem Ordner selektieren können und hatte diese bereits übereinander gelegt. Jedoch gab es dann das Problem, dass mir nur das letzte Bild angezeigt wurde, weil die Deckkraft der Bilder nicht angepasst werden konnte und somit das letzte Bild über allen anderen Bildern lag. Nach mehreren gescheiterten Versuchen, kam ich also zu dem Entschluss nach einem anderen Tool zu suchen.
(Workload war etwa 3:30h)

Jimp hat dann letztendlich funktioniert. Mit Jimp konnte ich die Bilder aus dem Ordner selektieren und deren Deckkraft verringern, sodass ich diese dann im Anschluss übereinanderlegen und das Foto mit "Langzeitbelichtung" abspeichern konnte. (Workload betrug etwa 1:00h)


## Pros and Cons of the Options

### Jimp

#### Pro

- Für Node.js
- Viele Möglichkeiten wie Rotationen, Kompositionen, Blend Modes, Bildgrößenänderungen etc.

#### Contra

- nichts negatives nennbar

### Sharp

#### Pro

- Für Node.js
- Für Windows, Mac und Linux geeignet
- Viele Möglichkeiten wie Rotationen, Kompositionen, Bildgrößenänderungen etc.

#### Contra

- keine verringerte Deckkraft möglich (bzw. habe ich dies nicht erreichen können)

### Magickwand

#### Pro

- kann leider aufgrund zu kurzer Auseinandersetzung mit dem Tool nicht benannt werden

#### Contra

- zu kurze und wenig aufschlussreiche Dokumentation