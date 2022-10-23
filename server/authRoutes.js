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
    // needs to be sent on front end, so until then we'll just access test user data to test spotify api
    console.log(req);
});

export default router;