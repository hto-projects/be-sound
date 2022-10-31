import express from 'express';
import dotenv from 'dotenv';
import queryString from 'query-string';
import fetch from 'node-fetch';
dotenv.config();

const router = express.Router();
const redirect_uri = 'http://localhost:26103/regData';

router.get('/login', (req, res) => {
    // redirect to login to spotify
    // add random scope var for security
    res.redirect('https://accounts.spotify.com/authorize?' +
        queryString.stringify({
            response_type: 'code',
            client_id: process.env.SPOTIFY_ID,
            scope: 'user-read-playback-state',
            redirect_uri: redirect_uri
        }));
});

router.get('/regData', async (req, res) => {
    // handle code after signed into spotify
    // should (after error checks) register user to db and add to timer
    // for now don't register to db
    // add random scope check
    // remember to refresh token
    const encoded = new Buffer(process.env.SPOTIFY_ID + ':' + process.env.SPOTIFY_SECRET).toString('base64');
    fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        body: queryString.stringify({
            grant_type: 'authorization_code',
            code: req.query.code,
            redirect_uri: redirect_uri
        }),
        headers: {
            'Authorization': 'Basic ' + encoded,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(async r => {
        console.log(await r.json());
    });
});

function refreshToken(code) {
    console.log("refresh");
}

export default router;