import express from 'express';
import multer from 'multer';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import fs from 'fs';
import Jimp from 'jimp';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.use(express.json());

// Erstelle den absoluten Pfad zum aktuellen Modul
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    const { projectName, highlightFrames, selectedFrames } = req.body;

    const highlightFramesArray = JSON.parse(highlightFrames); // Parse the JSON string
    const selectedFramesArray = JSON.parse(selectedFrames); // Parse the JSON string

    console.log('Highlight Frames Received:', highlightFramesArray); // Debugging-Information
    console.log('Selected Frames Received:', selectedFramesArray); // Debugging-Information

    try {
        const highlightFramesSet = new Set(highlightFramesArray.map(Number));
        const selectedFramesSet = new Set(selectedFramesArray.map(Number));

        // Lade alle Bilder
        const loadedImages = await Promise.all(
            files.map(file => Jimp.read(file.path))
        );

        // Erstelle das kombinierte Bild mit den Dimensionen des ersten Bildes
        let combinedImage = new Jimp(loadedImages[0].bitmap.width, loadedImages[0].bitmap.height);

        // Füge die ausgewählten Frames hinzu und setze die Opazität entsprechend
        loadedImages.forEach((image, index) => {
            const frameIndex = index + 1;
            if (selectedFramesSet.has(frameIndex)) {
                if (highlightFramesSet.has(frameIndex)) {
                    console.log(frameIndex)
                    combinedImage = combinedImage.composite(image.opacity(0.6), 0, 0);
                } else {
                    //const opacity = 1 / selectedFramesArray.length;
                    //combinedImage = combinedImage.composite(image.opacity(opacity), 0, 0);
                    combinedImage = combinedImage.composite(image.opacity(0.1), 0, 0);
                }
            }
        });


        // Setze die Opazität jedes Bildes auf 5% und füge sie dem Array hinzu
        //const images = loadedImages.map(image => image.opacity(0.05));

        // Erstelle das kombinierte Bild
        //let combinedImage = images.reduce((prev, current) => prev.composite(current, 0, 0), images.shift());

        // Füge die hervorgehobenen Frames hinzu
        /*for (let i = 0; i < loadedImages.length; i++) {
            if (highlightFramesSet.has(i + 1)) {
                combinedImage = combinedImage.composite(loadedImages[i].opacity(0.95), 0, 0); // Setze die Opazität auf 100%
            }
        }*/
        /*for (let i = 0; i < highlightFramesSet.length; i++) {
            if (highlightFramesSet.has(i + 1)) {
                console.log(highlightFramesSet)
                // Bild duplizieren und anpassen
                let highlightedFrame = highlightFramesSet[i].clone().opacity(1);
                console.log(highlightedFrame)
                // Füge das hervorgehobene Bild dem kombinierten Bild hinzu
                combinedImage = combinedImage.composite(highlightedFrame, 0, 0);
            }
        }*/

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
