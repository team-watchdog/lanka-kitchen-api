import { Context } from "apollo-server-core";
import { Arg, Authorized, Ctx, Mutation, Resolver } from "type-graphql";

// types
import { ApolloError } from "apollo-server-express";
import { AuthenticatedRequest } from "../auth/auth.types";
import { FileUploadInput } from "../inputs/file.inputs";
import { PreSignedUrlResponse } from "../types/files.types";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../shared/aws";

@Resolver()
export class FilesResolver {
  @Authorized()
  @Mutation(() => PreSignedUrlResponse)
  async getPresignedUrl(
    @Arg("data") data: FileUploadInput,
    @Ctx() ctx: Context<AuthenticatedRequest>
  ): Promise<PreSignedUrlResponse> {
    // TODO: What ever I seem to do to upload the file, it keeps returning the following:
    /*
    <?xml version="1.0" encoding="UTF-8"?>
    <Error>
      <Code>InvalidArgument</Code>
      <RequestId>tx00000000000002ce2efba-00638e54d1-1cd01abb-sgp1b</RequestId>
      <HostId>1cd01abb-sgp1b-sgp1-zg02</HostId>
    </Error>
    */

    try {
      const url = await getSignedUrl(
        s3Client,
        new PutObjectCommand({
          ACL: "public-read",
          Bucket: process.env.AWS_BUCKET || "watchdog-foodbank",
          Key: `${data.folderName}/${data.fileName}`,
          ContentType: data.fileType,
        }),
        { expiresIn: 60 /* seconds */ * 10 /* = 600 seconds = 10 minutes */ }
      );

      // TODO: Keep track of files

      return { url };
    } catch (error) {
      throw new ApolloError(error);
    }
  }
}
