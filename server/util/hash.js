import bcrypt from "bcrypt";
const saltRounds = 10;

export const hashPassword = async (input) => {
  const hash = await bcrypt.hash(input, saltRounds);
  return hash;
};
