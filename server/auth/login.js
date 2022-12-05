import { Router } from "express";
import { hashPassword } from "../util/hash.js";
import { verifyFromInput } from "./authCheck.js";

const router = Router();

// API
router.post("/login", (req, res) => {
  const body = req.body;

  const user = { ...body };
  hashPassword(user.password).then((hashed_password) => {
    user.password = hashed_password;

    const found = verifyFromInput(user).then((aef) => console.log(aef));
  });

  res.sendStatus(418);
});

// Hosting
router.get("/login", (req, res) => {
  res.sendFile("login.html", { root: "./public" });
});

export default router;
