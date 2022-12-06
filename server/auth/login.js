import { Router } from "express";
import { verifyFromInput, verifyFromSession } from "./authCheck.js";

const router = Router();

// API
router.post("/login", async (req, res) => {
  const body = req.body;

  const user = { ...body };

  const found = await verifyFromInput(user);
  if (!found) return res.sendStatus(401);

  // if user is found
  req.session.user = found;
  res.redirect("/app/home");
});

// Hosting
router.get("/app/login", (req, res) => {
  res.sendFile("login.html", { root: "./public" });
});

export default router;
