import { Field, InputType } from "type-graphql";

// types
import { VolunteerRequestStatus } from "../types/volunteerRequest.types";

// Request Details
@InputType()
export class VolunteerRequestInput {
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
}
