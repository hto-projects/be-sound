import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.get('/login', (req, res) => {
    const client_id = process.env.SPOTIFY_ID;
    // redirect to login to spotify
    res.redirect('https://accounts.spotify.com/authorize?' +
        JSON.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: 'user-read-playback-state',
            redirect_uri: 'http://localhost:26103/regData'
        }));
});

router.get('/regData', (req, res) => {
    // handle client data, after signed into spotify
    // should (after checks) register user to db and add to timer
    // for now don't register to db
    console.log(req);
});

export default router;