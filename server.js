import express from 'express';
import videoToFramesRoute from './videoToFrames.js'

const app = express();
const port = 8000;

app.use(express.static("frontend"));
app.use('/api', videoToFramesRoute);

app.listen(port, () => {
    console.log("app listen on port", port)
})


app.post('/', (req, res) => {
    console.log("Hello World")
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

/*app.get('/video-to-frames', async (req, res) => {

    // Tell fluent-ffmpeg where it can find FFmpeg
    ffmpeg.setFfmpegPath(ffmpegStatic);

    // Run FFmpeg
    ffmpeg()

        // Input file
        .input('videos/IMG_2940_mini.mp4')

        // Optional: Extract the frames at this frame rate
        .fps(10)

        // Output file format. Frames are stored as frame-001.png, frame-002.png, frame-003.png, etc.
        .saveToFile('frames/frame-%03d.png')

        // Log the percentage of work completed
        .on('progress', (progress) => {
            if (progress.percent) {
                console.log(`Processing: ${Math.floor(progress.percent)}% done`);
            }
        })

        // The callback that is run when FFmpeg is finished
        .on('end', () => {
            console.log('FFmpeg has finished.');


            const folderPath = 'frames';
            const images = []; // Array zum Speichern der geladenen Bilder

            // Alle Bilder im Ordner laden
            fs.readdir(folderPath, (err, files) => {
                if (err) {
                    console.error('Fehler beim Lesen des Ordners:', err);
                    return;
                }

                // Filtere nur Bilddateien (png, jpg, etc.)
                const imageFiles = files.filter(file => /\.(png|jpg|jpeg)$/i.test(file));

                // Lade alle Bilder
                Promise.all(
                    imageFiles.map(file => Jimp.read(path.join(folderPath, file)))
                )
                    .then(loadedImages => {
                        loadedImages.forEach(image => {
                            image.opacity(0.05); // 5% Opazität
                            images.push(image); // Füge das bearbeitete Bild zum Array hinzu
                        });

                        // Erstelle das kombinierte Bild
                        const combinedImage = images.reduce((prev, current) => prev.composite(current, 0, 0), images.shift());
                        console.log('Alle Bilder erfolgreich reduziert und kombiniert.');
                        return combinedImage.writeAsync('combined_image3.png');
                    })
                    .catch(err => {
                        console.error('Fehler beim Bearbeiten der Bilder:', err);
                    });
            });


            /* ====================== Sharp ===============
            // Lade die Bilder als Buffer
            const image1Buffer = fs.readFileSync('frames/frame-001.png');
            const image2Buffer = fs.readFileSync('frames/frame-010.png');


            // Überlagere die Bilder
            sharp(image1Buffer)
                .composite([{
                    input: image2Buffer,
                    gravity: 'centre',
                    //raw: {width: metadata.width, height: metadata.height, channels: 3}
                }])
                .toFile('ergebnis.jpg', (err, info) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log('Bilder erfolgreich überlagert. Ergebnis: ', info);
                    }
                });

            ==================

        })

        // The callback that is run when FFmpeg encountered an error
        .on('error', (error) => {
            console.error(error);
        });
});*/