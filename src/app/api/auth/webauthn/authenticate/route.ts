import { NextResponse } from "next/server";
import { generateAuthenticationOptions } from "@simplewebauthn/server";
import { rpID } from "@/lib/webauthn";

export async function POST() {
  const options = await generateAuthenticationOptions({
    rpID,
    userVerification: "preferred",
  });

  const response = NextResponse.json(options);
  response.cookies.set("webauthn_auth_challenge", options.challenge, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 300,
  });

  return response;
}
