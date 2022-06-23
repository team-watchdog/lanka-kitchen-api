import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Context } from "apollo-server-core";
import bcrypt from "bcrypt";
import sgMail from "@sendgrid/mail";
import { generate } from "randomstring";
import jwt from "jsonwebtoken";
import moment from "moment";

// errors
import { CustomError } from "../shared/errors";

// types
import { AuthResponse, AuthStatusResponse } from "../types/auth.types";
import { SignUpInput, SignInInput, ForgotPasswordInput, ResetPasswordInput, VerifyEmailInput } from "../inputs/auth.inputs";

// config
import { MailTemplates } from "../shared/mail";

// clients
import { prisma } from "../shared/db";

const APP_HOST_URL = process.env.APP_HOST_URL ? process.env.APP_HOST_URL : "http://localhost:3000/";
const JWT_SECRET = process.env.JWT_SECRET ? process.env.JWT_SECRET : "";

@Resolver()
export class AuthResolver{
    @Mutation(() => AuthResponse, { nullable: true })
    async signUp(@Arg("data") data: SignUpInput, @Ctx() ctx: Context): Promise<AuthResponse | null> {
        const existingAccount = await prisma.account.findFirst({
            where: {
                email: data.email
            }
        });

        if (existingAccount) {
            throw new CustomError("Account already exists");
        }

        // Hash the new password
        let hashedPassword = await bcrypt.hash(data.password, 10);

        // verification code
        const verifyCode = generate(6);
        let hashedVerifyCode = await bcrypt.hash(verifyCode, 10);

        const account = await prisma.account.create({
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                contactNumber: data.contactNumber,
                createdAt: new Date(),
                updatedAt: new Date(),
                isActive: true,
                verified: false,
                hashedPassword: hashedPassword,
                confirmEmailHash: hashedVerifyCode,
                confirmEmailHashExpiry: moment().add(3, "days").toDate(),
                userRoles: [1],
                organization: {
                    create: {
                        name: data.organizationName,
                    },
                },
            },
        });

        /*
        sgMail.send({
            to: account.email,
            from: 'contact@appendix.tech',
            subject: 'Watchdog Foodbank: Verify your email',
            templateId: MailTemplates.PasswordResetTemplateId,
            dynamicTemplateData: {
                passwordResetLink: `${APP_HOST_URL}/auth/verify-email?resetToken=${verifyCode}&accountId=${account.id}`,
            },
        });
        */

        // Generate Token
        const token = jwt.sign({ id: account.id, userRoles: account.userRoles, organizationId: account.organizationId }, JWT_SECRET);

        return {
            account: {
                ...account,
                resetPasswordHash: null,
                resetPasswordHashExpiry: null,
                hashedPassword: "",
                confirmEmailHash: null,
                confirmEmailHashExpiry: null,
            },
            token,
        };
    }

    @Authorized("auth.signin")
    @Mutation(() => AuthResponse, { nullable: true })
    async signIn(@Arg("data") data: SignInInput, @Ctx() ctx: Context): Promise<AuthResponse | null> {
        const account = await prisma.account.findFirst({
            where: {
                email: data.email,
            }
        });
        
        if (!account) throw new CustomError("Account not found");

        if (!account.hashedPassword || !bcrypt.compareSync(data.password, account.hashedPassword)){
            throw new CustomError("Incorrect password");
        }

        // Generate Token
        const token = jwt.sign({ id: account.id, userRoles: account.userRoles, organizationId: account.organizationId }, JWT_SECRET);

        return {
            token: token,
            account: {
                ...account,
                resetPasswordHash: null,
                resetPasswordHashExpiry: null,
                hashedPassword: "",
                confirmEmailHash: null,
                confirmEmailHashExpiry: null,
            },
        }
    }

    @Mutation(() => AuthStatusResponse, { nullable: true })
    async forgotPassword(@Arg("data") data: ForgotPasswordInput, @Ctx() ctx: Context): Promise<AuthStatusResponse | null> {
        const account = await prisma.account.findFirst({
            where: {
                email: data.email,
            }
        });
        
        if (!account) throw new CustomError("Account not found");

        // Generate Reset code
        const resetCode = generate(6);
        let hashedResetCode = await bcrypt.hash(resetCode, 10);

        // Update account
        await prisma.account.update({
            where: {
                id: account.id,
            },
            data: {
                resetPasswordHash: hashedResetCode,
                resetPasswordHashExpiry: moment().add(3, "days").toDate(),
            },
        });

        return { success: true };
    }

    @Mutation(() => AuthStatusResponse, { nullable: true })
    async resetPassword(@Arg("data") data: ResetPasswordInput, @Ctx() ctx: Context): Promise<AuthStatusResponse | null> {
        const account = await prisma.account.findFirst({
            where: {
                id: data.accountId,
            }
        });

        if (!account) throw new CustomError("Account not found");

        // check if reset code is valid
        if (account.resetPasswordHash && !bcrypt.compareSync(data.resetCode, account.resetPasswordHash) && moment().isBefore(account.resetPasswordHashExpiry)) {
            throw new CustomError("Invalid reset code");
        }

        
        // Hash the new password
        let hashedPassword = await bcrypt.hash(data.password, 10);

        // update password hash
        await prisma.account.update({
            where: {
                id: account.id,
            },
            data: {
                hashedPassword: hashedPassword,
                resetPasswordHash: null,
                resetPasswordHashExpiry: null,
            },
        });

        return { success: true };
    }

    @Mutation(() => AuthStatusResponse, { nullable: true })
    async verifyEmail(@Arg("data") data: VerifyEmailInput, @Ctx() ctx: Context): Promise<AuthStatusResponse | null> {
        const account = await prisma.account.findFirst({
            where: {
                id: data.accountId,
            }
        });
        
        if (!account) throw new CustomError("Account not found");

        // check if reset code is valid
        if (account.confirmEmailHash && !bcrypt.compareSync(data.confirmCode, account.confirmEmailHash) && moment().isBefore(account.confirmEmailHashExpiry)) {
            throw new CustomError("Invalid reset code");
        }

        // Update account
        await prisma.account.update({
            where: {
                id: account.id,
            },
            data: {
                verified: true,
                confirmEmailHash: null,
                confirmEmailHashExpiry: null,
            },
        });

        return { success: true };
    }

}