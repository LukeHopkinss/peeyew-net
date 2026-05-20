import MenuOverlay from "./MenuOverlay";
import PeeyewBanner from "./PeeyewBanner";
import MaskGlyph from "./MaskGlyph";
import MissionBlock from "./MissionBlock";
import HeartMark from "./HeartMark";
import ContactForm from "./ContactForm";

// =============================================================================
//  LAYOUT TOKENS — edit these to dial sizing/spacing without touching JSX.
//  All values use CSS clamp(min, preferred, max) so they scale with viewport.
// =============================================================================

// --- Sizing (widths/heights of visual elements) ---
// The dark-blue banner BAND and the chrome PNG inside it are sized
// independently. Resizing the PNG does NOT change the band; the band only
// changes when the viewport changes. If you make the PNG bigger than the
// band, the PNG is centered and clipped — the page layout never shifts.
//
// How clamp(min, preferred, max) works:
//   - "preferred" is what the browser prefers (here, a viewport-relative value)
//   - "min" is the floor on tiny screens (so things stay readable)
//   - "max" is the ceiling on huge screens (so things don't get absurd)
//
// For BANNER_IMAGE_HEIGHT below: 50vw means the image is 50% of viewport width.
// At a 1440px screen → 720px (hits the cap). At 1024px → 512px. At 375px mobile
// → 187px. Always at least 100px (the floor). Width auto-preserves aspect ratio.
const BANNER_HEIGHT       = "clamp(100px, 20vw, 260px)";  // dark-blue band height (viewport-driven only)
const BANNER_IMAGE_HEIGHT = "clamp(100px, 50vw, 720px)";  // height of the peeyew-3d PNG (independent, fluid)
const BANNER_IMAGE_WIDTH  = "auto";                        // width of the peeyew-3d PNG ("auto" = aspect-preserved)
const MASK_WIDTH          = "clamp(120px, 30vw, 360px)";  // DD-mask glyph width
const HEART_WIDTH         = "clamp(200px, 50vw, 600px)";  // heart-i mark width

// --- Font sizes ---
const PEEYEW_WORD_SCALE   = "1.45em";                  // size of leading "PEEYEW" relative to rest of institute statement (1em = same size)
const INSTITUTE_FONT_SIZE = "clamp(13px, 2.6vw, 30px)";
const TAGLINE_FONT_SIZE   = "clamp(20px, 3vw, 56px)";  // "We supply a necessary amount." — bumped down per request
const EMAIL_FONT_SIZE     = "clamp(18px, 3.6vw, 44px)";
const CREDIT_FONT_SIZE    = "clamp(11px, 1.4vw, 18px)";

// --- Vertical spacing between blocks (top → bottom) ---
// Each value is the gap that sits ABOVE the named element.
const SPACING = {
  afterInstitute: "clamp(1rem, 3.5vw, 2.5rem)",  // gap below institute, above mask
  afterMask:      "clamp(1rem, 3.5vw, 2.5rem)",  // gap below mask, above mission block
  afterMission:   "clamp(1rem, 3.5vw, 2.5rem)",  // gap below mission, above tagline
  taglineToForm:  "clamp(2.5rem, 9vw, 6rem)",    // gap below tagline, above contact form
  formToEmail:    "clamp(2rem, 6vw, 4rem)",      // gap below contact form, above email
  emailToCredit:  "clamp(0.25rem, 0.6vw, 0.75rem)", // tight gap between email and credit lines
  emailToHeart:   "clamp(0.4rem, 1vw, 1rem)",    // SMALL gap below credit, above heart — decrease to push heart even closer
};

// --- Padding around the inner content column ---
const CONTENT_PADDING = {
  x:      "clamp(0.75rem, 3vw, 2rem)",
  top:    "clamp(1.5rem, 5vw, 4rem)",
  bottom: "clamp(1.5rem, 4vw, 3rem)",
};

// All landing body text is black. Don't reach for var(--color-pyTextBlue) here —
// that token is reserved for other panels (e.g. peeyewmag) per the brand spec.
const TEXT = "#000000";

