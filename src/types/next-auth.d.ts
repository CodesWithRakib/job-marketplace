// types/next-auth.d.ts
import { DefaultSession } from "next-auth";
import { User as BaseUser } from "@/shared/interfaces";

declare module "next-auth" {
  interface Session {
    user: BaseUser & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    status: string;
    profile: any;
  }
}
