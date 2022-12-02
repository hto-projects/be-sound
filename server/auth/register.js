import { Router } from "express";
import { db_createUser } from "../util/database.js";
import bcrypt from "bcrypt";

const router = Router();
const saltRounds = 10;

// API
router.post("/registerUser", (req, res) => {
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
    };

    db_createUser(userObject);
  });
  res.sendStatus(418);
});

async function hashPassword(input) {
  const hash = await bcrypt.hash(input, saltRounds);
  return hash;
}

export default router;

