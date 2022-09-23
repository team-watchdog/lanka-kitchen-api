import { AuthResolver } from "./auth.resolvers";
import { AccountResolver } from "./account.resolvers";
import { TeamResolver } from "./team.resolvers";
import { TeamInvitationResolver } from "./invitation.resolvers";
import { OrganizationResolver } from "./organization.resolvers";
import { FilesResolver } from "./files.resolvers";
import { LocationResolver } from "./location.resolvers";
import { RequestResolver } from "./request.resolvers";
import { VolunteerRequestResolver } from "./volunteerRequest.resolvers";

export const resolvers = [
    AuthResolver,
    AccountResolver,
    TeamResolver,
    TeamInvitationResolver,
    OrganizationResolver,
    FilesResolver,
    LocationResolver,
    RequestResolver,
    VolunteerRequestResolver,
] as const;

