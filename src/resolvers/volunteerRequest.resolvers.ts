import { Authorized, Mutation, Resolver, Arg, Ctx, Query, Int } from "type-graphql";
import { Context } from "apollo-server-core";

// prisma client
import { prisma } from "../shared/db";

// types
import { VolunteerRequest, VolunteerRequestStatus } from "../types/volunteerRequest.types";
import { AuthenticatedRequest } from "../auth/auth.types";

// input
import { VolunteerRequestInput } from "../inputs/volunteerRequests.inputs";

@Resolver(of => VolunteerRequest)
export class VolunteerRequestResolver {
  @Authorized("organization.manageRequests")
  @Mutation(() => Boolean, { nullable: true })
  async createVolunteerRequest(@Arg("data") data: VolunteerRequestInput, @Ctx() ctx: Context<AuthenticatedRequest>): Promise<boolean> {
    const { user } = ctx;

    try {
        await prisma.volunteerRequest.create({
            data: {
                title: data.title,
                description: data.description,
                placeId: data.placeId,
                skills: data.skills,
                status: data.status,
                organizationId: user.organizationId,
            }
        });
    } catch (e) {
        console.log(e);
        throw e;
    }

    return true;
  }

  @Authorized("organization.manageRequests")
  @Mutation(() => Boolean, { nullable: true })
  async updateVolunteerRequest(@Arg("id", () => Int) id: number, @Arg("data") data: VolunteerRequestInput, @Ctx() ctx: Context<AuthenticatedRequest>): Promise<boolean> {
    const { user } = ctx;

    try {
        await prisma.volunteerRequest.update({
            data: {
                title: data.title,
                description: data.description,
                placeId: data.placeId,
                skills: data.skills,
                status: data.status,
                organizationId: user.organizationId,
                updatedAt: new Date(),
            },
            where: {
                id,
            }
        });
    } catch (e) {
        console.log(e);
        throw e;
    }

    return true;
  }

  @Authorized("organization.manageRequests")
  @Mutation(() => Boolean, { nullable: true })
  async fulfillVolunteerRequest(@Arg("id", () => Int) id: number, @Ctx() ctx: Context<AuthenticatedRequest>): Promise<boolean> {
    try {
        await prisma.volunteerRequest.update({
            where: {
                id,
            },
            data: {
                status: VolunteerRequestStatus.Completed,
                updatedAt: new Date(),
            }
        });
    } catch (e) {
        console.log(e);
        throw e;
    }

    return true;
  }

  @Authorized("organization.manageRequests")
  @Mutation(() => Boolean, { nullable: true })
  async deleteVolunteerRequest(@Arg("id", () => Int) id: number, @Ctx() ctx: Context<AuthenticatedRequest>): Promise<boolean> {
    try {
        await prisma.volunteerRequest.delete({
            where: {
                id,
            },
        });
    } catch (e) {
        console.log(e);
        throw e;
    }

    return true;
  }

  @Query(() => [VolunteerRequest], { nullable: true })
  async getOrganizationVolunteerRequests(@Arg("id", () => Int) id: number, @Arg("status", () => VolunteerRequestStatus, { nullable: true }) status: VolunteerRequestStatus, @Ctx() ctx: Context<AuthenticatedRequest>): Promise<VolunteerRequest[] | null> {
    try {
        const requests = await prisma.volunteerRequest.findMany({
            where: {
                organizationId: id,
                status: status ? status : undefined,
            },
            orderBy: {
                updatedAt: "desc",
            }
        });

        return (requests as unknown[]) as VolunteerRequest[];
    } catch (e) {
        console.log(e);
        throw e;
    }
  }
}