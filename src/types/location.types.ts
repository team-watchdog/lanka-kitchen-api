import { Field, Float, ObjectType } from "type-graphql";

@ObjectType()
export class Coordinate{
    @Field(_ => Float)
    lat: number;
    
    @Field(_ => Float)
    lon: number;
}

@ObjectType()
export class Location {
    @Field()
    placeId: string;

    @Field(_ => Coordinate)
    geo: Coordinate;

    @Field()
    formattedAddress: string;

    @Field()
    district: string;

    @Field()
    province: string;
}
