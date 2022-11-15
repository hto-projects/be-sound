import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

router.post('/notifications', (req, res) => {
    console.log('Request from Evan and Matt :D');
    res.send(418);
});

export default router;