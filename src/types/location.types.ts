import { Field, Float, InputType, ObjectType } from "type-graphql";

@InputType("CoordinateInput")
@ObjectType()
export class Coordinate{
    @Field(_ => Float, { nullable: true })
    lat: number;
    
    @Field(_ => Float, { nullable: true })
    lon: number;
}

@InputType("LocationInput")
@ObjectType()
export class Location {
    @Field()
    placeId: string;

    @Field(_ => Coordinate || String, { nullable: true })
    geo: Coordinate | string;

    @Field()
    formattedAddress: string;

    @Field()
    district: string;

    @Field()
    province: string;
}
