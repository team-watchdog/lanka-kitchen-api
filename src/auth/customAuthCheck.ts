import { AuthChecker } from "type-graphql";

import { AuthenticatedRequest } from "./auth.types";
import { isActionAllowed } from "./permissions";

export const customAuthCheck: AuthChecker<AuthenticatedRequest> = ({ context }, action) => {
    if (!context.user) return false;
    
    // scope authorization
    let actionScope;
    if (action && action.length > 0) actionScope = action[0];
    if (actionScope) return isActionAllowed(actionScope, context.user.userRoles);
    
    return true;
}