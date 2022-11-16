import * as database from './database.js';
import queryString from 'query-string';
import fetch from 'node-fetch';

const encoded = Buffer.from(process.env.SPOTIFY_ID + ':' + process.env.SPOTIFY_SECRET).toString('base64');

export const refreshInterval = async () => {
    const all = await database.db_findAll({});
    all.forEach(doc => {
        refreshToken(doc);
    });
};

export const notificationInterval = () => {
    console.log('notification example');
    // Make sure to separate sending notifications from actually re-checking player status
    // they should be separate functions
};

export const statusInterval = async () => {
    // for each user,
    // get their access key from database;
    // request player status from spotify api;
    // update player status on user document;
    // ---
    const all = await database.db_findAll({});
    all.forEach(doc => {
        checkStatus(doc);
    });
};

async function refreshToken(document) {
    const request = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        body: queryString.stringify({
            grant_type: 'refresh_token',
            refresh_token: document.spotifyData.refToken
        }),
        headers: {
            'Authorization': 'Basic ' + encoded,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    const reqJSON = await request.json();

    const properties = {
        $set: {
            spotifyData: {
                accToken: reqJSON.access_token,
                refToken: document.spotifyData.refToken
            }
        }
    };

    database.db_updateOne(document, properties);
}

async function checkStatus(document) {
    const userReq = await fetch('https://api.spotify.com/v1/me/player', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${document.spotifyData.accToken}`,
            'Content-Type': 'application/json'
        }
    });

    try {
        const userData = await userReq.json();
        var currentData = { albumName: userData.item.album.name, albumAuthor: userData.item.artists[0].name };
    }
    catch {
        currentData = null;
    }
    finally {
        // update status in database
        const properties = {
            $set: {
                isPlaying: currentData ? true : false
            }
        };

        database.db_updateOne(document, properties);
    }
}