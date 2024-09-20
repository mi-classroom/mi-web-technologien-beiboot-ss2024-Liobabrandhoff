import express from 'express';
import multer from 'multer';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import fs from 'fs';
import Jimp from 'jimp';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
//const upload = multer({ dest: 'uploads/' });

router.use(express.json());

// Erstelle den absoluten Pfad zum aktuellen Modul
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setze Speicher-Optionen für multer, um die Originalnamen der Dateien beizubehalten
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Zielverzeichnis für die Dateien
    },
    filename: (req, file, cb) => {
        // Behalte den Originalnamen der Datei bei
        cb(null, file.originalname);
    }
});

// Erstelle die multer-Instanz mit dem konfigurierten Speicher
const upload = multer({ storage: storage });


// Funktion zum Umbenennen der hochgeladenen Videodatei
const renameVideoFile = async (file, projectName) => {
    const newFilename = `${projectName}.mp4`;
    const newFilePath = path.join(__dirname, 'uploads', newFilename);
    await fs.promises.rename(file.path, newFilePath);
    return newFilename;
};

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const { projectName } = req.body;
        const newFilename = await renameVideoFile(req.file, projectName);
        res.json({ filename: newFilename });
    } catch (error) {
        console.error('Fehler beim Hochladen und Umbenennen der Datei:', error);
        res.status(500).send('Fehler beim Hochladen und Umbenennen der Datei.');
    }
});

router.post('/generate', async (req, res) => {
    const { filename, fps, projectName } = req.body;

    const videoPath = path.join(__dirname, `uploads/${filename}`);

    const framesFolderPath = path.join(__dirname, 'frontend', 'frames', projectName);

    try {
        await fs.promises.mkdir(framesFolderPath, { recursive: true });

        ffmpeg.setFfmpegPath(ffmpegStatic);

        ffmpeg()
            .input(videoPath)
            .fps(fps)
            .saveToFile(path.join(framesFolderPath, 'frame-%03d.png'))
            .on('progress', (progress) => {
                if (progress.percent) {
                    console.log(`Verarbeitung: ${Math.floor(progress.percent)}% abgeschlossen`);
                }
            })
            .on('end', async () => {
                const imageFiles = await fs.promises.readdir(framesFolderPath);
                const imageUrls = imageFiles.map(file => `frames/${projectName}/${file}`);

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

router.post('/combine', upload.array('images'), async (req, res) => {
    const files = req.files;
    const { projectName, highlightFrames, selectedFrames, highlightOpacity } = req.body;

    const highlightFramesArray = JSON.parse(highlightFrames); // Parse the JSON string
    const selectedFramesArray = JSON.parse(selectedFrames); // Parse the JSON string

    try {
        const highlightFramesSet = new Set(highlightFramesArray.map(Number));

        const loadedImages = await Promise.all(
            files.map(async file => {
                const image = await Jimp.read(file.path);
                image.filePath = file.path; // Füge den ursprünglichen Pfad als Eigenschaft hinzu
                return image;
            })
        );

        // Erstelle das kombinierte Bild mit den Dimensionen des ersten Bildes
        let combinedImage = new Jimp(loadedImages[0].bitmap.width, loadedImages[0].bitmap.height);

        // Füge die ausgewählten Frames hinzu und setze die Opazität entsprechend
        loadedImages.forEach((image) => {
            const imagePath = image.filePath;
            const imageNr = imagePath.split('-')[1].split('.')[0];
            // Entferne führende Nullen und wandle die Bildnummer in eine Zahl um
            const imageNrAsNumber = parseInt(imageNr, 10);

            if (highlightFramesSet.has(imageNrAsNumber)) {
                combinedImage = combinedImage.composite(image.opacity(parseFloat(highlightOpacity)), 0, 0);
            } else {
                combinedImage = combinedImage.composite(image.opacity(0.1), 0, 0);
            }

        });

        // Speichere das kombinierte Bild
        const combinedImagePath = path.join(__dirname, 'frontend', 'combined-image', `${projectName}.png`);
        await combinedImage.writeAsync(combinedImagePath);

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
