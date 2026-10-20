"use client";

import { useId } from "react";

/** Layered vector artwork keeps each familiar crisp and independently animated. */
export default function FamiliarArt({ kind }: { kind: "cat" | "alien" }) {
  const id = useId().replace(/:/g, "");
  return kind === "cat" ? (
    <svg className="familiar-art familiar-cat" viewBox="0 0 120 144" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-fur`} x1="30" y1="25" x2="94" y2="130" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fffefb" /><stop offset=".55" stopColor="#ecece7" /><stop offset="1" stopColor="#c5ccc7" />
        </linearGradient>
        <linearGradient id={`${id}-chest`} x1="51" y1="65" x2="77" y2="130" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fffefa" /><stop offset="1" stopColor="#e4e7e0" />
        </linearGradient>
      </defs>
      <ellipse cx="61" cy="134" rx="34" ry="4" fill="#1b3028" opacity=".1" />
      <path className="familiar-cat-tail" d="M78 121c27 7 33-4 27-19-4-11-2-21 4-25" stroke="#d4dbd3" strokeWidth="10" strokeLinecap="round" />
      <path d="M39 79c-8 12-14 32-12 43 2 12 19 11 34 11 19 0 32 0 32-11-1-17-10-35-17-44Z" fill={`url(#${id}-fur)`} stroke="#b9c4bb" strokeWidth=".7" />
      <path d="M49 79c-5 17-5 36-2 50 4 4 18 4 24 0 3-15 1-37-4-50Z" fill={`url(#${id}-chest)`} />
      <path d="m48 99-1 30m22-30 2 30M44 130h9m13 0h9" stroke="#bcc6bc" strokeWidth="1" strokeLinecap="round" />
      <g className="familiar-cat-head">
        <path d="M32 46 30 17c0-3 2-4 4-2l20 18c5-1 11-1 16 0l20-18c2-2 4-1 4 2l-3 30c8 21-2 42-29 42S24 69 32 46Z" fill={`url(#${id}-fur)`} stroke="#bac4bb" strokeWidth=".8" />
        <path d="m35 24 2 19 10-7Zm54 0-3 19-10-7Z" fill="#d6bfb7" opacity=".65" />
        <g className="familiar-cat-eyes">
          <path d="M39 58q8-6 15 0-7 8-15 0Zm31 0q8-6 15 0-7 8-15 0Z" fill="#84958a" />
          <path d="M47 55v7m30-7v7" stroke="#253d35" strokeWidth="2" strokeLinecap="round" />
          <path d="M39 58q8-6 15 0m16 0q8-6 15 0" stroke="#62746a" strokeWidth="1.2" strokeLinecap="round" />
        </g>
        <path d="m59 68 3 3 3-3" fill="#a9958b" /><path d="M62 71v4m-5 0q5 3 10 0" stroke="#a9958b" strokeWidth=".8" strokeLinecap="round" />
        <path d="m36 70 16 2m-18 3 18 1m20-4 16-2m-16 6 18-1" stroke="#aab6aa" strokeWidth=".7" strokeLinecap="round" />
      </g>
      <g className="familiar-purr" stroke="#97b39f" strokeWidth="1.2" strokeLinecap="round">
        <path d="M17 53q-5 9 0 18m-5-21q-7 12 0 24" />
      </g>
    </svg>
  ) : (
    <svg className="familiar-art familiar-alien" viewBox="0 0 120 144" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-skin`} x1="32" y1="22" x2="86" y2="119" gradientUnits="userSpaceOnUse">
          <stop stopColor="#d5e3d4" /><stop offset=".5" stopColor="#a8c3b3" /><stop offset="1" stopColor="#668d7e" />
        </linearGradient>
        <linearGradient id={`${id}-eye`} x1="38" y1="46" x2="56" y2="66" gradientUnits="userSpaceOnUse">
          <stop stopColor="#314d46" /><stop offset="1" stopColor="#152d29" />
        </linearGradient>
      </defs>
      <ellipse className="familiar-alien-shadow" cx="60" cy="134" rx="25" ry="3" fill="#476f5e" opacity=".18" />
      <g className="familiar-alien-body">
        <path d="M51 83c-8 9-10 20-8 33l2 12c1 4 9 4 10 0l5-16 5 16c1 4 9 4 10 0l2-12c2-13 0-24-8-33Z" fill={`url(#${id}-skin)`} />
        <path d="M49 92c-8 3-12 11-12 21" stroke="#96b5a4" strokeWidth="7" strokeLinecap="round" />
        <g className="familiar-alien-hand" strokeLinecap="round">
          <path d="M71 92c11 4 18-5 20-19" stroke="#96b5a4" strokeWidth="7" />
          <path d="m91 75-5-8m5 8 1-13m-1 13 7-9" stroke="#a8c5b3" strokeWidth="2.5" />
        </g>
        <path d="M30 42c0-20 12-28 30-28s30 8 30 28c0 23-18 46-30 46S30 65 30 42Z" fill={`url(#${id}-skin)`} stroke="#8ba796" strokeWidth=".7" />
        <g className="familiar-alien-eyes">
          <path d="M37 47c10-1 19 6 19 18-11 1-20-6-19-18Zm46 0c-10-1-19 6-19 18 11 1 20-6 19-18Z" fill={`url(#${id}-eye)`} />
          <path d="m41 51 5 3m33-3-5 3" stroke="#d3e3d8" strokeWidth="1.4" strokeLinecap="round" opacity=".5" />
        </g>
        <path d="M56 76q4 2 8 0" stroke="#557c6c" strokeWidth="1" strokeLinecap="round" />
        <path d="M56 96q4 3 8 0" stroke="#739b88" strokeWidth=".8" />
      </g>
      <g className="familiar-signal" stroke="#a5c2b0" strokeWidth="1" strokeLinecap="round">
        <path d="M100 37q5 5 0 10m5-15q9 10 0 20" />
      </g>
    </svg>
  );
}
