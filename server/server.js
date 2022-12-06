import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './authRoutes.js';
import { MongoClient } from 'mongodb';
import { fileURLToPath } from 'url';
import path from 'path';

// must do this for es6 modules if you want __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const PORT = 2112;
const app = express();
const mongo = new MongoClient(process.env.MONGO_URI);

// IMPORTANT: Read Notes in authRoutes.js.

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', authRoutes);

// future, split into css and js folders
app.use(express.static(path.join((__dirname, '..', 'public'))));

app.get('/', (req, res) => {
    const retrievedData = req.query;
    res.render('landing', retrievedData);
});

function sendNotifs() {
    // should be called on an interval, sending notifs to registered db users
    console.log('Notif');
}

setInterval(sendNotifs, 10000);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));