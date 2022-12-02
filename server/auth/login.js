import { Router } from "express";
import { db_createUser } from "../util/database.js";
import bcrypt from "bcrypt";

const router = Router();
const saltRounds = 10;

// API
router.post("/login", (req, res) => {
  const body = res.body;

  res.sendStatus(418);
});

// Hosting
router.get("/login", (req, res) => {
  res.sendFile("login.html", { root: "./public" });
});

export default router;
