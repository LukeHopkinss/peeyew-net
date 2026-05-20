import type { CSSProperties } from "react";
import MenuOverlay from "../landing/MenuOverlay";
import PeeyewBanner from "../landing/PeeyewBanner";

const BANNER_HEIGHT = "clamp(100px, 20vw, 260px)";
const BANNER_IMAGE_HEIGHT = "clamp(100px, 50vw, 720px)";
const BANNER_IMAGE_WIDTH = "auto";
const RADIO_WIDTH = "clamp(140px, 32vw, 380px)";
const DJ_WIDTH = "clamp(120px, 28vw, 340px)";
const LCD_WIDTH = "clamp(220px, 56vw, 680px)";

const SPACING = {
  afterRadio: "clamp(1rem, 3.5vw, 2.5rem)",
  afterDj: "clamp(1rem, 3.5vw, 2.5rem)",
};

const RADIO_PAGE_BG: CSSProperties = {
  backgroundColor: "var(--color-redBrand)",
  backgroundImage: `
    radial-gradient(circle at 18% 22%, rgba(255,255,255,0.08) 0 1px, transparent 2px),
    radial-gradient(circle at 72% 30%, rgba(0,0,0,0.16) 0 1px, transparent 2px),
    radial-gradient(circle at 38% 68%, rgba(255,255,255,0.05) 0 1px, transparent 2px),
    radial-gradient(circle at 88% 76%, rgba(0,0,0,0.14) 0 1px, transparent 2px),
    repeating-radial-gradient(circle at 50% 50%, rgba(0,0,0,0.08) 0 1px, transparent 1px 5px),
    linear-gradient(135deg, rgba(255,255,255,0.04), rgba(0,0,0,0.12))
  `,
  backgroundSize:
    "120px 120px, 150px 150px, 95px 95px, 180px 180px, 5px 5px, 100% 100%",
  backgroundBlendMode:
    "soft-light, multiply, soft-light, multiply, overlay, normal",
};

function AssetPlaceholder({
  label,
  width,
  aspectRatio = "1 / 1",
}: {
  label: string;
  width: string;
  aspectRatio?: string;
}) {
  return (
    <div
      className="flex items-center justify-center text-center text-white/80"
      style={{
        width,
        aspectRatio,
        border: "2px dashed rgba(255,255,255,0.5)",
        backgroundColor: "rgba(0,0,0,0.18)",
        fontSize: "clamp(11px, 1.4vw, 16px)",
        padding: "0.5rem",
      }}
    >
      [placeholder: {label}]
    </div>
  );
}

export default function LoveRadioPage() {
  return (
    <main
      className="relative min-h-screen w-full overflow-x-hidden"
      style={RADIO_PAGE_BG}
    >
      <MenuOverlay />

      <div aria-hidden="true" style={{ height: "clamp(2.5rem, 6vw, 5rem)" }} />

      <PeeyewBanner
        bannerHeight={BANNER_HEIGHT}
        imageHeight={BANNER_IMAGE_HEIGHT}
        imageWidth={BANNER_IMAGE_WIDTH}
      />

      <div
        className="mx-auto flex flex-col items-center text-center"
        style={{
          maxWidth: "min(92vw, 1200px)",
          paddingLeft: "clamp(0.75rem, 3vw, 2rem)",
          paddingRight: "clamp(0.75rem, 3vw, 2rem)",
          paddingTop: "clamp(2rem, 6vw, 5rem)",
          paddingBottom: "clamp(2rem, 5vw, 4rem)",
          gap: 0,
        }}
      >
        <AssetPlaceholder
          label="playdate-radio.png"
          width={RADIO_WIDTH}
          aspectRatio="3 / 4"
        />

        <div style={{ marginTop: SPACING.afterRadio }}>
          <AssetPlaceholder
            label="dj-figure.png"
            width={DJ_WIDTH}
            aspectRatio="2 / 3"
          />
        </div>

        <div style={{ marginTop: SPACING.afterDj }}>
          <AssetPlaceholder
            label="girlsnight-lcd.png"
            width={LCD_WIDTH}
            aspectRatio="6 / 1"
          />
        </div>
      </div>
    </main>
  );
}