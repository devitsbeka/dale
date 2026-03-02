import { NextRequest, NextResponse } from "next/server";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { origin, rpID } from "@/lib/webauthn";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const challenge = request.cookies.get("webauthn_challenge")?.value;
  if (!challenge) {
    return NextResponse.json({ error: "Challenge not found" }, { status: 400 });
  }

  const body = await request.json();

  try {
    const verification = await verifyRegistrationResponse({
      response: body,
      expectedChallenge: challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });

    if (!verification.verified || !verification.registrationInfo) {
      return NextResponse.json({ error: "Verification failed" }, { status: 400 });
    }

    const {
      credentialID,
      credentialPublicKey,
      counter,
      credentialDeviceType,
      credentialBackedUp,
    } = verification.registrationInfo;

    await db.webAuthnCredential.create({
      data: {
        userId: session.user.id,
        credentialId: Buffer.from(credentialID).toString("base64url"),
        publicKey: Buffer.from(credentialPublicKey),
        counter: BigInt(counter),
        transports: body.response?.transports ?? [],
        credentialDeviceType,
        credentialBackedUp,
      },
    });

    const response = NextResponse.json({ verified: true });
    response.cookies.delete("webauthn_challenge");
    return response;
  } catch (error) {
    console.error("WebAuthn registration verification error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 400 });
  }
}
