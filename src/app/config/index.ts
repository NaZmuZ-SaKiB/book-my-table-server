import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

export default {
  node_env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5050,
  jwt: {
    token_secret: process.env.JWT_TOKEN_SECRET,
    token_expiration: process.env.JWT_TOKEN_EXPIRES_IN,
  },
};
