# Image Configuration and Download

- Author: [Lioba Brandhoff](https://github.com/liobabrandhoff)
- Date: 07.09.2024
- Issue: 5 
- Workload: 2:30h

## Context and Problem Statement

Für dieses Issue habe ich noch zwei kleinere Features zusätzlich zu dem Step-Prozess ergänzt: Die Bildanpassung und der Download des Bildes.

## Considered Options

- Deckkraft Einstellung der hervorzuhebenden Frames 
- Download des kombinierten Bildes

## Decision

Da ich bereits bei der Verwendung eines Step-Prozesses auf ein gutes Nutzererlebnis Wert gelegt habe, erschien es mir sinnvoll, dies mit zwei
kleineren Features noch weiter auszuarbeiten. Zum Einen hielt ich es für erforderlich, dass der Nutzer das erzeugte Bild auch herunterladen kann.
Zum Anderen bieten Einstellungsmöglichkeiten dem Nutzer die Freiheit auf das Endergebnis möglichst viel Einfluss zu nehmen. 

## Consequences

Die Gestaltungsfreiheit ist in dieser Anwendung meiner Ansicht nach, ein besonders wichtiger Aspekt, auf den man einen Fokus legen sollte, wenn man 
diese weiter ausbaut. Die Anwendung ist ein Tool zur Erstellung eines eigenen Fotos mit Langzeitbelichtung, weshalb es sich anbietet dem Nutzer möglichst
viele Optionen zu bieten, das Bild nach seinen Wünschen zu erstellen. In diesem Kontext sind diese Anpassungsmöglichkeiten zunächst mit der Einstellung der
Deckkraft der hervorgehobenen Frames realisiert.

Des Weiteren dient der Download des Endergebnisses dazu, dass der Nutzer das erzeugte Bild auch für seine Zwecke weiter nutzen kann.

## Pros and Cons of the Options

### Image Configuration

#### Pro

- freie Anpassungsmöglichkeiten für den Nutzer, wie das Endergebnis aussehen soll (nur eine Einstellung ist natürlich noch nicht viel und soll an 
dieser Stelle nur einen "Platzhalter" für weitere Anpassungsmöglichkeiten darstellen)

#### Contra

- keine negativen Aspekte ersichtlich

### Image Download

#### Pro

- ermöglicht es dem Nutzer, das Bild zu speichern und für weitere Zwecke zu verwenden

#### Contra

- keine negativen Aspekte ersichtlich


## Additional ideas for Image Configuration

Aufgrund meiner Ansicht, dass man das Projekt noch mit anderen Einstellungen erweitern könnte, um dem Nutzer viele Freiheiten zu gewähren,
nenne ich an dieser Stelle noch weitere Ideen für andere Einstellungen:
- Effekte im kombinierten Bild (bspw. mit blend modes)
- Deckkraft der selektierten Bilder anpassen
- Video nach dem Upload zuschneiden bzw. relevante Time-Slots selektieren
- Projekt für den späteren Gebrauch innerhalb der Anwendung speichern, sodass man zu einem späteren Zeitpunkt noch einmal darauf zugreifen kann
- Durch KI-Bilderkennung könnten einzelne Elemente (bspw. ein Straßenschild) herausgefiltert werden, damit sie nicht im Endresultat erscheinen
- Es könnten Standard-Bildeinstellungen vor der Kombination der Frames getroffen werden (z.B. Helligkeit o.ä. für alle oder ausgewählte Frames anpassen)
