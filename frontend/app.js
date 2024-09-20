new Vue({
    el: '#app',
    data: {
        step: 1, // Schritt-Status
        steps: ['Datei hochladen', 'Frames auswählen', 'Frames hervorheben', 'Bild generieren'], // Schritte-Array
        selectedFile: null, //ausgewählte Datei
        projectName: '', //Projektname
        fps: 10, // Standardwert der fps
        generatedFrames: [], //generierte Frames
        selectedFrames: [], //ausgewählte Frames
        frameInput: '', //ausgewählte Frames im InputFeld
        getSelectedFrames: [], //alle ausgewählten Frames zur Weiterverarbeitung fürs Highlighten
        originalIndices: [], // Originale Indizes der ausgewählten Frames
        highlightFrames: [], //Frames, die gehighlighted werden sollen
        highlightInput: '', //Frames, die gehighlighted werden sollen im InputFeld
        highlightOpacity: 0.6, // Neue Opacity für die hervorgehobenen Frames
        combinedImageUrl: '' //kombiniertes Bild
    },
    methods: {
        nextStep() {
            if (this.step === 2 && !this.selectedFrames.length) {
                alert('Bitte wählen Sie mindestens einen Frame aus.');
                return;
            }
            if (this.step < this.steps.length) {
                this.step++;
            }

            // Initialize Swiper when moving to step 3
            if (this.step === 3) {
                this.$nextTick(() => {
                    if (this.swiper) {
                        this.swiper.destroy(true, true);
                    }
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
            }
        },
        handleFileUpload(event) {
            this.selectedFile = event.target.files[0];
        },
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

            const formData = new FormData();
            formData.append('file', this.selectedFile);
            formData.append('projectName', this.projectName);

            fetch('/api/upload', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    fetch('/api/generate', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ filename: data.filename, fps: this.fps, projectName: this.projectName }) // Dateiname aus der Antwort des Servers

                    })
                        .then(response => response.json())
                        .then(data => {
                            this.generatedFrames = data.imageUrls;

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
        // Hilfsfunktion zum Erstellen eines Bereichsstrings aus Indizes
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

        updateFrameInput() {
            const selectedIndices = this.selectedFrames.map(frame => {
                return this.generatedFrames.indexOf(frame) + 1;
            });
            this.frameInput = this.indicesToRangeString(selectedIndices);
        },

        updateSelectedFrames() {
            const indices = this.rangeStringToIndices(this.frameInput);
            this.selectedFrames = this.generatedFrames.filter((_, index) => indices.includes(index + 1));

            // Speichere die ursprünglichen Indizes
            this.originalIndices = indices;

            // Neue Nummerierung der ausgewählten Frames
            this.getSelectedFrames = this.selectedFrames.map((frame, index) => ({
                src: frame,
                newIndex: index + 1
            }));
        },

        updateHighlightFrameInput() {
            const selectedIndices = this.highlightFrames.map(frame => {
                return this.getSelectedFrames.indexOf(frame) + 1;
            });
            this.highlightInput = this.indicesToRangeString(selectedIndices);
        },

        updateHighlightFrames() {
            const highlightIndices = this.rangeStringToIndices(this.highlightInput);
            this.highlightFrames = this.getSelectedFrames.filter((_, index) => highlightIndices.includes(index + 1));

            // Finde die Originalindizes der Highlight-Frames
            this.originalHighlightIndices = highlightIndices.map(newIndex => this.originalIndices[newIndex - 1]);
            console.log(this.originalHighlightIndices)
        },

        validateOpacity() {
            this.opacityError = ''; // Setze die Fehlermeldung zurück
            if (this.highlightOpacity !== null && (this.highlightOpacity < 0 || this.highlightOpacity > 1)) {
                this.opacityError = 'Bitte geben Sie eine Zahl zwischen 0 und 1 für die Deckkraft ein.';
            }
        },

        async processSelectedFrames() {
            this.validateOpacity(); // Validierung vor der Verarbeitung
            if (this.opacityError) {
                alert(this.opacityError);
                return;
            }

            try {
                const formData = new FormData();
                formData.append('projectName', this.projectName);

                //const highlights = this.rangeStringToIndices(this.indicesToRangeString(this.originalHighlightIndices)); // Konvertiere zuerst in das Array von Zahlen
                const highlights = this.highlightFrames.length > 0
                    ? this.rangeStringToIndices(this.indicesToRangeString(this.originalHighlightIndices))
                    : []; // Leeres Array, wenn keine Frames ausgewählt sind
                const highlightString = highlights.join(', '); // Wandelt das Array in einen String mit Komma-Trennung um
                const highlightFrames = highlightString.split(',').map(Number);

                // Filtere die ausgewählten Frames aus den generierten Frames
                const selectedFrames = this.selectedFrames.map(frame => this.generatedFrames.indexOf(frame));

                await Promise.all(selectedFrames.map(async (index) => {
                    const frame = this.generatedFrames[index];
                    const response = await fetch(frame);

                    const blob = await response.blob();
                    const fileName = frame.split('/').pop();
                    formData.append('images', blob, fileName);
                }));

                formData.append('highlightFrames', JSON.stringify(highlightFrames)); // highlightFrames als JSON-String hinzufügen
                formData.append('selectedFrames', JSON.stringify(selectedFrames.map(index => index + 1))); // selectedFrames als JSON-String hinzufügen

                formData.append('highlightOpacity', this.highlightOpacity);

                console.log('FormData Inhalt:', [...formData.entries()]);

                const response = await fetch('/api/combine', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();

                this.combinedImageUrl = data.imageUrl;

                if (this.step < this.steps.length) {
                    this.step++;
                }
            } catch (error) {
                console.error('Fehler beim Kombinieren der Bilder:', error);
            }
        }
    },
    watch: {
        generatedFrames() {
            this.$nextTick(() => {
                // Re-initialize Swiper when generatedFrames is updated
                if (this.swiper) {
                    this.swiper.destroy(true, true);
                }
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
        selectedFrames() {
            this.updateFrameInput();
        },
        highlightFrames() {
            if (this.highlightFrames.length === 0) {
                this.highlightOpacity = null; // Setze auf null, wenn keine Frames ausgewählt sind
            }
            this.updateHighlightFrameInput();
        },
    },
});
