import { ObjectType, Field, ID, Float } from "type-graphql";
import { registerEnumType } from "type-graphql";

export enum VolunteerRequestStatus {
    Active = "Active",
    Completed = "Completed",
}

registerEnumType(VolunteerRequestStatus, {
    name: "VolunteerRequestStatus", // this one is mandatory
    description: "VolunteerRequestStatus", // this one is optional
});

@ObjectType()
export class VolunteerRequest{
    @Field(type => ID)
    id: number;
    
    @Field(_ => String)
    title: string;

    @Field(_ => String)
    description: string;

    @Field(_ => String, { nullable: true })
    placeId: string | null;

    @Field(_ => [String])
    skills: string[];
    
    @Field(_ => VolunteerRequestStatus)
    status: VolunteerRequestStatus;

    @Field((_) => Date, { nullable: true })
    createdAt: Date | null;
    
    @Field((_) => Date, { nullable: true })
    updatedAt: Date | null;
}