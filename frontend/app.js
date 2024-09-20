new Vue({
    el: '#app',
    data: {
        step: 1, // Schritt-Status
        steps: ['Datei hochladen', 'Frames auswählen', 'Frames hervorheben', 'Bild generieren'], // Schritte-Array
        selectedFile: null, //ausgewählte Videodatei
        projectName: '', //Projektname
        fps: 10, // Standardwert der fps
        generatedFrames: [], //generierte Frames
        selectedFrames: [], //ausgewählte Frames
        frameInput: '', //ausgewählte Frames im InputFeld
        getSelectedFrames: [], //alle ausgewählten Frames zur Weiterverarbeitung fürs Highlighten
        originalIndices: [], // Originale Indizes der ausgewählten Frames
        highlightFrames: [], //Frames, die hervorgehoben werden sollen
        highlightInput: '', //Frames, die hervorgehoben werden sollen im InputFeld
        highlightOpacity: 0.6, // Deckkraft für hervorgehobene Frames
        combinedImageUrl: '' //Url des kombinierten Bildes
    },
    methods: {
        // Funktion für die Steps (Gehe zum nächsten Schritt)
        nextStep() {
            if (this.step === 2 && !this.selectedFrames.length) {
                alert('Bitte wählen Sie mindestens einen Frame aus.');
                return;
            }
            if (this.step < this.steps.length) {
                this.step++;
            }

            // Swiper initialisieren, wenn wir im Schritt 3 sind
            if (this.step === 3) {
                this.initializeSwiper(); // Swiper initialisieren
            }
        },
        // Verarbeite Datei-Upload
        handleFileUpload(event) {
            this.selectedFile = event.target.files[0];
        },
        // Generiere Frames aus dem hochgeladenen Video
        generate() {
            if (!this.projectName) {
                alert('Bitte geben Sie einen Projektnamen ein.');
                return;
            }

            if (!this.fps || this.fps <= 0) {
                alert('Bitte geben Sie eine gültige FPS (Frames per Second) ein.');
                return;
            }

            if (!this.selectedFile) {
                alert('Bitte laden Sie eine Videodatei hoch.');
                return;
            }

            const formData = new FormData(); // Erstelle ein neues FormData-Objekt, um die Daten für den Upload zu sammeln.
            formData.append('file', this.selectedFile); // Füge die ausgewählte Datei (`selectedFile`) zum FormData-Objekt hinzu
            formData.append('projectName', this.projectName); // Füge die ausgewählte Datei (`projectName`) zum FormData-Objekt hinzu

            fetch('/api/upload', { // Sende die Daten per POST-Anfrage an den Upload-Endpunkt des Servers
                method: 'POST',
                body: formData
            })
                .then(response => response.json()) // Wenn eine Antwort vom Server angekommen ist, wird diese in ein JSON-Objekt konvertiert
                .then(data => { // Nachdem die Datei erfolgreich hochgeladen wurde, wird eine weitere Anfrage gesendet, um die Frames zu generieren
                    fetch('/api/generate', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ filename: data.filename, fps: this.fps, projectName: this.projectName }) // Die Daten werden als JSON gesendet. Der Dateiname stammt aus der Upload-Antwort des Servers

                    })
                        .then(response => response.json())
                        .then(data => {
                            this.generatedFrames = data.imageUrls; // Speichere die URLs der generierten Frames in `generatedFrames`

                            if (this.step < this.steps.length) {
                                this.step++;
                            }
                        })
                        .catch(error => {
                            console.error('Fehler bei der Generierung:', error);
                        });
                })
                .catch(error => {
                    console.error('Fehler beim Hochladen der Datei:', error);
                });
        },
        // Initialisiere Swiper
        initializeSwiper() {
            this.$nextTick(() => { // Sicherstellung, dass der DOM nach der Aktualisierung bereit ist
                // Überprüfe, ob bereits eine Swiper-Instanz existiert und zerstöre sie, um Konflikte zu vermeiden
                if (this.swiper) {
                    this.swiper.destroy(true, true);
                }
                // Erstelle eine neue Swiper-Instanz für die Bildanzeige
                this.swiper = new Swiper('.swiper-container', {
                    slidesPerView: 3,
                    spaceBetween: 16,
                    slidesPerGroup: 3,
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                });
            });
        },
        // Hilfsfunktion zum Umwandeln von einzelnen Indizes in einen Bereichsstrings  (bspw. 1-3 statt 1,2,3)
        indicesToRangeString(indices) {
            indices.sort((a, b) => a - b);
            let ranges = [];
            let rangeStart = indices[0];

            for (let i = 1; i <= indices.length; i++) {
                if (indices[i] !== indices[i - 1] + 1) {
                    if (rangeStart === indices[i - 1]) {
                        ranges.push(rangeStart.toString());
                    } else {
                        ranges.push(`${rangeStart}-${indices[i - 1]}`);
                    }
                    rangeStart = indices[i];
                }
            }
            return ranges.join(', ');
        },

        // Hilfsfunktion zum Umwandeln eines Bereichsstrings in eine Liste von Indizes
        rangeStringToIndices(rangeString) {
            const frameRanges = rangeString.split(',').map(range => range.trim());
            let indices = [];

            frameRanges.forEach(range => {
                const bounds = range.split('-');
                if (bounds.length === 1) {
                    indices.push(parseInt(bounds[0], 10));
                } else {
                    const start = parseInt(bounds[0], 10);
                    const end = parseInt(bounds[1], 10);
                    for (let i = start; i <= end; i++) {
                        indices.push(i);
                    }
                }
            });

            return indices;
        },

        // Aktualisiere das Eingabefeld basierend auf den ausgewählten Frames
        updateFrameInput() {
            // Ermittle den Index jedes ausgewählten Frames im `generatedFrames`-Array
            const selectedIndices = this.selectedFrames.map(frame => {
                return this.generatedFrames.indexOf(frame) + 1;
            });
            // Konvertiere die Liste der Indizes in einen Bereichsstring
            this.frameInput = this.indicesToRangeString(selectedIndices);
        },

        // Aktualisiere die ausgewählten Frames basierend auf dem Eingabefeld
        updateSelectedFrames() {
            const indices = this.rangeStringToIndices(this.frameInput); // Konvertiere den Bereichsstring aus `frameInput` in eine Liste von Indizes
            this.selectedFrames = this.generatedFrames.filter((_, index) => indices.includes(index + 1)); // Filtere die Frames in `generatedFrames`, deren Indizes in der Liste `indices` enthalten sind
            this.originalIndices = indices; // Speichere die ursprünglichen Indizes

            // Neue Nummerierung der ausgewählten Frames
            this.getSelectedFrames = this.selectedFrames.map((frame, index) => ({
                src: frame,
                newIndex: index + 1
            }));
        },

        // Aktualisiere das Eingabefeld basierend auf den ausgewählten highlightFrames
        updateHighlightFrameInput() {
            // Ermittle den Index jedes ausgewählten highlightFrames im `getSelectedFrames`-Array
            const selectedIndices = this.highlightFrames.map(frame => {
                return this.getSelectedFrames.indexOf(frame) + 1;
            });
            // Konvertiere die Liste der Indizes in einen Bereichsstring
            this.highlightInput = this.indicesToRangeString(selectedIndices);
        },

        // Aktualisiere die ausgewählten highlightFrames basierend auf dem Eingabefeld
        updateHighlightFrames() {
            const highlightIndices = this.rangeStringToIndices(this.highlightInput); // Konvertiere den Bereichsstring aus `highlightInput` in eine Liste von Indizes
            this.highlightFrames = this.getSelectedFrames.filter((_, index) => highlightIndices.includes(index + 1)); // Filtere die Frames in `getSelectedFrames`, deren Indizes in der Liste `highlightIndices` enthalten sind

            // Finde die Originalindizes der highlightFrames basierend auf der neuen Nummerierung
            this.originalHighlightIndices = highlightIndices.map(newIndex => this.originalIndices[newIndex - 1]);
        },

        // Überprüfung, ob in das Inputfeld für die Deckkraft der highlightFrames ein richtiger Wert (zwischen 0-1) eingetragen wurde
        validateOpacity() {
            this.opacityError = ''; // Setze die Fehlermeldung zurück
            if (this.highlightOpacity !== null && (this.highlightOpacity < 0 || this.highlightOpacity > 1)) {
                this.opacityError = 'Bitte geben Sie eine Zahl zwischen 0 und 1 für die Deckkraft ein.';
            }
        },

        // Verarbeitung der ausgewählte und hervorgehobenen Frames und Senden dieser an die combine-API
        async processSelectedFrames() {
            this.validateOpacity(); // Validierung der Deckkraft
            if (this.opacityError) {
                alert(this.opacityError);
                return;
            }

            try {
                const formData = new FormData();
                formData.append('projectName', this.projectName); // projectName als JSON-String zum FormData-Objekt hinzufügen

                // Wenn hervorgehobene Frames vorhanden sind, konvertiere ihre Original-Indizes in einen Bereichsstring und dann in ein Array von Zahlen.
                // Falls keine hervorgehobenen Frames ausgewählt sind, wird ein leeres Array zurückgegeben.
                const highlightFrames = this.highlightFrames.length > 0
                    ? this.rangeStringToIndices(this.indicesToRangeString(this.originalHighlightIndices))
                    : []; // Leeres Array, wenn keine Frames ausgewählt sind

                formData.append('highlightFrames', JSON.stringify(highlightFrames)); // highlightFrames als JSON-String zum FormData-Objekt hinzufügen

                // Filtere die ausgewählten Frames aus den generierten Frames
                const selectedFrames = this.selectedFrames.map(frame => this.generatedFrames.indexOf(frame));

                // Rufe alle ausgewählten Dateien gleichzeitig ab und füge sie dem FormData-Objekt hinzu
                await Promise.all(selectedFrames.map(async (index) => {
                    const frame = this.generatedFrames[index]; // Hole die URL des jeweiligen Frames
                    const response = await fetch(frame); // Lade das Bild herunter

                    const blob = await response.blob(); // Konvertiere das heruntergeladene Bild in ein Blob-Objekt
                    const fileName = frame.split('/').pop(); // Extrahiere den Dateinamen aus der Frame-URL
                    formData.append('images', blob, fileName); // Füge das Bild zum FormData-Objekt mit dem Dateinamen hinzu
                }));

                // Füge die ausgewählten Frames und die eingestellet Deckkraft für die highlightedFrames als JSON-String zum FormData-Objekt hinzu
                formData.append('selectedFrames', JSON.stringify(selectedFrames.map(index => index + 1)));
                formData.append('highlightOpacity', this.highlightOpacity);

                // Sende das FormData-Objekt an die combine-API zum Kombinieren der Bilder
                const response = await fetch('/api/combine', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json(); // Verarbeite die Antwort des Servers
                this.combinedImageUrl = data.imageUrl; // Speichere die URL des kombinierten Bildes

                if (this.step < this.steps.length) {
                    this.step++;
                }
            } catch (error) {
                console.error('Fehler beim Kombinieren der Bilder:', error);
            }
        }
    },
    watch: {
        // Überwache Änderungen an der `generatedFrames`-Eigenschaft
        generatedFrames() {
            this.initializeSwiper(); // Swiper initialisieren, wenn die generierten Frames aktualisiert werden
        },
        // Überwache Änderungen an der `selectedFrames`-Eigenschaft
        selectedFrames() {
            this.updateFrameInput(); // Aktualisiere das Eingabefeld für die ausgewählten Frames
        },
        // Überwache Änderungen an der `highlightFrames`-Eigenschaft
        highlightFrames() {
            // Wenn keine Frames ausgewählt sind, setze die Deckkraft (Opacity) auf `null`
            if (this.highlightFrames.length === 0) {
                this.highlightOpacity = null; // Setze auf null, wenn keine Frames ausgewählt sind
            }
            this.updateHighlightFrameInput(); // Aktualisiere das Eingabefeld für die ausgewählten highlightFrames
        },
    },
});
