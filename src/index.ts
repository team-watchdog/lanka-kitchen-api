import { config } from "dotenv";
config();

import "reflect-metadata";
import express from "express";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import { expressjwt as jwt, Request } from "express-jwt";

// resolvers
import { resolvers } from "./resolvers";

// auth checker
import { customAuthCheck } from "./auth/customAuthCheck";

// types
import { AuthenticatedRequest } from "./auth/auth.types";

import "./shared/mail";

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET ? process.env.JWT_SECRET : "";

async function bootstrap(){
    const app = express();
    const path = "/graphql";

    const schema = await buildSchema({
        resolvers: resolvers,
        authChecker: customAuthCheck,
    });

    // Create the GraphQL server
    const server = new ApolloServer({
        schema,
        context: ({ req }) => { 
            const context = {
                req,
                user: (req as Request).auth,
            }
            return context;
         },
    });

    app.use(path, jwt({
        secret: JWT_SECRET,
        credentialsRequired: false,
        algorithms: ["HS256"],
        
    }));

    await server.start();
    server.applyMiddleware({ app, path });

    app.listen({ port: PORT }, () =>{
        console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    });
}

bootstrap();