// =============================================================================

export default function BlueLanding() {
  return (
    <main
      className="relative min-h-screen w-full overflow-x-hidden"
      style={{ backgroundColor: "var(--color-pyLightBlue)" }}
    >
      {/* 1. Menu trigger — fixed positioning lives inside MenuOverlay so it stays
              consistent across the landing, magazine, and radio pages. */}
      <MenuOverlay />

      {/* 2. Top spacer — leaves visible page-bg above the banner so the menu
              icon has breathing room before the dark-blue band starts. */}
      <div
        aria-hidden="true"
        style={{ height: "clamp(2.5rem, 6vw, 5rem)" }}
      />

      {/* 3. Dark-blue band with chrome wordmark — band and PNG are sized
              independently via the constants at the top of this file. */}
      <PeeyewBanner
        bannerHeight={BANNER_HEIGHT}
        imageHeight={BANNER_IMAGE_HEIGHT}
        imageWidth={BANNER_IMAGE_WIDTH}
      />

      {/* 4. Inner content column — explicit marginTop on each child controls spacing */}
      <div
        className="mx-auto flex flex-col items-center text-center"
        style={{
          maxWidth: "min(92vw, 1200px)",
          paddingLeft: CONTENT_PADDING.x,
          paddingRight: CONTENT_PADDING.x,
          paddingTop: CONTENT_PADDING.top,
          paddingBottom: CONTENT_PADDING.bottom,
          gap: 0,
        }}
      >
        {/* Institute statement — leading "PEEYEW" sized larger than the rest.
            Font family inherits Robot Crush from <body> in layout.tsx. */}
        <h1
          className="uppercase leading-snug"
          style={{
            color: TEXT,
            fontSize: INSTITUTE_FONT_SIZE,
            letterSpacing: "0.02em",
          }}
        >
          <span style={{ fontSize: PEEYEW_WORD_SCALE }}>PEEYEW</span>
          {" is a digital design institute"}
          <br />
          {"founded by Basquiat Oriol in 2019."}
        </h1>

        {/* Mask glyph */}
        <div style={{ width: MASK_WIDTH, marginTop: SPACING.afterInstitute }}>
          <MaskGlyph />
        </div>

        {/* Mission / belief / vision */}
        <div style={{ marginTop: SPACING.afterMask }}>
          <MissionBlock />
        </div>

        {/* Tagline — inherits Robot Crush from <body> per request that all
            landing text use Robot Crush. To switch this single line back to
            Coolvetica, add: fontFamily: "var(--font-coolvetica)". */}
        <p
          className="font-bold leading-none"
          style={{
            color: TEXT,
            fontSize: TAGLINE_FONT_SIZE,
            marginTop: SPACING.afterMission,
          }}
        >
          We supply a necessary amount.
        </p>

        {/* Contact form — POSTs to /api/contact → Google Sheets webhook.
            See docs/contact-form-setup.md for the Apps Script setup. */}
        <div
          className="w-full flex justify-center"
          style={{ marginTop: SPACING.taglineToForm }}
        >
          <ContactForm />
        </div>

        {/* Email + credit — sits below the form, pulls close to the heart */}
        <div
          className="flex flex-col items-center"
          style={{
            gap: SPACING.emailToCredit,
            marginTop: SPACING.formToEmail,
          }}
        >
          <a
            href="mailto:845@peeyew.net"
            className="underline-offset-4 hover:underline"
            style={{
              color: TEXT,
              fontSize: EMAIL_FONT_SIZE,
            }}
          >
            845@peeyew.net
          </a>
          <p
            className="italic"
            style={{ color: TEXT, fontSize: CREDIT_FONT_SIZE }}
          >
            site made with love by ZLB studios
          </p>
        </div>

        {/* Heart-i — pulled close to the email block via emailToHeart */}
        <div style={{ width: HEART_WIDTH, marginTop: SPACING.emailToHeart }}>
          <HeartMark />
        </div>
      </div>
    </main>
  );
}