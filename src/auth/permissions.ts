import { UserRoles } from "./config";
export * from "./config";

export const getUserPermissions = (userRole: number) => {
    const userRoleDef = UserRoles.find(ur => ur.id === userRole);
    
    if (!userRoleDef) return [];
    return userRoleDef.allowedActions;
}

export const getAllAllowedActions = (userRoles: number[]): string[] => {
    let actionsSet = new Set<string>([]);

    for (let userRole of userRoles) {
        const allowedActions = getUserPermissions(userRole);
        actionsSet = new Set([...actionsSet, ...(new Set<string>(allowedActions))]);
    }
    return Array.from(actionsSet.values());
}

export const isActionAllowed = (action: string, userRoles: number[]) => {
    let actionsSet = new Set<string>([]);

    for (let userRole of userRoles) {
        const allowedActions = getUserPermissions(userRole);
        actionsSet = new Set([...actionsSet, ...(new Set<string>(allowedActions))]);
    }
    return actionsSet.has(action);
}