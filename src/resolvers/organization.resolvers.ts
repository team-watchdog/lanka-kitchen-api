import { Authorized, Mutation, Resolver, Arg, Ctx, Query, Int } from "type-graphql";
import { Context } from "apollo-server-core";
import { Prisma } from "@prisma/client";

// types
import { Organization } from "../types/organization.types";
import { AuthenticatedRequest } from "../auth/auth.types";

// inputs
import { OrganizationDetailsUpdateInput, ContactDetailsUpdateInput, BankDetailsUpdateInput, LocationUpdateInput } from "../inputs/organization.inputs";
import { CustomError } from "../shared/errors";

// prisma client
import { prisma } from "../shared/db";

@Resolver(of => Organization)
export class OrganizationResolver {
  @Query(() => [Organization])
  async getOrganizations(@Ctx() ctx: Context<AuthenticatedRequest>): Promise<Organization[]> {
    const organizations = await prisma.organization.findMany({});
    return organizations as Organization[];
  }


  @Authorized("organization.update")
  @Mutation(() => Boolean, { nullable: true })
  async updateOrganizationDetails(@Arg("data") data: OrganizationDetailsUpdateInput, @Ctx() ctx: Context<AuthenticatedRequest>): Promise<boolean> {
    const { user } = ctx;

    if (!user.organizationId) {
      throw new CustomError("Organization not found", "ORGANIZATION_NOT_FOUND");
    }

    let organization;

    try {
      organization = await prisma.organization.update({
        where: {
          id: user.organizationId,
        },
        data: {
          name: data.payload.name,
          profileImageUrl: data.payload.profileImageUrl,
          summary: data.payload.summary,
          description: data.payload.description,
          assistanceTypes: data.payload.assistanceTypes,
          assistanceFrequency: data.payload.assistanceFrequency,
          peopleReached: data.payload.peopleReached,
        }
      });
    } catch (e) {
      throw e;
    }

    return true;
  }

  @Authorized("organization.update")
  @Mutation(() => Boolean, { nullable: true })
  async updateContactDetails(@Arg("data") data: ContactDetailsUpdateInput, @Ctx() ctx: Context<AuthenticatedRequest>): Promise<boolean> {
    const { user } = ctx;

    if (!user.organizationId) {
      throw new CustomError("Organization not found", "ORGANIZATION_NOT_FOUND");
    }

    try {
      await prisma.organization.update({
        where: {
          id: user.organizationId,
        },
        data: {
          phoneNumbers: data.payload.phoneNumbers,
          email: data.payload.email,
          website: data.payload.website,
          facebook: data.payload.facebook,
          paymentLink: data.payload.paymentLink,
        }
      });
    } catch (e) {
      throw e;
    }

    return true;
  }

  @Authorized("organization.update")
  @Mutation(() => Boolean, { nullable: true })
  async updateLocationDetails(@Arg("data") data: LocationUpdateInput, @Ctx() ctx: Context<AuthenticatedRequest>): Promise<boolean> {
    const { user } = ctx;
    console.log(user);

    if (!user.organizationId) {
      throw new CustomError("Organization not found", "ORGANIZATION_NOT_FOUND");
    }

    try { 
      await prisma.organization.update({
        where: {
          id: user.organizationId,
        },
        data: {
          locations: data.payload.map((location) => ({
              placeId: location.placeId,
              geo: location.geo,
              formattedAddress: location.formattedAddress,
              district: location.district,
              province: location.province,
            })) as Prisma.JsonArray,
          }
        });
    } catch (e) {
      console.log(e);
      throw e;
    }

    return true;
  }

  @Authorized("organization.update")
  @Mutation(() => Boolean, { nullable: true })
  async updateBankDetails(@Arg("data") data: BankDetailsUpdateInput, @Ctx() ctx: Context<AuthenticatedRequest>): Promise<boolean> {
    const { user } = ctx;

    if (!user.organizationId) {
      throw new CustomError("Organization not found", "ORGANIZATION_NOT_FOUND");
    }

    try {
      await prisma.organization.update({
        where: {
          id: user.organizationId,
        },
        data: {
          bankName: data.payload.bankName,
          accountNumber: data.payload.accountNumber,
          accountName: data.payload.accountName,
          accountType: data.payload.accountType,
          branchName: data.payload.branchName,
          notes: data.payload.notes,
        }
      });
    } catch (e) {
      throw e;
    }

    return true;
  }

  @Authorized("organization.read")
  @Query(() => Organization, { nullable: true })
  async getOrganization(@Arg("id", () => Int) id: number, @Ctx() ctx: Context<AuthenticatedRequest>): Promise<Organization | null> {
    const { user } = ctx;

    if (!user.organizationId) {
        throw new CustomError("Organization not found", "ORGANIZATION_NOT_FOUND");
    }
    const organization = await prisma.organization.findFirst({
      where: {
        id,
      },
    });

    if (!organization) return null;
    
    return {
        ...organization,
        locations: organization?.locations ? organization.locations as Prisma.JsonArray : [],
     };
  }
}