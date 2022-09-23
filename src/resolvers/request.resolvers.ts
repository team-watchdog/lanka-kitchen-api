import { Authorized, Mutation, Resolver, Arg, Ctx, Query, Int } from "type-graphql";
import { Context } from "apollo-server-core";

// prisma client
import { prisma } from "../shared/db";

// types
import { Request, RequestStatus } from "../types/request.types";
import { AuthenticatedRequest } from "../auth/auth.types";

// input
import { RequestInput } from "../inputs/request.inputs";

@Resolver(of => Request)
export class RequestResolver {
  @Authorized("organization.manageRequests")
  @Mutation(() => Boolean, { nullable: true })
  async createRequest(@Arg("data") data: RequestInput, @Ctx() ctx: Context<AuthenticatedRequest>): Promise<boolean> {
    const { user } = ctx;

    try {
        await prisma.request.create({
            data: {
                itemName: data.itemName,
                requestType: data.requestType,
                placeId: data.placeId,
                unit: data.unit,
                quantity: data.quantity,
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
  async updateRequest(@Arg("data") data: RequestInput, @Arg("id", () => Int) id: number, @Ctx() ctx: Context<AuthenticatedRequest>): Promise<boolean> {
    const { user } = ctx;

    try {
        await prisma.request.update({
            where: {
                id,
            },
            data: {
                itemName: data.itemName,
                requestType: data.requestType,
                placeId: data.placeId,
                unit: data.unit,
                quantity: data.quantity,
                status: data.status,
                organizationId: user.organizationId,
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
  async fulfillRequest(@Arg("id", () => Int) id: number, @Ctx() ctx: Context<AuthenticatedRequest>): Promise<boolean> {
    try {
        await prisma.request.update({
            where: {
                id,
            },
            data: {
                status: RequestStatus.Completed,
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
  async deleteRequest(@Arg("id", () => Int) id: number, @Ctx() ctx: Context<AuthenticatedRequest>): Promise<boolean> {
    try {
        await prisma.request.delete({
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

  @Query(() => [Request], { nullable: true })
  async getOrganizationRequests(@Arg("id", () => Int) id: number, @Arg("status", () => RequestStatus, { nullable: true }) status: RequestStatus, @Ctx() ctx: Context<AuthenticatedRequest>): Promise<Request[] | null> {
    try {
        const requests = await prisma.request.findMany({
            where: {
                organizationId: id,
                status: status ? status : undefined,
            },
            orderBy: {
                updatedAt: "desc",
            }
        });

        return (requests as unknown[]) as Request[];
    } catch (e) {
        console.log(e);
        throw e;
    }
  }
}