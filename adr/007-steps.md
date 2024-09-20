# Steps

- Author: [Lioba Brandhoff](https://github.com/liobabrandhoff)
- Date: 03.09.2024
- Issue: 5 
- Workload: 5:30h

## Context and Problem Statement

Für dieses Issue sollte ein eigenes Feature in das Projekt eingebunden werden. Daher habe ich mich für eine Prozess-Struktur mit einzelnen Steps entschieden. 
Nachdem ich das Hervorheben von Frames eingebaut hatte, war meine Anwendung deutlich langsamer als zuvor, da die generierten Frames doppelt durchlaufen wurden 
(beim Selektieren der verwendeten Frames und beim Auswählen der hervorzuhebenden Frames). Daher entschied ich mich mehrere Steps einzubauen, um zum Einen die 
Ladezeiten bei Kombinieren der Bilder zu verbessern und zum Anderen durch die neue Struktur dem Nutzer einen besseren Überblick über die Anwendung zu verschaffen.

## Considered Options

- Step-Logik mit Vue.js

## Decision

Für die Verwendung eines Step-Prozesses habe ich mit Vue.js gearbeitet. Damit habe ich eine for-Schleife für den step-Indikator erstellen können. Zudem konnten
die Inhalte der einzelnen Steps erst dann angezeigt werden, wenn man zum nächsten Step gelangt. 
Des Weiteren sollen die Steps dafür sorgen, dass zunächst ein Array der selektierten Frames erstellt wird, bevor die Frames zum Highlighten ausgewählt werden können.

## Consequences

Die Steps sorgen u.a. dafür, dass beim Hervorheben bereits nur die Frames angezeigt werden, die noch von Bedeutung sind (bereits selektiert wurden). 
Beim Kombinieren der Frames zu einem Bild wird dadurch die Ladegeschwindigkeit deutlich besser, da nur die selektierten 
Frames und die davon hervorzuhebenden Frames abgefragt werden, statt zweimal der ganze Array der generierten Frames.

Zudem macht dieses Feature die Seite übersichtlicher und durch weniger Scrollen auch benutzerfreundlicher.

## Pros and Cons of the Options

### Steps

#### Pro

- kein Scrollen & aktueller Step eindeutig gekennzeichnet -> übersichtlichere und benutzerfreundlichere Struktur
- Ladegeschwindigkeit verbessert
- In Step 3 können die möglichen Frames zum Auswählen im Slider besser angezeigt werden

#### Contra

- Bei den Steps ist das Problem, dass man beim Neuladen der Seite oder beim Klicken auf den "Zurück"-Button im Tab, 
komplett von vorne anfangen muss, alles einzutragen. Dies könnte bspw. gelöst werden, indem die steps einen URL-Hash bekommen, 
um auf der Seite bleiben bzw. wechseln zu können. Dieses Problem sollte noch behoben werden, um ein gutes Nutzererlebnis zu ermöglichen.