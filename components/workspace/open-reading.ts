import type { StudyFile } from "./demo-data";

// NASA-authored text, reproduced as a short educational reading. No NASA marks.
export const openReadingSource = {
  url: "https://science.nasa.gov/sun/facts/",
  publisher: "NASA Science",
  title: "Our Sun: Facts",
  rights:
    "Public-domain NASA text · Selected excerpts; section headings added by Alexis.",
  rightsUrl: "https://www.nasa.gov/nasa-brand-center/images-and-media/",
};
export const openReadingSections = [
  {
    title: "A star at the center",
    text: "Our Sun is a 4.5 billion-year-old yellow dwarf star – a hot glowing ball of hydrogen and helium – at the center of our solar system.",
    explanation:
      "The Sun is a star made mostly of hydrogen and helium. ‘Yellow dwarf’ describes its type; it does not mean that the Sun is small compared with Earth.",
  },
  {
    title: "Gravity holds the system together",
    text: "The Sun is the only star in our solar system. It is the center of our solar system, and its gravity holds the solar system together. Everything in our solar system revolves around it – the planets, asteroids, comets, and tiny bits of space debris.",
    explanation:
      "Gravity is the Sun’s pull on other objects. Planets keep moving while the Sun pulls them inward; together, these motions produce an orbit rather than a straight path through space.",
  },
  {
    title: "A star made of plasma",
    text: "The Sun is made of super-hot, electrically charged gas called plasma. This plasma rotates at different speeds on different parts of the Sun. At its equator, the Sun completes one rotation in 25 Earth days.",
    explanation:
      "Plasma is gas whose particles carry electrical charge. The Sun is not a rigid solid, so its different regions can turn at different speeds. The 25-day rotation refers to its equator, not every part of the Sun.",
  },
  {
    title: "Where the energy comes from",
    text: "The core is the hottest part of the Sun. Nuclear reactions here – where hydrogen is fused to form helium – power the Sun’s heat and light.",
    explanation:
      "Fusion joins hydrogen nuclei to make helium and releases energy. It happens in the core, where conditions allow the nuclei to combine. That energy ultimately supplies the heat and light we receive.",
  },
];
export const openReadingFile: StudyFile = {
  id: "nasa-sun",
  title: "Our Sun — NASA Science",
  subject: "Astronomy",
  kind: "Article",
  pages: 1,
  date: "Sample reading",
  color: "sage",
  summary:
    "The Sun is a star made mostly of hydrogen and helium. Its gravity holds the solar system together. Its plasma rotates at different speeds, while nuclear fusion in its core powers its heat and light.",
};
export const openReadingChapter = {
  page: "Selected excerpts · sections 1–4",
  excerpt: openReadingSections.map((section) => section.text).join(" "),
  text:
    "OUR SUN: FACTS\nNASA Science · Public-domain educational excerpts\n\n" +
    openReadingSections
      .map(
        (section, index) => `${index + 1} · ${section.title}\n${section.text}`,
      )
      .join("\n\n"),
};
