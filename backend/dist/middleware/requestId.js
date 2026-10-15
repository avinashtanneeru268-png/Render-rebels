import { v4 as uuidv4 } from "uuid";
export function requestIdMiddleware(req, res, next) {
    const reqId = req.headers["x-request-id"] || `req_${uuidv4().substring(0, 8)}`;
    req.requestId = reqId;
    res.setHeader("x-request-id", reqId);
    next();
}
//# sourceMappingURL=requestId.js.map