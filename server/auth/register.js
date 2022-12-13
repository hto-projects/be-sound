import { Router } from "express";
import { db_createUser } from "../util/database.js";
import { hashPassword } from "../util/hash.js";

const router = Router();

// API
router.post("/app/register", (req, res) => {
  const body = req.body;

  hashPassword(body.password).then((hashed_password) => {
    const userObject = {
      isPlaying: false,
      spotifyData: {},
      notifObj: {},
      authData: {
        username: body.username,
        hashed_password,
        email: body.email,
        friends: null,
      },
      latestPost: null,
    };

    db_createUser(userObject);
    req.session.user = userObject;
    req.session.save();
  });
  res.redirect("/login");
});

// Hosting
router.get("/app/register", (req, res) => {
  res.sendFile("register.html", { root: "./public" });
});

export default router;
