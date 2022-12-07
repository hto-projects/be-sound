import bcrypt from "bcrypt";
const saltRounds = 10;

export const hashPassword = async (input) => {
  const hash = await bcrypt.hash(input, saltRounds);
  return hash;
};

export const comparePassword = async (inputPassword, hash) => {
  const result = await bcrypt.compare(inputPassword, hash);
  return result;
};
