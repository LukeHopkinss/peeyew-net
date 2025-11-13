"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PaintCanvas from "../components/PaintCanvas";
import Header from "../components/Header";
import Gallery from "../components/Gallery";
import DecryptedText from "../components/DecryptedText";

// words to pick from
const WORDS = [
  "homebase",
  "warehouse",
  "satire",
  "paradise",
  "play",
  "euphoria",
  "laboratory",
  "hangout",
  "studio",
  "playground",
  "greenhouse",
  "archive",
  "jukebox",
  "bazaar",
  "daydream",
  "interface",
  "television",
  "zine",
  "gallery",
  "club",
];

const randomWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];

export default function Page() {
  const [entered, setEntered] = useState(false);

  // Fix hydration mismatch:
  const [word, setWord] = useState<string>("studio");
  const [mounted, setMounted] = useState<boolean>(false);

  // NEW: keep top (header + gallery) hidden until we've scrolled to bottom
  const [ready, setReady] = useState(false);

  // scroll to bottom on first load, then reveal top next frame to avoid flash
  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "auto" });
      window.requestAnimationFrame(() => setReady(true));
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  // After mount, mark mounted and set randomized word
  useEffect(() => {
    setMounted(true);
    setWord(randomWord());
  }, []);

  return (
    <main className="relative min-h-screen w-full">
      {/* TOP SECTION with gradient flipped: white → blue
          Hidden until `ready` so the dome gallery never flashes on first paint */}
      <div
        className={`bg-gradient-to-b from-[#7fa4ff] to-white transition-opacity duration-0 ${
          ready ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <Header />
        <section id="top-gallery" className="pt-1">
          <Gallery />
        </section>
      </div>

      {/* WHITE LANDING / BOTTOM SECTION */}
      <section className="relative min-h-screen bg-white flex items-center justify-center overflow-hidden">
        <AnimatePresence>
          {!entered && (
            <motion.div
              key="landing"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center select-none z-20"
            >
              <div className="max-w-4xl px-6 relative z-30">
                {/* clickable title */}
                <h1
                  onClick={() => {
                    setEntered(true);
                    setWord(randomWord()); // re-roll on enter click, too
                  }}
                  className="landing-title cursor-pointer text-2xl sm:text-4xl md:text-3xl text-darkBlue drop-shadow-xl z-30 relative"
                >
                  peeyew is a digital design{" "}
                  {mounted ? (
                    <DecryptedText
                      text={word}
                      animateOn="view"
                      revealDirection="center"
                      speed={50}
                      maxIterations={30}
                      className="font-bold"
                      encryptedClassName="opacity-100"
                      parentClassName=""
                    />
                  ) : (
                    <span className="font-bold">{word}</span>
                  )}
                </h1>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* painting canvas + Right "more ↑" label */}
        {entered && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 w-full flex items-center justify-center px-6"
          >
            {/* Right label (hidden on very small screens to avoid overlap) */}
            <div className="hidden sm:block absolute right-2 md:right-6 top-1/3 -translate-y-1/2 pointer-events-none select-none">
              <div className="flex items-center gap-2 text-darkBlue">
                <span className="font-semibold tracking-wide">more</span>
                <span className="text-2xl leading-none">↑</span>
              </div>
            </div>

            <PaintCanvas />
          </motion.div>
        )}

        {/* grass (thing.png) */}
        <div className="absolute bottom-0 inset-x-0">
          <img
            src="/thing.png"
            alt="grass"
            className="w-full h-auto object-cover block"
          />
        </div>
      </section>
    </main>
  );
}
