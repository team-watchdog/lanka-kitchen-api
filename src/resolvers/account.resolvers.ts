import { Authorized, Ctx, FieldResolver, Query, Resolver, Root } from "type-graphql";
import { Context } from "apollo-server-core";
import { Prisma } from "@prisma/client"

// prisma client
import { prisma } from "../shared/db";

// types
import { Account } from "../types/account.types";
import { AuthenticatedRequest } from "../auth/auth.types";
import { UserRole, UserRoles, getAllAllowedActions } from "../auth/permissions";

// errors
import { CustomError } from "../shared/errors";

@Resolver(of => Account)
export class AccountResolver {
  @Authorized("me.read")
  @Query(() => Account)
  async me(@Ctx() ctx: Context<AuthenticatedRequest>): Promise<Account> {
    const { user } = ctx; 

    const account = await prisma.account.findFirst({
      where: {
        id: user.id,
        isActive: true,
        organizationId: user.organizationId,
      },
      include: {
        organization: true,
      }
    }) as Account;

    if (!account) throw new CustomError("Account not found");

    return {
      ...account,
      organization: account.organization ? {
        ...account.organization,
        locations: account?.organization?.locations ? account.organization.locations as Prisma.JsonArray : [],
     } : null,
    };
  }
  
  @Authorized()
  @FieldResolver(() => [ UserRoles ])
  userRoleDefs(@Root() account: Account): UserRole[]{
    const userRoles: UserRole[] = [];

    for (let role of account.userRoles) {
      const userRoleDef = UserRoles.find(ur => ur.id === role);
      if (userRoleDef) {
        userRoles.push(userRoleDef);
      }
    }
    
    return userRoles;
  }

  @Authorized()
  @FieldResolver(() => [ String ])
  permissions(@Root() account: Account): string[]{
    return getAllAllowedActions(account.userRoles);
  }
}