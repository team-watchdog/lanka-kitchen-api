import { ObjectType, Field, Int } from "type-graphql";

@ObjectType()
export class FileSignedURLPayload {
    @Field()
    signedRequest: string;

    @Field()
    url: string;
}

@ObjectType()
export class File{
    @Field(_ => Int)
    id: number;

    @Field()
    fileName: string;

    @Field()
    folderName: string;

    @Field()
    fileType: string;

    @Field()
    fileUrl: string;

    @Field(_ => Int)
    organizationId: number;

    @Field()
    uploadedBy: boolean;

    @Field((_) => Date)
    createdAt: Date;
    
    @Field((_) => Date)
    updatedAt: Date;
}