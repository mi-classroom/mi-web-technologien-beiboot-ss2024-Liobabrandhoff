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