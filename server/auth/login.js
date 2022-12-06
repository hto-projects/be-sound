import { Router } from "express";
import { hashPassword } from "../util/hash.js";
import { verifyFromInput, verifyFromSession } from "./authCheck.js";

const router = Router();

// API
router.post("/login", async (req, res) => {
  const body = req.body;

  //  refactor
  const user = { ...body };

  const found = await verifyFromInput(user);
  if (!found) return res.sendStatus(401);

  // if user is found
  req.session.user = found;
  res.sendStatus(418);
});

// Hosting
router.get("/login", (req, res) => {
  res.sendFile("login.html", { root: "./public" });
});

export default router;
