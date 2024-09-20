import express from 'express';
import videoToFramesRoute from './videoToFrames.js'

const app = express(); // Erstelle eine neue Express-Anwendung
const port = 8000; // Setze den Port, auf dem der Server laufen soll

app.use(express.static("frontend")); // Stelle sicher, dass Dateien aus dem Ordner "frontend" (wie HTML, CSS, JS) öffentlich zugänglich sind
app.use('/api', videoToFramesRoute); // Verwende die Routen aus `videoToFramesRoute` unter dem Pfad '/api' für die API-Endpunkte

// Starte den Server und höre auf dem festgelegten Port (8000)
app.listen(port, () => {
    console.log("app listen on port", port)
})