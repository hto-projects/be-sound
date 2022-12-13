import express from "express";
import * as database from "../util/database.js";
import { checkStatus } from "../util/intervals.js";

const router = express.Router();

router.post("/api/newSubscription", async (req, res) => {
  const PushSubscription = req.body;
  const user = req.session.user;

  const userDoc = await database.db_findOne({
    "authData.username": user.authData.username,
  });

  const newProperties = {
    $set: {
      notifObj: PushSubscription,
    },
  };
  const result = await database.db_updateOne(userDoc, newProperties);
  console.log("Updated: " + result.modifiedCount + " PushSubscription(s)");

  const updatedUser = await database.db_findOne({
    "authData.username": user.authData.username,
  });

  req.session.user = updatedUser;
  req.session.save();

  res.sendStatus(200);
});

router.get("/api/newPost", async (req, res) => {
  const user = req.session.user;
  const userDoc = await database.db_findOne({
    "authData.username": user.authData.username,
  });
  const rawData = await checkStatus(userDoc);
  const currentData = {
    username: user.authData.username,
    albumName: rawData.item.album.name,
    albumAuthor: rawData.item.artists[0].name,
  };
  res.json(currentData);
});

router.post("/api/newPost", async (req, res) => {
  const user = req.session.user;
  const userDoc = await database.db_findOne({
    "authData.username": user.authData.username,
  });

  const rawData = await checkStatus(userDoc);

  const newProperties = {
    $set: {
      latestPost: {
        username: user.authData.username,
        time: req.body.time,
        albumName: rawData.item.album.name,
      },
    },
  };
  await database.db_updateOne(userDoc, newProperties);

  res.sendStatus(200);
});

router.get("/api/getPosts", async (req, res) => {
  const user = req.session.user;
  const userDoc = await database.db_findOne({
    "authData.username": user.authData.username,
  });
  const friends = userDoc.authData.friends;
  let posts = [];

  if (friends == null || !friends) {
    posts.push(userDoc.latestPost);
    return res.send(posts);
  }

  posts.push(userDoc.latestPost);
  for (let i = 0; i < friends.length; i++) {
    let friend = friends[i];
    // REMEMBER TO SAVE SESSION
    const doc = await database.db_findOne({ "authData.username": friend });
    const friendPost = doc.latestPost;
    posts.push(friendPost);
  }

  res.send(posts);
});

export default router;
