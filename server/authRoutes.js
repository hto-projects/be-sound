import express from 'express';
import dotenv from 'dotenv';
import queryString from 'query-string';
dotenv.config();

const router = express.Router();
const redirect_uri = 'http://localhost:26103/regData';

router.get('/login', (req, res) => {
    // redirect to login to spotify
    res.redirect('https://accounts.spotify.com/authorize?' +
        queryString.stringify({
            response_type: 'code',
            client_id: process.env.SPOTIFY_ID,
            scope: 'user-read-playback-state',
            redirect_uri: redirect_uri
        }));
});

router.get('/regData', (req, res) => {
    // handle code after signed into spotify
    // should (after checks) register user to db and add to timer
    // for now don't register to db
    // remember to refresh token
    console.log(req.query.code);
});

export default router;