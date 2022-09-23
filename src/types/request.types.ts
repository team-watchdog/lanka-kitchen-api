import { ObjectType, Field, ID, Float } from "type-graphql";
import { registerEnumType } from "type-graphql";

export enum RequestType {
    Ration = "Ration",
    Equipment = "Equipment",
}

registerEnumType(RequestType, {
    name: "RequestType", // this one is mandatory
    description: "RequestType", // this one is optional
});

export enum Unit {
    Kg = "Kg",
    L = "L",
    ML = "ML",
    Nos = "Nos",
}

registerEnumType(Unit, {
    name: "Unit", // this one is mandatory
    description: "Unit", // this one is optional
});

export enum RequestStatus {
    Active = "Active",
    Completed = "Completed",
}

registerEnumType(RequestStatus, {
    name: "RequestStatus", // this one is mandatory
    description: "RequestStatus", // this one is optional
});

@ObjectType()
export class Request{
    @Field(type => ID)
    id: number;
    
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

    @Field((_) => Date, { nullable: true })
    createdAt: Date | null;
    
    @Field((_) => Date, { nullable: true })
    updatedAt: Date | null;
}