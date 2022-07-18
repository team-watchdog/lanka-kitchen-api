import { Request } from "express-jwt";

export interface AuthenticatedRequest extends Request {
    user: {
        id: number;
        userRoles: number[];
        organizationId: number;
    };
}