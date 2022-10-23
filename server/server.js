import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './authRoutes.js';
import { fileURLToPath } from 'url';
import * as path from 'path'

// es6 modules need to do this to use __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const PORT = 26103;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', authRoutes);

app.get('/', (req, res) => {
    console.log('Request recieved');
    res.sendFile(path.join(__dirname, '..', 'client', 'landing.html'));
});

function sendNotifs() {
    // should be called on an interval, sending notifs to registered db users
    // could also use separate intervals per user but this is simpler
    console.log('interval time');
}

setInterval(sendNotifs, 10000);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));