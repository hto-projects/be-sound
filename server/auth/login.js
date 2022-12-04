import { Router } from "express";

const router = Router();

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
