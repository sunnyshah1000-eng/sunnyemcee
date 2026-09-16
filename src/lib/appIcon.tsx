import { ImageResponse } from "next/og";

export function renderAppIcon(size: number) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#e2461b",
          color: "#fbfaf7",
          fontSize: size * 0.42,
          fontWeight: 700,
          fontFamily: "sans-serif",
        }}
      >
        AI
      </div>
    ),
    { width: size, height: size },
  );
}
