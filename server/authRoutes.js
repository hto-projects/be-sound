import express from 'express';
import dotenv from 'dotenv';
import queryString from 'query-string';
import fetch from 'node-fetch';
dotenv.config();

const router = express.Router();
const redirect_uri = 'http://localhost:26103/regData';
let encoded;
let accToken;
let refToken;
// definitely not good to have these globals, refactor later

// IMPORTANT: needs refactored. should store access accToken and refToken
// then the server should call a function refreshing them every so often
// this way the notif function will actually have a key to use.

router.get('/login', (req, res) => {
    // redirect to login to spotify
    // add random scope var for security
    res.redirect('https://accounts.spotify.com/authorize?' +
        queryString.stringify({
            response_type: 'code',
            client_id: process.env.SPOTIFY_ID,
            scope: 'user-read-playback-state',
            redirect_uri: redirect_uri,
            show_dialog: true
        }));
});

router.get('/regData', async (req, res) => {
    // handle code after signed into spotify
    // should (after error checks) register user to db and add to timer
    // for now don't register to db
    // add random scope check

    // this is not the best code, i won't lie
    encoded = new Buffer(process.env.SPOTIFY_ID + ':' + process.env.SPOTIFY_SECRET).toString('base64');
    const request = await fetch('https://accounts.spotify.com/api/token', {
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
    });
    const reqJSON = await request.json();
    accToken = reqJSON.access_token;
    refToken = reqJSON.refresh_token;
    // see above IMPORTANT COMMENT
    setInterval(refreshToken, 3600);
    res.redirect('/');
});

async function refreshToken() {
    const request = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        body: queryString.stringify({
            grant_type: 'refresh_token',
            refresh_token: refToken
        }),
        headers: {
            'Authorization': 'Basic ' + encoded,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    const reqJSON = await request.json();
    accToken = reqJSON.access_token;
    refToken = reqJSON.refresh_token;
    // the least pure function i've ever written 😔
}

export default router;