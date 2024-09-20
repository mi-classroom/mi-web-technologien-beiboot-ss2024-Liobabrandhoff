import express from 'express';
import multer from 'multer';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import fs from 'fs';
import Jimp from 'jimp';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
router.use(express.json());

// Erstelle den absoluten Pfad zum aktuellen Modul
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setze Speicher-Optionen für multer, um die Originalnamen der Dateien beizubehalten
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Zielverzeichnis für hochgeladene Dateien
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Behalte den Originalnamen bei
    }
});

// Erstelle die multer-Instanz mit dem konfigurierten Speicher
const upload = multer({ storage: storage });


// Funktion zum Umbenennen der hochgeladenen Videodatei
const renameVideoFile = async (file, projectName) => {
    const newFilename = `${projectName}.mp4`; // Neuer Dateiname basierend auf dem Projektnamen
    const newFilePath = path.join(__dirname, 'uploads', newFilename); // Pfad zur Datei
    await fs.promises.rename(file.path, newFilePath); // Dateipfad umbenennen
    return newFilename;
};

// Hochladen und Umbenennen der Videodatei
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const { projectName } = req.body; // Hole den Projektnamen aus dem Request-Body
        const newFilename = await renameVideoFile(req.file, projectName); // Aufruf der Funktion 'renameVideoFile', um die Datei umzubenennen
        res.json({ filename: newFilename }); // Rückgabe des neuen Dateinamens
    } catch (error) {
        console.error('Fehler beim Hochladen und Umbenennen der Datei:', error);
        res.status(500).send('Fehler beim Hochladen und Umbenennen der Datei.');
    }
});

// Generieren von Frames aus einem Video
router.post('/generate', async (req, res) => {
    const { filename, fps, projectName } = req.body; // Hole benötigte Parameter zum Generieren aus dem Request-Body
    const videoPath = path.join(__dirname, `uploads/${filename}`); // Pfad zum Video
    const framesFolderPath = path.join(__dirname, 'frontend', 'frames', projectName); // Pfad, wo Frames gespeichert werden sollen

    try {
        await fs.promises.mkdir(framesFolderPath, { recursive: true });  // Erstelle das Verzeichnis für die Frames, falls es nicht existiert

        ffmpeg.setFfmpegPath(ffmpegStatic);

        ffmpeg()
            .input(videoPath) // Video für die Generierung
            .fps(fps) // FPS-Wert für die Generierung
            .saveToFile(path.join(framesFolderPath, 'frame-%03d.png')) // Speichere die Frames als PNG-Dateien
            .on('progress', (progress) => {
                if (progress.percent) {
                    console.log(`Verarbeitung: ${Math.floor(progress.percent)}% abgeschlossen`);
                }
            })
            .on('end', async () => {
                const imageFiles = await fs.promises.readdir(framesFolderPath); // Lesen der generierten Frames
                const imageUrls = imageFiles.map(file => `frames/${projectName}/${file}`); // Erstellung der URLs für die Frames

                res.json({ imageUrls });
            })
            .on('error', (error) => {
                console.error('Fehler bei der Verarbeitung des Videos:', error);
                res.status(500).send('Fehler bei der Verarbeitung des Videos.');
            });

    } catch (err) {
        console.error('Fehler beim Generieren der Frames:', err);
        res.status(500).send('Fehler beim Generieren der Frames.');
    }
});

// Kombinieren der ausgewählten Frames mit möglicher Hervorhebung von einzelnen Frames
router.post('/combine', upload.array('images'), async (req, res) => {
    const files = req.files; // Hole die hochgeladenen Dateien
    const { projectName, highlightFrames, highlightOpacity } = req.body; // Hole benötigte Parameter zum Kombinieren aus dem Request-Body

    // Erstelle ein Set mit den hervorgehobenen Frames. Die highlightFrames sind JSON-Strings, die in einen Array umgewandelt werden müssen. Die Zahlen im Array werden durch `map(Number)` in echte Zahlen (numerische Werte) konvertiert.
    const highlightFramesSet = new Set(JSON.parse(highlightFrames).map(Number));

    try {
        // Lade alle hochgeladenen Bilder und behalte ihre Pfade
        const loadedImages = await Promise.all(
            files.map(async file => {
                const image = await Jimp.read(file.path); // Bilddatei lesen
                image.filePath = file.path; // Füge den ursprünglichen Pfad als Eigenschaft hinzu
                return image; // Rückgabe des Bildes
            })
        );

        // Erstelle das kombinierte Bild mit den Dimensionen des ersten Bildes
        let combinedImage = new Jimp(loadedImages[0].bitmap.width, loadedImages[0].bitmap.height);

        // Füge die ausgewählten Frames hinzu und setze die Opazität entsprechend
        loadedImages.forEach((image) => {
            // Extrahiere die Bildnummer aus dem Dateinamen und entferne führende Nullen
            const imageNr = parseInt(image.filePath.split('-')[1].split('.')[0], 10);

            // Setze die Opazität, je nach dem, ob der Frame hervorgehoben werden soll oder nicht
            if (highlightFramesSet.has(imageNr)) {
                combinedImage = combinedImage.composite(image.opacity(parseFloat(highlightOpacity)), 0, 0);
            } else {
                combinedImage = combinedImage.composite(image.opacity(0.1), 0, 0);
            }

        });

        // Speichere das kombinierte Bild
        const combinedImagePath = path.join(__dirname, 'frontend', 'combined-image', `${projectName}.png`); // Pfad für das kombinierte Bild
        await combinedImage.writeAsync(combinedImagePath); // Speichere das kombinierte Bild als PNG im angegebenen Pfad

        // Lösche die hochgeladenen Dateien nach der Verarbeitung, außer dem Video
        await Promise.all(
            files.map(file => fs.promises.unlink(file.path))
        );

        // Rückgabe des Pfades zum kombinierten Bild
        res.json({ imageUrl: `/combined-image/${projectName}.png` });

    } catch (err) {
        console.error('Fehler beim Bearbeiten der Bilder:', err);
        res.status(500).send('Fehler beim Bearbeiten der Bilder.');
    }
})

export default router;
