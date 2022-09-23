import { Field, ID, Int, ObjectType } from "type-graphql";

// types
import { Organization } from "./organization.types";

@ObjectType()
export class UserRole{
    @Field(type => Int)
    id: number;

    @Field()
    label: string;

    @Field()
    description: string;

    @Field(() => [String])
    allowedActions: string[];
}

@ObjectType()
export class Account{
    @Field(type => ID)
    id: number;

    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    email: string;

    @Field()
    contactNumber: string;

    @Field()
    hashedPassword: string;

    @Field({ defaultValue: false })
    verified: boolean;

    @Field({ defaultValue: true })
    isActive: boolean;

    @Field(type => [Int])
    userRoles: number[]

    @Field(type => [UserRole], { nullable: true })
    userRoleDefs?: UserRole[];

    @Field(_ => Organization, { nullable: true })
    organization: Organization | null;

    @Field(_ => String, { nullable: true })
    resetPasswordHash: string | null;

    @Field(_ => Date, { nullable: true })
    resetPasswordHashExpiry: Date | null;

    @Field(_ => String, { nullable: true })
    confirmEmailHash: string | null;

    @Field(_ => Date, { nullable: true })
    confirmEmailHashExpiry: Date | null;

    @Field((_) => Date)
    createdAt: Date;
    
    @Field((_) => Date)
    updatedAt: Date;
}