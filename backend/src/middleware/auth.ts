import { Request, Response, NextFunction } from "express";
import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env.js";

export interface AuthenticatedUser {
  id: string;
  email: string;
  displayName: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      requestId?: string;
    }
  }
}

const LOCAL_DEMO_USER: AuthenticatedUser = {
  id: "local-user-id",
  email: "inspector@sitesentinel.local",
  displayName: "Lead Field Inspector",
};

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  // Zero-config local mode: auto-attach local demo user
  if (env.DATA_MODE === "local" || !env.SUPABASE_URL) {
    req.user = LOCAL_DEMO_USER;
    return next();
  }

  // Supabase mode: extract bearer token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      error: {
        code: "UNAUTHORIZED",
        message: "Missing or malformed Authorization header.",
        requestId: req.requestId,
      },
    });
    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY!);
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({
        error: {
          code: "UNAUTHORIZED",
          message: "Invalid or expired session token.",
          requestId: req.requestId,
        },
      });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email || "user@sitesentinel.io",
      displayName: user.user_metadata?.display_name || user.email?.split("@")[0] || "Inspector",
    };
    next();
  } catch (err: any) {
    res.status(401).json({
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication verification failed.",
        requestId: req.requestId,
      },
    });
  }
}
