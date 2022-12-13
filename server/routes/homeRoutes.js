import { Router } from "express";

const router = Router();

router.get("/home", (req, res) => {
  res.sendFile("app.html", { root: "./public" });
});

export default router;
