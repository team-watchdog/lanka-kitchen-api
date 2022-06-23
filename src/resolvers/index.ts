import { AuthResolver } from "./auth.resolvers";
import { AccountResolver } from "./account.resolvers";

export const resolvers = [
    AuthResolver,
    AccountResolver,
] as const;

