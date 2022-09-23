import { ObjectType, Field, ID, Float, Int } from "type-graphql";
import { Prisma } from "@prisma/client";

import { Location } from "./location.types";

@ObjectType()
export class Organization{
    @Field(type => ID)
    id: number;

    @Field()
    name: string;

    @Field(_ => String, { nullable: true })
    summary?: string | null;

    @Field(_ => String, { nullable: true })
    description: string | null;

    @Field(_ => String, { nullable: true })
    profileImageUrl?: string | null;

    @Field(_ => [String], { nullable: true })
    assistanceTypes?: string[] | null;

    @Field(_ => String, { nullable: true })
    assistanceFrequency?: string | null;

    @Field(_ => String, { nullable: true })
    peopleReached?: string | null;

    // contact details
    @Field(_ => [String], { nullable: true })
    phoneNumbers?: string[] | null;

    @Field(_ => String, { nullable: true })
    email?: string | null;

    @Field(_ => String, { nullable: true })
    website?: string | null;

    @Field(_ => String, { nullable: true })
    instagram?: string | null;

    @Field(_ => String, { nullable: true })
    facebook?: string | null;

    @Field(_ => String, { nullable: true })
    twitter?: string | null;

    @Field(_ => String, { nullable: true })
    paymentLink?: string | null;

    // bank details
    @Field(_ => String, { nullable: true })
    bankName?: string | null;

    @Field(_ => String, { nullable: true })
    accountNumber?: string | null;

    @Field(_ => String, { nullable: true })
    accountName?: string | null;

    @Field(_ => String, { nullable: true })
    accountType?: string | null;

    @Field(_ => String, { nullable: true })
    branchName?: string | null;

    @Field(_ => String, { nullable: true })
    notes?: string | null;

    // locations
    @Field(_ => [Location] || String, { nullable: true })
    locations?: Location[] | null | string | Prisma.JsonArray;

    @Field()
    approved: boolean;

    @Field((_) => Date)
    createdAt: Date;
    
    @Field((_) => Date)
    updatedAt: Date;
}