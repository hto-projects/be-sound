import * as database from './database.js';
import queryString from 'query-string';
import fetch from 'node-fetch';

const encoded = Buffer.from(process.env.SPOTIFY_ID + ':' + process.env.SPOTIFY_SECRET).toString('base64');

export const refreshInterval = async () => {
    // this really isn't the best way to do this especially with a higher userbase
    // but for now, it's fine for our needs
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