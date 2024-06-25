new Vue({
    el: '#app',
    data: {
        selectedFile: null,
        projectName: '',
        fps: 10, // Standardwert
        generatedFrames: [],
        selectedFrames: [],
        frameInput: '',
        combinedImageUrl: ''
    },
    methods: {
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
                        })
                        .catch(error => {
                            console.error('Fehler bei der Generierung:', error);
                        });
                })
                .catch(error => {
                    console.error('Fehler beim Hochladen der Datei:', error);
                });
        },
        updateFrameInput() {
            const selectedIndices = this.selectedFrames.map(frame => {
                return this.generatedFrames.indexOf(frame) + 1;
            }).sort((a, b) => a - b);

            let ranges = [];
            let rangeStart = selectedIndices[0];

            for (let i = 1; i <= selectedIndices.length; i++) {
                if (selectedIndices[i] !== selectedIndices[i - 1] + 1) {
                    if (rangeStart === selectedIndices[i - 1]) {
                        ranges.push(rangeStart.toString());
                    } else {
                        ranges.push(`${rangeStart}-${selectedIndices[i - 1]}`);
                    }
                    rangeStart = selectedIndices[i];
                }
            }

            this.frameInput = ranges.join(', ');
        },
        updateSelectedFrames() {
            const frameRanges = this.frameInput.split(',').map(range => range.trim());
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

            this.selectedFrames = this.generatedFrames.filter((_, index) => indices.includes(index + 1));
        },
        async processSelectedFrames() {
            try {
                const formData = new FormData();
                formData.append('projectName', this.projectName);
                await Promise.all(this.selectedFrames.map(async (frame, index) => {
                    const response = await fetch(frame);
                    const blob = await response.blob();
                    formData.append('images', blob, `frame-${index}.png`);
                }));

                const response = await fetch('/api/combine', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();

                this.combinedImageUrl = data.imageUrl;
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
    },
});
