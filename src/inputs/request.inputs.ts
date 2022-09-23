import { Field, ID, InputType, Int, Float } from "type-graphql";

// types
import { RequestType, Unit, RequestStatus } from "../types/request.types";

// Request Details
@InputType()
export class RequestInput {
    @Field(_ => String)
    itemName: string;

    @Field(_ => RequestType)
    requestType: RequestType;

    @Field(_ => String, { nullable: true })
    placeId: string | null;

    @Field(_ => Unit)
    unit: Unit;

    @Field(_ => Float)
    quantity: number;
    
    @Field(_ => RequestStatus)
    status: RequestStatus;
}
