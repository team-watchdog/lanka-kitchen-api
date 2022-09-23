import { Authorized, Arg, Mutation, Resolver, Ctx } from "type-graphql";
import { Context } from "apollo-server-core";

// types
import { File } from "../types/files.types";
import { FileUploadInput } from "../inputs/file.inputs";
import { AuthenticatedRequest } from "../auth/auth.types";

@Resolver(of => File)
export class FilesResolver {
    @Authorized()
    @Mutation(() => File)
    async getPresignedUrl(@Arg("data") data: FileUploadInput, @Ctx() ctx: Context<AuthenticatedRequest>): Promise<File | null> {
        return null;
    }
}