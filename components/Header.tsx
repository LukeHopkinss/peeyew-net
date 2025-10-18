"use client";
import { useEffect, useState } from "react";

export default function Header() {
  const [shadow, setShadow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShadow(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 inset-x-0 z-50 transition-shadow ${
        shadow ? "shadow-soft" : ""
      } bg-transparent`}
    >
      <nav className="mx-auto max-w-[1400px] px-6 py-6 flex items-center">
        {/* Stretched menu — huge spacing across width */}
        <ul className="ml-10 flex-1 flex items-center justify-between font-extrabold text-menuBlue text-2xl sm:text-3xl">
          {["iNFO","PoTA tv", "PYM mag", "gallery", "web tech"].map((label) => (
            <li
              key={label}
              className="cursor-pointer transition-colors hover:text-redBrand"
            >
              {label}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
