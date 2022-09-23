import { Authorized, FieldResolver, Resolver, Root } from "type-graphql";

// types
import { TeamInvitation } from "../types/team.types";
import { UserRole, UserRoles, getAllAllowedActions } from "../auth/permissions";

@Resolver(of => TeamInvitation)
export class TeamInvitationResolver {
  @Authorized()
  @FieldResolver(() => [ UserRoles ])
  userRoleDefs(@Root() invitation: TeamInvitation): UserRole[]{
    const userRoles: UserRole[] = [];

    for (let role of invitation.userRoles) {
      const userRoleDef = UserRoles.find(ur => ur.id === role);
      if (userRoleDef) {
        userRoles.push(userRoleDef);
      }
    }
    
    return userRoles;
  }

  @Authorized()
  @FieldResolver(() => [ String ])
  permissions(@Root() invitation: TeamInvitation): string[]{
    return getAllAllowedActions(invitation.userRoles);
  }
}