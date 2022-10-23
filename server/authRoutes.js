import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.get('/login', (req, res) => {
    res.send('login');
});

router.post('/regData', (req, res) => {
    // handle client data, after signed into spotify
    // should (after checks) register user to db and add to timer
    // for now don't register to db
    console.log(req);
});

export default router;