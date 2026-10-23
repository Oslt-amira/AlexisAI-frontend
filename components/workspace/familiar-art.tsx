"use client";

import { useId } from "react";

export type FamiliarKind = "mushroom" | "cat" | "alien";

export default function FamiliarArt({ kind }: { kind: FamiliarKind }) {
  const id = useId().replace(/:/g, "");
  return (
    <span className={`familiar-art sprite-${kind}`} aria-hidden="true">
      <svg viewBox="0 0 120 120" fill="none">
        <defs>
          <linearGradient id={`${id}-cap`} x1="35" y1="31" x2="84" y2="68" gradientUnits="userSpaceOnUse">
            <stop stopColor="#D8B49A" /><stop offset=".45" stopColor="#A77F68" /><stop offset="1" stopColor="#624D46" />
          </linearGradient>
          <linearGradient id={`${id}-stem`} x1="52" y1="61" x2="67" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#9F8F7C" /><stop offset=".35" stopColor="#E8DDC7" /><stop offset=".7" stopColor="#CEC0A5" /><stop offset="1" stopColor="#958775" />
          </linearGradient>
          <linearGradient id={`${id}-fur`} x1="45" y1="53" x2="65" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FCFAF5" /><stop offset=".5" stopColor="#E4E4DF" /><stop offset="1" stopColor="#9DA7AA" />
          </linearGradient>
          <linearGradient id={`${id}-tail`} x1="82" y1="78" x2="47" y2="104" gradientUnits="userSpaceOnUse">
            <stop stopColor="#C9D0D0" /><stop offset=".55" stopColor="#F5F3ED" /><stop offset="1" stopColor="#B1BABB" />
          </linearGradient>
          <radialGradient id={`${id}-pearl`} cx=".29" cy=".25" r=".85">
            <stop stopColor="#E6EEE6" /><stop offset=".4" stopColor="#B4CFCA" /><stop offset=".75" stopColor="#709D9E" /><stop offset="1" stopColor="#3F686F" />
          </radialGradient>
          <linearGradient id={`${id}-veil`} x1="40" y1="28" x2="77" y2="104" gradientUnits="userSpaceOnUse">
            <stop stopColor="#EEF7EE" stopOpacity=".65" /><stop offset="1" stopColor="#9AC4BD" stopOpacity="0" />
          </linearGradient>
        </defs>
        {kind === "mushroom" && <g className="mushroom-body">
          <path d="M56 58C58 70 54 85 49 98Q57 103 70 98C62 86 64 71 65 58Z" fill={`url(#${id}-stem)`} />
          <path d="M59 69Q56 89 55 97M63 70Q60 86 63 97" stroke="#F4EBDD" strokeWidth=".6" opacity=".4" />
          <g className="mushroom-cap">
            <path d="M22 59C30 48 37 28 58 27C79 25 86 46 100 59Q80 69 59 67Q39 68 22 59Z" fill={`url(#${id}-cap)`} />
            <path d="M22 59Q59 53 100 59Q79 72 59 68Q37 68 22 59Z" fill="#6D5D53" />
            <path d="M29 60L54 66M38 59L55 66M48 58L58 67M60 58V67M72 58L64 67M83 59L67 67M93 60L69 66" stroke="#D7C7AE" strokeWidth=".65" opacity=".5" />
            <path d="M31 51C41 34 49 29 58 30" stroke="#EED1B9" strokeWidth="1" strokeLinecap="round" opacity=".5" />
            <path d="M42 42L44 40M55 35L57 34M72 40L74 42M80 49L82 51M39 51L41 50" stroke="#E5C9AE" strokeWidth="1.2" strokeLinecap="round" opacity=".45" />
          </g>
          <g className="mushroom-sprout" stroke="#8A9B80" strokeWidth=".8"><path d="M78 100Q78 90 84 86" /><path d="M81 91Q79 82 87 82Q89 89 81 91Z" fill="#9DAA8C" /></g>
        </g>}
        {kind === "cat" && <>
          <g className="cat-body">
            <path d="M29 87C32 74 46 57 68 57C87 57 98 70 96 83Q94 99 71 99L32 98Q22 96 29 87Z" fill={`url(#${id}-fur)`} />
            <path d="M65 64C80 64 88 74 85 83" stroke="#FFFFFF" strokeWidth="1" opacity=".4" />
            <g className="cat-head">
              <path className="cat-ear" d="M32 75L30 51L42 61L53 53L54 75" fill={`url(#${id}-fur)`} />
              <path d="M34 63L33 57L39 63M47 63L51 58L51 66" fill="#B9B5AE" opacity=".6" />
              <path d="M31 70Q42 60 53 70L58 83Q56 93 42 94Q27 94 27 84Z" fill={`url(#${id}-fur)`} />
              <path d="M31 81L37 82M45 82L50 80" stroke="#737F80" strokeWidth=".8" strokeLinecap="round" />
              <path d="M39 86L42 86L40.5 88Z" fill="#93958E" />
            </g>
            <path d="M41 96L65 96" stroke="#F2F2EB" strokeWidth="4" strokeLinecap="round" />
          </g>
          <path className="cat-tail" d="M90 81C103 100 73 109 51 101" stroke={`url(#${id}-tail)`} strokeWidth="8" strokeLinecap="round" />
        </>}
        {kind === "alien" && <g className="spirit-body">
          <path className="spirit-fins" d="M44 53Q29 61 36 79Q37 63 48 64M77 57Q93 69 84 84Q85 67 73 68" fill="#8CB4B1" opacity=".45" />
          <path d="M61 25C82 29 86 50 78 66Q70 81 73 98Q55 95 45 78C33 59 39 26 61 25Z" fill={`url(#${id}-pearl)`} />
          <path d="M57 30C43 40 46 63 53 74Q62 89 73 98Q48 86 43 66C38 45 45 30 57 30Z" fill={`url(#${id}-veil)`} />
          <path d="M52 35Q58 29 65 32" stroke="#F0F9F0" strokeWidth="1" strokeLinecap="round" opacity=".6" />
          <g className="mascot-eyes" fill="#43656A"><ellipse cx="54" cy="55" rx="1" ry="2.7" /><ellipse cx="65" cy="55" rx="1" ry="2.7" /></g>
          <path className="spirit-hand" d="M47 76Q56 83 65 78" stroke="#CEE1D8" strokeWidth=".8" opacity=".45" />
        </g>}
      </svg>
    </span>
  );
}
