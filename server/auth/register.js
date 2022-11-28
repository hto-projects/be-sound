import { Router } from "express";

const router = Router();

// API
router.post('/registerUser', (req, res) => {
    /* Extract body from request.
    * Encrypt password using salt.
    * Create info object.
    * Save info object to DB.
    * Redirect user to homepage.
    */
});

export default router;