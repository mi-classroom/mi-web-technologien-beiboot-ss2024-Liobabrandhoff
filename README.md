[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/gQyBcnrC)
# Web Technologien // begleitendes Projekt Sommersemester 2024
Zum Modul Web Technologien gibt es ein begleitendes Projekt. Im Rahmen dieses Projekts werden wir von Veranstaltung zu Veranstaltung ein Projekt sukzessive weiter entwickeln und uns im Rahmen der Veranstaltung den Fortschritt anschauen, Code Reviews machen und Entwicklungsschritte vorstellen und diskutieren.

Als organisatorischen Rahmen für das Projekt nutzen wir GitHub Classroom. Inhaltlich befassen wir uns mit einer Client-Server Anwendung mit deren Hilfe [Bilder mit Langzeitbelichtung](https://de.wikipedia.org/wiki/Langzeitbelichtung) sehr einfach nachgestellt werden können.

Warum ist das cool? Bilder mit Langzeitbelichtung sind gar nicht so einfach zu erstellen, vor allem, wenn man möglichst viel Kontrolle über das Endergebnis haben möchte. In unserem Ansatz, bildet ein Film den Ausgangspunkt. Diesen zerlegen wir in Einzelbilder und montieren die Einzelbilder mit verschiedenen Blendmodes zu einem Bild mit Langzeitbelichtungseffekt zusammen.

Dokumentieren Sie in diesem Beibootprojekt Ihre Entscheidungen gewissenhaft unter Zuhilfenahme von [Architectual Decision Records](https://adr.github.io) (ADR).

Hier ein paar ADR Beispiele aus dem letzten Semestern:
- https://github.com/mi-classroom/mi-web-technologien-beiboot-ss2022-Moosgloeckchen/tree/main/docs/decisions
- https://github.com/mi-classroom/mi-web-technologien-beiboot-ss2022-mweiershaeuser/tree/main/adr
- https://github.com/mi-classroom/mi-web-technologien-beiboot-ss2022-twobiers/tree/main/adr

Halten Sie die Anwendung, gerade in der Anfangsphase möglichst einfach, schlank und leichtgewichtig (KISS).

# Team
Autor: [Lioba Brandhoff](https://github.com/Liobabrandhoff) \
Reviewer: [Jona Dielmann](https://github.com/jona-d01)

# Projekt Dokumentation & Zeitaufwand

Die Entscheidungen für die Verwendung der Technologien innerhalb dieses Projekts, sowie Zeitaufwände für die jeweiligen Issues, sind unter folgendem Link dokumentiert:
[Architectural Decision Records](adr/README.md)


# Lokale Ausführung
Für die lokale Ausführung dieses Projekts muss [Node.js](https://nodejs.org/en/download/prebuilt-installer) oder [Docker](https://www.docker.com/) installiert sein

## Ausführung mit Node.js
### Installation
```sh
npm install
```

### Ausführung
```sh
npm start
```

## Ausführung mit Docker


#### Installation
```shell
 docker build -t beiboot-projekt .
```

#### Ausführung
```shell
docker run -p 8000:8000 --name beiboot-projekt -d beiboot-projekt
```


Die Anwendung kann nach erfolgreicher Ausführung unter http://localhost:8000 im Browser aufgerufen werden.