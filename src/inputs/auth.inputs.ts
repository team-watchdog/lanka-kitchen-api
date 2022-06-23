import { Field, InputType } from "type-graphql";
import { IsEmail, MinLength } from "class-validator";

@InputType()
export class SignUpInput {
    @Field()
    @IsEmail({ message: "Please enter a valid email" })
    email: string;

    @Field()
    @MinLength(6, { message: "Password must be at least 6 characters" })
    password: string;

    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    contactNumber: string;

    @Field()
    organizationName: string;
}


@InputType()
export class SignInInput {
    @Field()
    @IsEmail({ message: "Please enter a valid email" })
    email: string;

    @Field()
    password: string;
}

@InputType()
export class ForgotPasswordInput {
    @Field()
    @IsEmail({ message: "Please enter a valid email" })
    email: string;
}

@InputType()
export class ResetPasswordInput {
    @Field()
    accountId: number;

    @Field()
    resetCode: string;

    @Field()
    password: string;
}

@InputType()
export class VerifyEmailInput {
    @Field()
    accountId: number;

    @Field()
    confirmCode: string;
}