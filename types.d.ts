// Ambient module declarations.
//
// Next.js ships its own CSS module declaration, but some editor TS servers
// don't pick it up reliably and report:
//   "Cannot find module or type declarations for side-effect import
//    of './globals.css'"
// This declaration silences that error decisively. Side-effect CSS imports
// (`import "./globals.css"`) are valid in Next.js and Tailwind setups; this
// file just makes the TypeScript compiler agree.
declare module "*.css";
