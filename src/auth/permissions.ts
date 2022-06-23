export const UserRoles = [
    {
        id: 1,
        label: "Admin",
        description: "Admin user",
        allowedActions: [
            "me.read",
            "me.update",
            "organization.read",
            "organization.update",
            "organization.manageMembers",
        ]
    },
    {
        id: 2,
        label: "User",
        description: "Normal user",
        allowedActions: [
            "me.read",
            "me.update",
            "organization.read",
            "organization.update",
        ]
    }
]

export const getUserPermissions = (userRole: number) => {
    const userRoleDef = UserRoles.find(ur => ur.id === userRole);
    
    if (!userRoleDef) return [];
    return userRoleDef.allowedActions;
}

export const isActionAllowed = (action: string, userRoles: number[]) => {
    let actionsSet = new Set<string>([]);

    for (let userRole of userRoles) {
        const allowedActions = getUserPermissions(userRole);
        actionsSet = new Set([...actionsSet, ...(new Set<string>(allowedActions))]);
    }
    return actionsSet.has(action);
}