"use server";

import bcrypt from "bcryptjs";
import { signIn, signOut } from "./auth";
import { db } from "./db";

export async function signInWithCredentials(email: string, password: string) {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { success: true };
  } catch {
    return { success: false, error: "Invalid email or password" };
  }
}

export async function signUpWithCredentials(
  name: string,
  email: string,
  password: string
) {
  try {
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, error: "An account with this email already exists" };
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await db.user.create({
      data: {
        name,
        email,
        passwordHash,
        profile: {
          create: {},
        },
      },
    });

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true, userId: user.id };
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function signOutAction() {
  await signOut({ redirect: false });
}
