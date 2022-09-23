import { Field, ID, InputType, Int, Float } from "type-graphql";
import { IsEmail, IsUrl, MaxLength, MinLength, ValidateNested } from "class-validator";

// types
import { Location } from "../types/location.types";

// Organization Details
@InputType()
export class OrganizationDetailsPayload {
    @Field()
    name: string;

    @Field({ nullable: true })
    profileImageUrl: string;

    @MaxLength(240, { message: "Summary must be less than 240 characters" })
    @Field()
    summary: string;

    @Field()
    description: string;

    @Field(_ => [String])
    assistanceTypes: string[];

    @Field()
    assistanceFrequency: string;

    @Field()
    peopleReached: string;
}

@InputType()
export class OrganizationDetailsUpdateInput {
    @Field(_ => OrganizationDetailsPayload)
    payload: OrganizationDetailsPayload;
}

// contact details
@InputType()
export class ContactDetailsUpdatePayload {
    @Field(_ => [String], { nullable: true })
    phoneNumbers?: string[];

    @IsEmail()
    @Field({ nullable: true })
    email?: string;

    @IsUrl()
    @Field({ nullable: true })
    website?: string;

    @IsUrl()
    @Field({ nullable: true })
    facebook?: string;

    @IsUrl()
    @Field({ nullable: true })
    instagram?: string;

    @IsUrl()
    @Field({ nullable: true })
    twitter?: string;

    @IsUrl()
    @Field({ nullable: true })
    paymentLink?: string;
}

@InputType()
export class ContactDetailsUpdateInput {
    @Field(_ => ContactDetailsUpdatePayload)
    payload: ContactDetailsUpdatePayload;
}

// bank details
@InputType()
export class BankDetailsUpdatePayload {
    @Field()
    bankName: string;

    @Field()
    accountNumber: string;

    @Field()
    accountName: string;

    @Field()
    accountType: string;

    @Field()
    branchName: string;

    @Field({ nullable: true })
    notes?: string;
}

@InputType()
export class BankDetailsUpdateInput {
    @Field(_ => BankDetailsUpdatePayload)
    payload: BankDetailsUpdatePayload;
}

@InputType()
export class LocationUpdateInput {
    @Field(_ => [Location])
    payload: Location[];
}
