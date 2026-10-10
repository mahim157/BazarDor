import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const mongoUri = process.env.MONGODB_URI;
const authSecret = process.env.BETTER_AUTH_SECRET;
const authUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";

if (!mongoUri) {
  throw new Error("MONGODB_URI is not configured.");
}

if (!authSecret) {
  throw new Error("BETTER_AUTH_SECRET is not configured.");
}

const globalForMongo = globalThis as typeof globalThis & {
  mongoClient?: MongoClient;
};

const client = globalForMongo.mongoClient ?? new MongoClient(mongoUri);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = client;
}

const db = client.db();

export const auth = betterAuth({
  baseURL: authUrl,
  secret: authSecret,

  database: mongodbAdapter(db),

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});