import { Authorized, Arg, Mutation, Resolver, Ctx } from "type-graphql";
import { Context } from "apollo-server-core";
import AWS from 'aws-sdk';

// errors
import { CustomError } from "../shared/errors";

// types
import { File, FileSignedURLPayload } from "../types/files.types";
import { FileUploadInput } from "../inputs/file.inputs";
import { AuthenticatedRequest } from "../auth/auth.types";

const S3_BUCKET = process.env.BUCKET_NAME
const unsafeAndReservedCharRegex = /(\&|\$|\+|\,|\/|\:|\;|\=|\?|\@|\||\#|\ |\<|\>|\[|\]|\{|\}|\||\\|\^|\%|\~)/ig;

@Resolver(of => File)
export class FilesResolver {
    @Authorized()
    @Mutation(() => FileSignedURLPayload)
    async getPresignedUrl(@Arg("data") data: FileUploadInput, @Ctx() ctx: Context<AuthenticatedRequest>): Promise<FileSignedURLPayload | null> {
        const { folderName, fileName, fileType } = data;

        if (!folderName) throw new CustomError("Missing folder name");
        if (!fileName) throw new CustomError("Missing file name");

        const cleanedFileName = fileName.replace(unsafeAndReservedCharRegex, '_');

        console.log(`BUCKET NAME = ${S3_BUCKET}`);

        try {
            const s3Params = {
                Bucket: S3_BUCKET,
                Key: `${folderName}/${cleanedFileName}`,
                Expires: 3000,
                ContentType: fileType,
                ACL: 'public-read'
            }
            const s3 = new AWS.S3();
            const response = await new Promise((resolve, reject) => {
                s3.getSignedUrl('putObject', s3Params, (err, data) => {
                    if (err){
                        reject(err)
                    }
                    const returnData = {
                        signedRequest: data,
                        url: `https://${s3Params.Bucket}.s3.amazonaws.com/${folderName}/${cleanedFileName}`,
                    }

                    console.log(data);
                    resolve(returnData);
                });
            }) as FileSignedURLPayload;

            return {
                signedRequest: response.signedRequest,
                url: response.url
            }
        } catch (err) {
            throw err
        }
    }
}