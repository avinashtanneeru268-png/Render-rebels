import { Request, Response, NextFunction } from "express";
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
export declare function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=auth.d.ts.map