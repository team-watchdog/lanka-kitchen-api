export interface UserRole{
    id: number;
    label: string;
    description: string;
    allowedActions: string[];
}

export const UserRoles: UserRole[] = [
    {
        id: 1,
        label: "Super Admin",
        description: "Super Admin user",
        allowedActions: [
            "me.read",
            "me.update",
            "organization.read",
            "organization.update",
            "organization.manageMembers",
            "organization.manageRequests",
            "organization.moderate",
        ]
    },
    {
        id: 2,
        label: "Admin",
        description: "Admin user",
        allowedActions: [
            "me.read",
            "me.update",
            "organization.read",
            "organization.update",
            "organization.manageMembers",
            "organization.manageRequests",
        ]
    },
    {
        id: 3,
        label: "User",
        description: "Normal user",
        allowedActions: [
            "me.read",
            "me.update",
            "organization.read",
            "organization.update",
            "organization.manageRequests",
        ]
    }
]
