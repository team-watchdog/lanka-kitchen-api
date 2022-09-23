import { ObjectType, Field, Int } from "type-graphql";

// types
import { UserRole } from "./account.types";

@ObjectType()
export class TeamInvitation{
    @Field(_ => Int)
    id: number;

    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    email: string;

    @Field()
    created: boolean;

    @Field(_ => [Int])
    userRoles: number[]

    @Field(_ => [UserRole], { nullable: true })
    userRoleDefs?: UserRole[];

    @Field((_) => Date)
    createdAt: Date;
    
    @Field((_) => Date)
    updatedAt: Date;
}