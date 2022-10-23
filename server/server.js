import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const PORT = 26103;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', () => {
    console.log('Request recieved');
});

app.post('/regData', (req, res) => {
    // handle client data
    // should (after checks) register user to db and add to timer
    // needs to be sent on front end, so until then we'll just access test user data to test spotify api



});

function sendNotifs() {
    // should be called on an interval, sending notifs to registered db users
    // could also use separate intervals per user but this is simpler
}

setInterval(sendNotifs, 5000);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));