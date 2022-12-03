import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export class File {
  @Field((_) => Int)
  id: number;

  @Field()
  fileName: string;

  @Field()
  folderName: string;

  @Field()
  fileType: string;

  @Field()
  fileUrl: string;

  @Field((_) => Int)
  organizationId: number;

  @Field()
  uploadedBy: boolean;

  @Field((_) => Date)
  createdAt: Date;

  @Field((_) => Date)
  updatedAt: Date;
}

@ObjectType()
export class PreSignedUrlResponse {
  @Field()
  url: string;
}
