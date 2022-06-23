import { Field, ObjectType } from "type-graphql";
import { Account } from "./account.types";

@ObjectType()
export class AuthResponse {
    @Field()
    account: Account;

    @Field()
    token: string;
}

@ObjectType()
export class AuthStatusResponse{
    @Field()
    success: boolean;
}