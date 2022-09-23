import { Field, InputType, Int } from "type-graphql";
import { IsEmail } from "class-validator";

@InputType()
export class InviteTeamMemberInput {
    @Field()
    @IsEmail({ message: "Please enter a valid email" })
    email: string;

    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field(() => [Int])
    userRoles: number[];
}

@InputType()
export class DeleteInviteInput {
    @Field(_ => Int)
    id: number;
}

@InputType()
export class ResendInviteInput {
    @Field(_ => Int)
    id: number;
}