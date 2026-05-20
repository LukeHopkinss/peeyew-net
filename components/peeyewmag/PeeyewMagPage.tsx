import Image from "next/image";
import MenuOverlay from "../landing/MenuOverlay";
import PeeyewBanner from "../landing/PeeyewBanner";

const BANNER_HEIGHT = "clamp(100px, 20vw, 260px)";
const BANNER_IMAGE_HEIGHT = "clamp(100px, 50vw, 720px)";
const PYM_MOCK_WIDTH = "clamp(240px, 46vw, 620px)";
const PITCH_FONT_SIZE = "clamp(18px, 3.6vw, 42px)";
const CALLOUT_FONT_SIZE = "clamp(18px, 3.5vw, 42px)";
const HINT_FONT_SIZE = "clamp(13px, 2.2vw, 26px)";
const COVER_OVERLAY_FONT_SIZE = "clamp(18px, 3.1vw, 38px)";

const SPACING = {
  afterPymMock: "clamp(1.25rem, 4vw, 2.75rem)",
  afterPitch: "clamp(1rem, 3vw, 2rem)",
  afterCallout: "clamp(0.75rem, 2.5vw, 1.75rem)",
  afterHint: "clamp(1rem, 3.5vw, 2.5rem)",
};

const TEXT_PITCH = "var(--color-pyTextBlue)";
const TEXT_BLACK = "#000000";
const BG_CALLOUT = "var(--color-pyDarkBlue)";
const TEXT_CALLOUT = "var(--color-yellowBrand)";

export default function PeeyewMagPage() {
  return (
    <main
      className="relative min-h-screen w-full overflow-x-hidden"
      style={{ backgroundColor: "var(--color-yellowBrand)" }}
    >
      <div
        className="fixed z-30"
        style={{
          top: "clamp(0.5rem, 1.5vw, 1.5rem)",
          right: "clamp(0.5rem, 2vw, 2rem)",
        }}
      >
        <MenuOverlay />
      </div>

      <div aria-hidden="true" style={{ height: "clamp(2.5rem, 6vw, 5rem)" }} />

      <PeeyewBanner
        bannerHeight={BANNER_HEIGHT}
        imageHeight={BANNER_IMAGE_HEIGHT}
      />

      <div
        className="mx-auto flex flex-col items-center text-center"
        style={{
          maxWidth: "min(92vw, 1200px)",
          paddingLeft: "clamp(0.75rem, 3vw, 2rem)",
          paddingRight: "clamp(0.75rem, 3vw, 2rem)",
          paddingTop: "clamp(1.5rem, 5vw, 4rem)",
          paddingBottom: "clamp(1.5rem, 4vw, 3rem)",
          gap: 0,
        }}
      >
        {/* combined pencil shaving + pym mag image */}
        <div style={{ width: PYM_MOCK_WIDTH }}>
          <Image
            src="/PYMag/PYM-MOCK.png"
            alt="PYM mock artwork"
            width={1355}
            height={1355}
            className="h-auto w-full"
            priority
          />
        </div>

        {/* larger intro text — pushed flush against the browser's left edge.
            Same full-bleed escape hatch the pilot block uses below, just
            mirrored: width:100vw + marginLeft:calc(50% - 50vw) breaks out of
            the parent's max-width container so the inner <p> can hug the
            viewport edge. */}
        <div
          style={{
            marginTop: SPACING.afterPymMock,
            alignSelf: "stretch",
            width: "100vw",
            marginLeft: "calc(50% - 50vw)",
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <p
            className="uppercase"
            style={{
              color: TEXT_PITCH,
              fontSize: PITCH_FONT_SIZE,
              letterSpacing: "0.02em",
              textAlign: "left",
              lineHeight: 1.06,
              // Match the pilot block's inner padding so the two blocks
              // read as a paired left/right rhythm.
              paddingLeft: "clamp(0.9rem, 2.5vw, 2rem)",
              paddingRight: "clamp(1rem, 3vw, 2.5rem)",
            }}
          >
            peeyewMAGAZINE
            <br />
            stylized as PYMMAG,
            <br />
            is a triannual publication
            <br />
            from NYC.
          </p>
        </div>

        {/* pilot block pushed to the browser's right edge */}
        <div
          style={{
            marginTop: SPACING.afterPitch,
            alignSelf: "stretch",
            width: "100vw",
            marginLeft: "calc(50% - 50vw)",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <div
            className="inline-block"
            style={{
              backgroundColor: BG_CALLOUT,
              color: TEXT_CALLOUT,
              paddingLeft: "clamp(0.9rem, 2.5vw, 2rem)",
              paddingRight: "clamp(1rem, 3vw, 2.5rem)",
              paddingTop: "clamp(0.5rem, 1vw, 0.8rem)",
              paddingBottom: "clamp(0.5rem, 1vw, 0.8rem)",
              fontSize: CALLOUT_FONT_SIZE,
              textAlign: "left",
              lineHeight: 1.04,
            }}
          >
            <span className="uppercase">
              Our first issue, &lsquo;PILOT&rsquo;
              <br />
              will be available soon...
            </span>
          </div>
        </div>

        <p
          className="uppercase"
          style={{
            color: TEXT_BLACK,
            fontSize: HINT_FONT_SIZE,
            marginTop: SPACING.afterCallout,
          }}
        >
          take a look inside the issue. ↓
        </p>

        {/* image row */}
        <div
          className="grid w-full"
          style={{
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(0.5rem, 1.5vw, 1rem)",
            marginTop: SPACING.afterHint,
          }}
        >
          {/* cover 1 */}
          <div
            className="relative overflow-hidden"
            style={{ aspectRatio: "3 / 4" }}
          >
            <Image
              src="/PYMag/LUKETOPACIO-04.png"
              alt="Luke Topacio cover"
              width={1536}
              height={2048}
              className="h-full w-full object-cover"
            />
          </div>

          {/* cover 2 with overlay text */}
          <div
            className="relative overflow-hidden"
            style={{ aspectRatio: "3 / 4" }}
          >
            <Image
              src="/PYMag/gurlnite.png"
              alt="Girls Night cover"
              width={2048}
              height={1536}
              className="h-full w-full object-cover"
            />
            <div
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              style={{
                padding: "clamp(0.75rem, 2vw, 1.25rem)",
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.72), rgba(0,0,0,0))",
              }}
            >
              <p
                style={{
                  color: "#ffffff",
                  fontSize: COVER_OVERLAY_FONT_SIZE,
                  lineHeight: 0.96,
                  textAlign: "right",
                  textShadow: "0 2px 10px rgba(0,0,0,0.55)",
                }}
              >
                girlsnight
                <br />
                mixes
                <br />
                pleasure
                <br />
                &
                <br />
                business
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}