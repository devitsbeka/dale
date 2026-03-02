import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title") ?? "Planeta.id";
  const subtitle = searchParams.get("subtitle") ?? "Career Operating System for Earth";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0F0D15",
          backgroundImage: "radial-gradient(circle at 50% 0%, #7C3AED22, transparent 70%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              backgroundColor: "#7C3AED",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            P
          </div>
          <span style={{ color: "#E0DFFB", fontSize: "24px", fontWeight: "600" }}>
            Planeta.id
          </span>
        </div>
        <div
          style={{
            fontSize: "48px",
            fontWeight: "bold",
            color: "white",
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: "1.2",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: "20px",
            color: "#A0A0B0",
            marginTop: "16px",
            textAlign: "center",
          }}
        >
          {subtitle}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
