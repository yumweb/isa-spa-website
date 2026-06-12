import { Router } from "express";
import argon2 from "argon2";
import { z } from "zod";
import { prisma } from "@isa/db";
import { signAccess, signRefresh, verifyRefresh } from "../lib/jwt.js";
import { requireAuth } from "../middleware/auth.js";
import { HttpError } from "../middleware/error.js";

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive || !(await argon2.verify(user.passwordHash, password))) {
      throw new HttpError(401, "Invalid credentials");
    }
    const access = signAccess({ sub: user.id, email: user.email, role: user.role });
    const refresh = signRefresh(user.id);
    res.json({
      accessToken: access,
      refreshToken: refresh,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (e) {
    next(e);
  }
});

authRouter.post("/refresh", async (req, res, next) => {
  try {
    const { refreshToken } = z.object({ refreshToken: z.string() }).parse(req.body);
    const { sub } = verifyRefresh(refreshToken);
    const user = await prisma.user.findUnique({ where: { id: sub } });
    if (!user || !user.isActive) throw new HttpError(401, "Invalid token");
    res.json({ accessToken: signAccess({ sub: user.id, email: user.email, role: user.role }) });
  } catch {
    next(new HttpError(401, "Invalid refresh token"));
  }
});

authRouter.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});
