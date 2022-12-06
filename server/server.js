import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import notifRoutes from "./routes/notifRoutes.js";
import homeRoute from "./routes/homeRoutes.js";
import registerRoute from "./auth/register.js";
import loginRoute from "./auth/login.js";
import { fileURLToPath } from "url";
import path from "path";
import * as intervals from "./util/intervals.js";
import session from "express-session";
import MongoStore from "connect-mongo";

// must do this for es6 modules if you want __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const PORT = 26103;
const app = express();

// Set up routing and templating
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", authRoutes);
app.use("/", notifRoutes);
app.use("/app", homeRoute);
app.use("/", registerRoute);
app.use("/", loginRoute);

// Set up sessions and MongoDB
app.use(
  session({
    secret: process.env.MONGO_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
  })
);

// future, split into css and js folders
app.use(express.static(path.join((__dirname, "..", "public"))));

app.get("/", (req, res) => {
  const retrievedData = req.query;
  res.render("landing", retrievedData);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

setInterval(intervals.refreshInterval, 2700000); // 45 minutes
setInterval(intervals.notificationInterval, 100000); // 100 seconds
setInterval(intervals.statusInterval, 60000); // 1 minute
