import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const PORT = 26103;
const app = express();

app.get('/', () => {
    console.log('Request recieved');
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));