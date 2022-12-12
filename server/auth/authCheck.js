import { db_findOne } from "../util/database.js";
import { comparePassword } from "../util/hash.js";

export const verifyFromInput = async (inputUser) => {
  const found = await db_findOne({ "authData.username": inputUser.username });
  // have to check if retrieved password equals input user
  const isSamePassword = comparePassword(
    inputUser.password,
    found.authData.hashed_password
  );
  return found && isSamePassword ? found : false;
};

export const loginCheck = async (req, res, next) => {
  if (req.path == "/login" || req.path == "/register") {
    return next();
  }

  const found = await db_findOne({
    "authData.hashed_password": req.session.user.authData.hashed_password,
  });

  if (found) return next();
  else return res.redirect("/app/login");
};
