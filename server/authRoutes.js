import express from 'express';
import dotenv from 'dotenv';
import queryString from 'query-string';
import fetch from 'node-fetch';
dotenv.config();

const router = express.Router();
const redirect_uri = 'http://localhost:26103/regData';

const encoded = Buffer.from(process.env.SPOTIFY_ID + ':' + process.env.SPOTIFY_SECRET).toString('base64');

/* NOTES:
    Needs refactored. I will after the demo, here's a list.
    
server.js:
    - Maybe re-render interval as well? If we plan to keep the info
    on the site.
    - Need to link Push API to server, do that after demo probably. Will
    need to retrieve PushSubscription to DB after giving permission,
    then send Push Request to browser Push Service.
*/


router.get('/login', (req, res) => {
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
    database.db_createUser({
        isPlaying: false,
        spotifyData: {
            accToken: reqJSON.access_token,
            refToken: reqJSON.refresh_token
        },
        notifObj: {
            // notifications aren't set up yet, so this is a placeholder
            endpoint: false
        }
    });

    const query = await fetchDataAsQuery(reqJSON.access_token);
    res.redirect('/?' + query);
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
}

export default router;