import jwt, { type SignOptions } from "jsonwebtoken";
import type { Role } from "@isa/shared";
import { env } from "../config/env.js";

export type AccessClaims = { sub: number; email: string; role: Role };

// `expiresIn` accepts the `ms` StringValue template type; our TTLs come from
// env as plain strings, so widen via SignOptions to satisfy the overload.
const accessOpts: SignOptions = { expiresIn: env.jwt.accessTtl as SignOptions["expiresIn"] };
const refreshOpts: SignOptions = { expiresIn: env.jwt.refreshTtl as SignOptions["expiresIn"] };

export function signAccess(claims: AccessClaims): string {
  return jwt.sign(claims, env.jwt.accessSecret, accessOpts);
}

export function signRefresh(sub: number): string {
  return jwt.sign({ sub }, env.jwt.refreshSecret, refreshOpts);
}

export function verifyAccess(token: string): AccessClaims {
  return jwt.verify(token, env.jwt.accessSecret) as unknown as AccessClaims;
}

export function verifyRefresh(token: string): { sub: number } {
  return jwt.verify(token, env.jwt.refreshSecret) as unknown as { sub: number };
}
