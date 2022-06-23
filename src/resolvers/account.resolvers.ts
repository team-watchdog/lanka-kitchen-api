import { Authorized, Query, Resolver } from "type-graphql";

// prisma client
import { prisma } from "../shared/db";

// types
import { Account } from "../types/account.types";

// errors
import { CustomError } from "../shared/errors";

@Resolver()
export class AccountResolver {
  @Authorized("me.read")
  @Query(() => Account)
  async me(): Promise<Account> {
    const account = await prisma.account.findFirst({
      where: {
        id: 1,
        isActive: true,
      }
    });

    if (!account) throw new CustomError("Account not found");

    return account;
  }
}