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

/* NOTES:
    Needs refactored. I will after the demo, here's a list.
    - regData() should basically only store accToken/refToken
      to database, error checking/scope check needs added.
    - refreshToken() should only update the keys in the database.
    
server.js:
    - Needs minimum two interval functions: one for refreshing tokens,
    and one for sending notifications. Probably move refreshToken() to server.js.
    - Maybe re-render interval as well? If we plan to keep the info
    on the site.
    - Need to link Push API to server, do that after demo probably. Will
    need to retrieve PushSubscription to DB after giving permission,
    then send Push Request to browser Push Service.
*/


router.get('/login', (req, res) => {
    // redirect to login to spotify
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
    // should (after error checks) register user to db
    // for now don't register to db

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
    // for now, just do this entirely in this function
    setInterval(refreshToken, 3600);

    const userReq = await fetch('https://api.spotify.com/v1/me/player', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accToken}`,
            'Content-Type': 'application/json'
        }
    });

    try {
        const userData = await userReq.json();
        const currentData = { albumName: userData.item.album.name, albumAuthor: userData.item.artists[0].name };
        var query = queryString.stringify(currentData);
    }
    catch {
        console.log('Not listening to anything');
        query = null;
    }
    finally {
        res.redirect('/?' + query);
    }
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