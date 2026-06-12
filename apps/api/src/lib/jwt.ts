import jwt from "jsonwebtoken";
import type { Role } from "@isa/shared";
import { env } from "../config/env.js";

export type AccessClaims = { sub: number; email: string; role: Role };

export function signAccess(claims: AccessClaims): string {
  return jwt.sign(claims, env.jwt.accessSecret, { expiresIn: env.jwt.accessTtl });
}

export function signRefresh(sub: number): string {
  return jwt.sign({ sub }, env.jwt.refreshSecret, { expiresIn: env.jwt.refreshTtl });
}

export function verifyAccess(token: string): AccessClaims {
  return jwt.verify(token, env.jwt.accessSecret) as AccessClaims;
}

export function verifyRefresh(token: string): { sub: number } {
  return jwt.verify(token, env.jwt.refreshSecret) as { sub: number };
}
