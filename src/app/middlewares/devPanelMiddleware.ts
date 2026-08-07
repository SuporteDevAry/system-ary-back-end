import { NextFunction, Request, Response } from "express";
import { ForbiddenError } from "../helpers/api-errors";

const allowedEmails = (process.env.DEV_PANEL_ALLOWED_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export const devPanelMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = (req.user?.email ?? "").toLowerCase();

  if (!allowedEmails.includes(email)) {
    throw new ForbiddenError("Acesso restrito.");
  }

  next();
};
