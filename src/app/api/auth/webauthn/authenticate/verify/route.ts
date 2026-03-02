import { NextRequest, NextResponse } from "next/server";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import { db } from "@/lib/db";
import { origin, rpID } from "@/lib/webauthn";

export async function POST(request: NextRequest) {
  const challenge = request.cookies.get("webauthn_auth_challenge")?.value;
  if (!challenge) {
    return NextResponse.json({ error: "Challenge not found" }, { status: 400 });
  }

  const body = await request.json();

  try {
    const credential = await db.webAuthnCredential.findUnique({
      where: { credentialId: body.id },
      include: { user: true },
    });

    if (!credential) {
      return NextResponse.json({ error: "Credential not found" }, { status: 400 });
    }

    const verification = await verifyAuthenticationResponse({
      response: body,
      expectedChallenge: challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      authenticator: {
        credentialID: new Uint8Array(Buffer.from(credential.credentialId, "base64url")),
        credentialPublicKey: new Uint8Array(credential.publicKey),
        counter: Number(credential.counter),
        transports: credential.transports as AuthenticatorTransport[],
      },
    });

    if (!verification.verified) {
      return NextResponse.json({ error: "Verification failed" }, { status: 400 });
    }

    // Update counter
    await db.webAuthnCredential.update({
      where: { id: credential.id },
      data: { counter: BigInt(verification.authenticationInfo.newCounter) },
    });

    const response = NextResponse.json({
      verified: true,
      userId: credential.userId,
    });
    response.cookies.delete("webauthn_auth_challenge");
    return response;
  } catch (error) {
    console.error("WebAuthn authentication verification error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 400 });
  }
}
