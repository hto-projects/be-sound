import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

router.post('/notifications', (req, res) => {
    console.log('Request from Evan and Matt :D');
    /*
    * Needs to link to user DB document,
    * for now maybe have them send a temp user object and just 
    * link to that in the DB. 
    */
    res.send(418);
});

export default router;