# Image Editing Tools

- Author: [Lioba Brandhoff](https://github.com/liobabrandhoff)
- Date: 04.06.2024
- Issue: 2

## Context and Problem Statement

Wie kann ich die Aneinanderreihung der einzelnen Frames bestmöglich darstellen?

## Considered Options

- Swiper.js

## Decision

Bei der Aneinanderreihung der einzelnen Frames hatte ich zunächst ein einfaches Grid Layout (ähnlich einer Galerie).
Jedoch wurde es immer unübersichtlicher, je mehr Frames aus dem Video generiert wurden, weshalb ich mich dazu entschieden habe, einen Slider einzubauen.

## Consequences

Da ich bereits mit Swiper.js in vergangenen Projekten gearbeitet habe, kannte ich dessen Funktionsweise und hielt es für eine gute Library, mit der ich den Slider erstellen konnte.
Zudem ist die Library mit Vue.js kompatibel, wodurch es mir ebenfalls als die richtige Wahl erschien.


## Pros and Cons of the Options

### Swiper.js

#### Pro

- Open Source Library
- Integrierte Slide-Transitionen (laut Swiper: "Amazing Native Behaviour")
- responsiv
- (in meinem Fall gut: für Vue.js geeignet)

#### Contra

- nichts Negatives nennbar (auch im Internet keine Nachteile auffindbar)