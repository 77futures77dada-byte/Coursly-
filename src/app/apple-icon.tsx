import { ImageResponse } from "next/og";

// iOS home-screen icon. Next renders this to a 180×180 PNG at build time, so no
// local raster toolchain is needed. Same monogram as src/app/icon.svg; iOS
// applies its own corner mask, so the background is a plain square.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#4F46E5" }}>
        <svg width="180" height="180" viewBox="0 0 64 64">
          <path
            d="M46 20 A18 18 0 1 0 46 44"
            fill="none"
            stroke="#fff"
            strokeWidth={6}
            strokeLinecap="round"
          />
          <circle cx={46} cy={32} r={3.5} fill="#fff" />
        </svg>
      </div>
    ),
    size,
  );
}
