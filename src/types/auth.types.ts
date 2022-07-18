import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class AuthResponse {
    @Field()
    token: string;
}

@ObjectType()
export class AuthStatusResponse{
    @Field()
    success: boolean;
}