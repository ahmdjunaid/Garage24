import { DecodedUser } from "./user";

declare global {
  namespace Express {
    export interface Request {
      user?: DecodedUser | null;
    }
  }
}
