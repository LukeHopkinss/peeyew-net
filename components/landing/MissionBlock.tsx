import { Fragment } from "react";

/**
 * Three-row block: mission / belief / vision.
 *
 * Per mockup:
 *   - Labels ("mission:", "belief:", "vision:") are BLACK text on the page bg —
 *     no highlight.
 *   - Statements (after the colon) are WHITE text on a BLACK highlight that
 *     hugs the text tightly.
 *
 * Layout: a 2-column CSS grid. Both columns are `auto`-sized so labels
 * right-align to a shared edge and statement highlights start at a shared x.
 * Using a grid (rather than a <table>) keeps the markup semantically honest —
 * this is a visual layout, not tabular data.
 */
const ROWS: Array<{ label: string; text: string }> = [
  { label: "mission:", text: "revolutionize the cultural lexicon." },
  { label: "belief:", text: "everyone deserves access to tools for creation." },
  { label: "vision:", text: "a creatively competent culture." },
];

const ROW_FONT_SIZE = "clamp(13px, 2.4vw, 28px)";

export default function MissionBlock() {
  return (
    <div
      className="inline-grid items-center"
      style={{
        gridTemplateColumns: "auto auto",
        rowGap: "clamp(0.15rem, 0.4vw, 0.4rem)",
        lineHeight: 1.05,
        fontSize: ROW_FONT_SIZE,
      }}
    >
      {ROWS.map((row) => (
        <Fragment key={row.label}>
          {/* Label — black text on page bg, right-aligned so colons line up */}
          <div
            className="text-right whitespace-nowrap"
            style={{
              color: "#000000",
              paddingRight: "clamp(0.35rem, 0.8vw, 0.6rem)",
            }}
          >
            {row.label}
          </div>
          {/* Statement — white text on black highlight */}
          <div
            className="text-left"
            style={{
              backgroundColor: "#000000",
              color: "#ffffff",
              paddingLeft: "clamp(0.35rem, 0.9vw, 0.7rem)",
              paddingRight: "clamp(0.35rem, 0.9vw, 0.7rem)",
              paddingTop: "clamp(0.1rem, 0.25vw, 0.25rem)",
              paddingBottom: "clamp(0.1rem, 0.25vw, 0.25rem)",
            }}
          >
            {row.text}
          </div>
        </Fragment>
      ))}
    </div>
  );
}
