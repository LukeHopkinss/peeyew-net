import MenuOverlay from "./MenuOverlay";
import PeeyewBanner from "./PeeyewBanner";

const BANNER_HEIGHT = "clamp(100px, 20vw, 260px)";
const BANNER_IMAGE_HEIGHT = "clamp(100px, 50vw, 720px)";
const BANNER_IMAGE_WIDTH = "auto";

const TITLE_FONT_SIZE = "clamp(38px, 8vw, 120px)";
const SUBTITLE_FONT_SIZE = "clamp(22px, 4vw, 58px)";

type ComingSoonPageProps = {
  label?: string;
  backgroundColor?: string;
  textColor?: string;
};

export default function ComingSoonPage({
  label,
  backgroundColor = "var(--color-pyLightBlue)",
  textColor = "#000000",
}: ComingSoonPageProps) {
  return (
    <main
      className="relative min-h-screen w-full overflow-x-hidden"
      style={{
        backgroundColor,
        color: textColor,
      }}
    >
      <MenuOverlay />

      <div aria-hidden="true" style={{ height: "clamp(2.5rem, 6vw, 5rem)" }} />

      <PeeyewBanner
        bannerHeight={BANNER_HEIGHT}
        imageHeight={BANNER_IMAGE_HEIGHT}
        imageWidth={BANNER_IMAGE_WIDTH}
      />

      <section
        className="mx-auto flex min-h-[55vh] w-full flex-col items-center justify-center text-center uppercase"
        style={{
          maxWidth: "min(92vw, 1200px)",
          paddingLeft: "clamp(0.75rem, 3vw, 2rem)",
          paddingRight: "clamp(0.75rem, 3vw, 2rem)",
          paddingTop: "clamp(3rem, 9vw, 8rem)",
          paddingBottom: "clamp(3rem, 8vw, 7rem)",
          fontFamily: "inherit",
        }}
      >
        {label && (
          <p
            style={{
              fontSize: "clamp(14px, 2vw, 26px)",
              letterSpacing: "0.08em",
              marginBottom: "clamp(0.75rem, 2vw, 1.5rem)",
            }}
          >
            {label}
          </p>
        )}

        <h1
          style={{
            fontSize: TITLE_FONT_SIZE,
            lineHeight: 0.85,
            letterSpacing: "0.02em",
          }}
        >
          coming soon...
        </h1>

        <p
          style={{
            fontSize: SUBTITLE_FONT_SIZE,
            lineHeight: 0.9,
            marginTop: "clamp(0.75rem, 2vw, 1.5rem)",
          }}
        >
          be excited.
        </p>
      </section>
    </main>
  );
}