import bcrypt from "bcryptjs";

const comparePassword = async (pass: string, hashedPassword: string) =>
  await bcrypt.compare(pass, hashedPassword);

export default comparePassword;
