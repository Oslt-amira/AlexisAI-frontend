import { initialFiles, type StudyFile } from "./demo-data";
import { referenceFor } from "./learning-answer";
export type PracticeQuestion = {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};
export type StudyCard = { question: string; answer: string };
function sections(file: StudyFile) {
  return referenceFor(file)
    .documentText.split("\n\n")
    .filter((block) => /^\d+ · /.test(block) && block.includes("\n"))
    .map((block) => ({
      title: block.split("\n")[0].replace(/^\d+ · /, ""),
      body: block.split("\n").slice(1).join(" "),
      file,
    }));
}
export function createPracticeSet(files: StudyFile[]) {
  if (files.length === 1 && files[0].id === "nasa-sun") {
    const questions: PracticeQuestion[] = [
      {
        question: "What powers the Sun’s heat and light?",
        options: [
          "Hydrogen fusing into helium in the core",
          "Chemical combustion at the surface",
          "Friction between the planets",
          "Reflected light from nearby stars",
        ],
        answer: 0,
        explanation:
          "The reading identifies nuclear reactions in the core, where hydrogen is fused to form helium, as the source of the Sun’s heat and light.",
      },
      {
        question:
          "Why can different parts of the Sun rotate at different speeds?",
        options: [
          "Its gravity switches off at the poles",
          "It is made of plasma rather than a rigid solid",
          "Its core does not rotate",
          "It has several solid surfaces",
        ],
        answer: 1,
        explanation:
          "The Sun is made of electrically charged gas called plasma. It does not rotate as a single rigid body; the reading gives about 25 Earth days for a rotation at its equator.",
      },
      {
        question: "What holds the solar system together?",
        options: [
          "Earth’s magnetic field",
          "The solar wind pushing planets outward",
          "The Sun’s gravity",
          "Light reflected by the planets",
        ],
        answer: 2,
        explanation:
          "The document states that the Sun’s gravity holds the solar system together. Planets, asteroids, comets, and debris revolve around it.",
      },
      {
        question: "Which elements make up most of the Sun?",
        options: [
          "Oxygen and nitrogen",
          "Iron and silicon",
          "Carbon and oxygen",
          "Hydrogen and helium",
        ],
        answer: 3,
        explanation:
          "NASA describes the Sun as a hot glowing ball of hydrogen and helium. Hydrogen also provides the fuel for fusion in the core.",
      },
    ];
    return {
      questions,
      cards: questions.map((item) => ({
        question: item.question,
        answer: item.options[item.answer] + ". " + item.explanation,
      })),
      fileIds: ["nasa-sun"],
    };
  }
  const seen = new Set<string>();
  const unique = files.filter((file) => {
    const excerpt = referenceFor(file).excerpt;
    if (seen.has(excerpt)) return false;
    seen.add(excerpt);
    return true;
  });
  const source = unique.map(sections);
  const items: ReturnType<typeof sections> = [];
  for (let i = 0; i < 5; i++)
    for (const entry of source) if (entry[i]) items.push(entry[i]);
  const chosen = items.slice(0, 5);
  const pool = initialFiles
    .flatMap(sections)
    .map((section) => section.body.split(/(?<=[.!?])\s/)[0])
    .filter(Boolean);
  const cards: StudyCard[] = chosen.map((item) => ({
    question: `Explain ${item.title.toLowerCase()}.`,
    answer: item.body,
  }));
  const questions: PracticeQuestion[] = chosen.map((item, index) => {
    const correct = item.body.split(/(?<=[.!?])\s/)[0];
    const other = pool
      .filter((text) => text !== correct && !item.body.includes(text))
      .slice(index, index + 3);
    while (other.length < 3)
      other.push(
        [
          "All of these processes take place in the nucleus.",
          "This section describes an unrelated process.",
          "These concepts are interchangeable in every situation.",
        ][other.length],
      );
    const options = [correct, ...other];
    const offset = index % 4;
    const rotated = [...options.slice(offset), ...options.slice(0, offset)];
    return {
      question: `Which statement best matches “${item.title}”?`,
      options: rotated,
      answer: rotated.indexOf(correct),
      explanation: `${item.file.title}: ${item.body}`,
    };
  });
  return {
    questions,
    cards,
    fileIds: Array.from(new Set(chosen.map((item) => item.file.id))),
  };
}
