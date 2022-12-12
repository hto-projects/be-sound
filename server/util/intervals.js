import * as database from "./database.js";
import queryString from "query-string";
import fetch from "node-fetch";
import dotenv from "dotenv";
import webpush from "web-push";

dotenv.config();
webpush.setVapidDetails(
  "mailto:kissellogan10@gmail.com",
  process.env.VAPID_PUBLIC,
  process.env.VAPID_PRIVATE
);

const encoded = Buffer.from(
  process.env.SPOTIFY_ID + ":" + process.env.SPOTIFY_SECRET
).toString("base64");

export const refreshInterval = async () => {
  const all = await database.db_findAll({});
  all.forEach((doc) => {
    const statusData = refreshToken(doc);

    const properties = {
      $set: {
        spotifyData: {
          accToken: statusData.access_token,
          refToken: doc.spotifyData.refToken,
        },
      },
    };

    database.db_updateOne(doc, properties);
  });
};

export const notificationInterval = async () => {
  console.log("notification example");
  const all = await database.db_findAll({
    isPlaying: true,
    "notifObj.endpoint": { $exists: true },
  });
  all.forEach((doc) => {
    sendNotification(doc);
  });
};

export const statusInterval = async () => {
  const all = await database.db_findAll({});
  all.forEach(async (doc) => {
    const rawData = await checkStatus(doc);
    let currentData;
    try {
      currentData = rawData.item
        ? {
            albumName: rawData.item.album.name,
            albumAuthor: rawData.item.artists[0].name,
          }
        : false;
    } catch {
      currentData = false;
    } finally {
      const properties = {
        $set: {
          isPlaying: currentData ? true : false,
        },
      };

      database.db_updateOne(doc, properties);
    }
  });
};

async function sendNotification(document) {
  const PushSubscription = document.notifObj;
  console.log(PushSubscription);
  webpush.sendNotification(PushSubscription);
}

async function refreshToken(document) {
  const request = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    body: queryString.stringify({
      grant_type: "refresh_token",
      refresh_token: document.spotifyData.refToken,
    }),
    headers: {
      Authorization: "Basic " + encoded,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  const reqJSON = await request.json();

  return reqJSON;
}

export async function checkStatus(document) {
  const userReq = await fetch("https://api.spotify.com/v1/me/player", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${document.spotifyData.accToken}`,
      "Content-Type": "application/json",
    },
  });

  try {
    const userData = await userReq.json();
    return userData;
  } catch {
    return null;
  }
}
