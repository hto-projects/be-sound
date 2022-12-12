import express from "express";
import * as database from "../util/database.js";

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

router.post("/api/newPost", async (req, res) => {
  const user = req.session.user;

  console.log(user);
  res.sendStatus(200);
});

export default router;
