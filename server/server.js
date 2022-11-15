import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './authRoutes.js';
import notifRoutes from './notifRoutes.js';
import { fileURLToPath } from 'url';
import path from 'path';
import { refreshInterval, notificationInterval } from './util/intervals.js';

// must do this for es6 modules if you want __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const PORT = 26103;
const app = express();

// IMPORTANT: Read Notes in authRoutes.js.

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', authRoutes);
app.use('/', notifRoutes);

// future, split into css and js folders
app.use(express.static(path.join((__dirname, '..', 'public'))));

app.get('/', (req, res) => {
    const retrievedData = req.query;
    res.render('landing', retrievedData);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

setInterval(refreshInterval, 2700000);// 45 minutes
setInterval(notificationInterval, 100000); // 100 seconds