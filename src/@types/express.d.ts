import { User } from "../app/entities/User";

declare global {
  namespace Express {
    export interface Request {
      user: Partial<User>;
    }
  }
}
