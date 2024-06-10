import { ROLE } from "@prisma/client";

export type TPayloadUser = {
  id: number;
  email: string;
  role: ROLE;
};

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}

declare module "jsonwebtoken" {
  export interface JwtPayload extends TPayloadUser {}
}
