import * as database from './database.js';
import queryString from 'query-string';
import fetch from 'node-fetch';

const encoded = Buffer.from(process.env.SPOTIFY_ID + ':' + process.env.SPOTIFY_SECRET).toString('base64');

export const refreshInterval = async () => {
    const all = await database.db_findAll({});
    all.forEach(doc => {
        const statusData = refreshToken(doc);

        const properties = {
            $set: {
                spotifyData: {
                    accToken: statusData.access_token,
                    refToken: doc.spotifyData.refToken
                }
            }
        };

        database.db_updateOne(doc, properties);
    });
};

export const notificationInterval = () => {
    console.log('notification example');
};

export const statusInterval = async () => {
    const all = await database.db_findAll({});
    all.forEach(doc => {
        const rawData = checkStatus(doc);
        const currentData = { albumName: rawData.item.album.name, albumAuthor: rawData.item.artists[0].name };

        const properties = {
            $set: {
                isPlaying: currentData ? true : false
            }
        };

        database.db_updateOne(doc, properties);
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

    return reqJSON;

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
        return userData;
    }
    catch {
        return null;
    }
}