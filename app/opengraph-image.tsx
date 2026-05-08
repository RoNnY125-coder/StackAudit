import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "StackAudit - AI Spend Analyzer"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0e1513",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "monospace",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 40,
            color: "#4fdbc8",
            fontSize: 32,
            fontWeight: "bold",
          }}
        >
          StackAudit
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              color: "#4fdbc8",
              fontSize: 140,
              fontWeight: "bold",
              lineHeight: 1,
              letterSpacing: "-0.05em",
            }}
          >
            $2,400/mo
          </div>
          <div
            style={{
              color: "#dde4e1",
              fontSize: 48,
              marginTop: 20,
              letterSpacing: "-0.02em",
            }}
          >
            Identified in your AI stack
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 40,
            color: "#859490",
            fontSize: 24,
          }}
        >
          stackaudit.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
