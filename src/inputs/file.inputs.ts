import { Field, InputType } from "type-graphql";

@InputType()
export class FileUploadInput {
    @Field()
    fileName: string;

    @Field()
    folderName: string;

    @Field()
    fileType: string;
}
