import { Router } from "express";
import { db_createUser } from "../util/database.js";
import bcrypt from 'bcrypt';

const router = Router();
const saltRounds = 10;

// API
router.post('/registerUser', (req, res) => {
    /* Extract body from request.
    * Encrypt password using salt.
    * Create info object.
    * Save info object to DB.
    * Redirect user to homepage.
    */
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
            }
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