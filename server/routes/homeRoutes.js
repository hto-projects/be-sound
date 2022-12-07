import { Router } from "express";

const router = Router();

router.get("/home", (req, res) => {
  console.log(req.session.user);
  res.send("hi!");
});

export default router;
