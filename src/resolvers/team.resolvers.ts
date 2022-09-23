import { Authorized, Ctx, Mutation, Query, Resolver, Arg } from "type-graphql";
import { Context } from "apollo-server-core";
import { generate } from "randomstring";
import moment from "moment";
import sgMail from "@sendgrid/mail";
import bcrypt from "bcrypt";

// prisma client
import { prisma } from "../shared/db";

// types
import { Account } from "../types/account.types";
import { AuthenticatedRequest } from "../auth/auth.types";
import { TeamInvitation } from "../types/team.types";

// input
import { InviteTeamMemberInput, DeleteInviteInput, ResendInviteInput } from "../inputs/team.inputs";

// config
import { MailTemplates } from "../shared/mail";

// errors
import { CustomError } from "../shared/errors";

const APP_HOST_URL = process.env.APP_HOST_URL ? process.env.APP_HOST_URL : "http://localhost:3000/";
const INVITE_VALIDITY_DAYS = 14;

@Resolver()
export class TeamResolver {
  @Authorized()
  @Query(() => [Account])
  async team(@Ctx() ctx: Context<AuthenticatedRequest>): Promise<Account[]> {
    const { user } = ctx;

    const accounts = await prisma.account.findMany({
      where: {
        isActive: true,
        organizationId: user.organizationId,
      },
      include: {
        organization: true,
      }
    });
    
    return accounts.map((account) => ({
      ...account,
      organization: account.organization ? {
        ...account.organization,
        locations: account?.organization?.locations ? JSON.parse(account.organization.locations as string) : "",
     } : null,
    }));
  }

  @Authorized()
  @Query(() => [ TeamInvitation ])
  async invitations(@Ctx() ctx: Context<AuthenticatedRequest>): Promise<TeamInvitation[]> {
    const { user } = ctx;

    const invitations = await prisma.invitation.findMany({
      where: {
        organizationId: user.organizationId,
        created: false,
      },
      include: {
        organization: true,
      }
    });

    return invitations;
  }

  @Authorized("organization.manageMembers")
  @Mutation(() => TeamInvitation, { nullable: true })
  async inviteTeamMember(@Arg("data") data: InviteTeamMemberInput, @Ctx() ctx: Context<AuthenticatedRequest>): Promise<TeamInvitation | null> {
    const { user } = ctx;

    // Generate Reset code
    const inviteToken = generate(6);
    let inviteTokenHash = await bcrypt.hash(inviteToken, 10);

    const account = await prisma.account.findFirst({
      where: {
        email: data.email,
      }
    });

    if (account) {
      throw new CustomError("Email already exists");
    }

    const invite = await prisma.invitation.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        userRoles: data.userRoles,
        organizationId: user.organizationId,
        
        // invite token
        inviteTokenHash: inviteTokenHash,
        inviteTokenHashExpiry: moment().add(INVITE_VALIDITY_DAYS, "days").toDate(),
      }
    });

    const organization = await prisma.organization.findFirst({
      where: {
        id: user.organizationId,
      }
    });

    invite["inviteTokenHash"] = null;
    invite["inviteTokenHashExpiry"] = null;

    try {
        await sgMail.send({
            to: invite.email,
            from: 'contact@appendix.tech',
            subject: 'Watchdog Foodbank: You\'ve been invited to join the team',
            templateId: MailTemplates.InviteTemplateId,
            dynamicTemplateData: {
              inviteLink: `${APP_HOST_URL}/auth/invite?inviteToken=${inviteToken}&inviteId=${invite.id}`,
              organizationName: organization ? organization.name : "",
            },
        });
    } catch (e) {
        throw new CustomError("Error sending email");
    }

    return invite;
  }
  
  @Authorized("organization.manageMembers")
  @Mutation(() => Boolean, { nullable: true })
  async deleteInvite(@Arg("data") data: DeleteInviteInput, @Ctx() ctx: Context<AuthenticatedRequest>): Promise<boolean> {
    const { user } = ctx;

    console.log(data);

    const invite = await prisma.invitation.findFirst({
      where: {
        id: data.id,
        organizationId: user.organizationId,
      }
    });

    console.log(invite);

    if (!invite) {
      throw new CustomError("Invite not found");
    }

    if (invite.organizationId === user.organizationId) {
      const deletion = await prisma.invitation.delete({
        where: {
          id: data.id,
        }
      });
      return true;
    }

    return false;
  }

  @Authorized("organization.manageMembers")
  @Mutation(() => Boolean, { nullable: true })
  async resendInvite(@Arg("data") data: ResendInviteInput, @Ctx() ctx: Context<AuthenticatedRequest>): Promise<boolean> {
    const { user } = ctx;

    const invite = await prisma.invitation.findFirst({
      where: {
        id: data.id,
        organizationId: user.organizationId,
      }
    });

    const organization = await prisma.organization.findFirst({
      where: {
        id: user.organizationId,
      }
    });

    if (!invite) {
      throw new CustomError("Invite not found");
    }

    if (!organization) {
      throw new CustomError("Organization not found");
    }

    // Generate Reset code
    const inviteToken = generate(6);
    let inviteTokenHash = await bcrypt.hash(inviteToken, 10);

    await prisma.invitation.update({
      where: {
        id: data.id,
      },
      data: {
        inviteTokenHash: inviteTokenHash,
        inviteTokenHashExpiry: moment().add(INVITE_VALIDITY_DAYS, "days").toDate(),
      }
    })

    try {
      await sgMail.send({
          to: invite.email,
          from: 'contact@appendix.tech',
          subject: 'Watchdog Foodbank: You\'ve been invited to join the team',
          templateId: MailTemplates.InviteTemplateId,
          dynamicTemplateData: {
            inviteLink: `${APP_HOST_URL}/auth/invite?inviteToken=${inviteToken}&inviteId=${invite.id}`,
            organizationName: organization ? organization.name : "",
          },
      });
    } catch (e) {
        throw new CustomError("Error sending email");
    }

    return true;
  }
}