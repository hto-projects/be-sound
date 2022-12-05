import { db_findOne } from "../util/database.js";

export const verifyFromInput = (inputUser) => {
  const found = db_findOne(inputUser);
  return found ? found : false;
};

export const verifyFromSession = (inputSession) => {
  return null;
};
