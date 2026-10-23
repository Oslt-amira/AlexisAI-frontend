import { openReadingFile } from "./open-reading";
export type StudyFile = {
  id: string;
  title: string;
  subject: string;
  kind: string;
  pages: number;
  date: string;
  color: string;
  summary: string;
  source?: "classroom" | "upload";
};
export const initialFiles: StudyFile[] = [
  {
    id: "bio-1",
    title: "Cell Biology — Chapter 04",
    subject: "Biology",
    kind: "PDF",
    pages: 24,
    date: "22 Oct 2024",
    color: "sage",
    summary:
      "Cells convert energy through cellular respiration. Glycolysis occurs in the cytoplasm, the Krebs cycle in the mitochondrial matrix, and oxidative phosphorylation at the inner mitochondrial membrane. ATP stores energy for cellular work. The membrane's selective permeability maintains homeostasis.",
  },
  {
    id: "psych-1",
    title: "Cognitive Psychology",
    subject: "Psychology",
    kind: "PDF",
    pages: 18,
    date: "21 Oct 2024",
    color: "sand",
    summary:
      "Memory has three key processes: encoding, storage, and retrieval. Working memory temporarily holds information, while long-term memory stores knowledge over time. Active recall strengthens retrieval pathways and spaced repetition helps counter the forgetting curve.",
  },
  {
    id: "chem-1",
    title: "Organic Chemistry Notes",
    subject: "Chemistry",
    kind: "DOCX",
    pages: 12,
    date: "21 Oct 2024",
    color: "lavender",
    summary:
      "Carbon forms four covalent bonds. Functional groups determine a molecule's chemical properties. Alcohols contain hydroxyl groups, carboxylic acids contain carboxyl groups, and amines contain amino groups. Reaction mechanisms track electron movement.",
  },
  {
    id: "bio-2",
    title: "Introduction to Genetics",
    subject: "Biology",
    kind: "PDF",
    pages: 32,
    date: "16 Oct 2024",
    color: "sage",
    summary:
      "DNA stores genetic information in nucleotide sequences. During transcription, RNA polymerase produces messenger RNA. Ribosomes translate mRNA into proteins. Mendel's laws describe patterns of inheritance, including segregation and independent assortment.",
  },
  {
    id: "math-1",
    title: "Calculus — Integration",
    subject: "Mathematics",
    kind: "PDF",
    pages: 16,
    date: "15 Oct 2024",
    color: "peach",
    summary:
      "Integration finds accumulated quantities and the area under a curve. The fundamental theorem of calculus links integration and differentiation. Techniques include substitution, integration by parts, and partial fractions.",
  },
  openReadingFile,
];
export const flashcards = [
  {
    question: "What is the primary function of mitochondria?",
    answer:
      "To produce ATP through cellular respiration, providing usable energy for the cell.",
  },
  {
    question: "Where does glycolysis take place?",
    answer:
      "In the cytoplasm. One glucose molecule is broken down into two pyruvate molecules, yielding a net of 2 ATP and 2 NADH.",
  },
  {
    question: "What does selective permeability mean?",
    answer:
      "The cell membrane allows certain substances to pass through while restricting others, helping maintain homeostasis.",
  },
  {
    question: "What is the role of ribosomes?",
    answer:
      "Ribosomes translate messenger RNA into proteins by linking amino acids in the correct sequence.",
  },
  {
    question: "How are active and passive transport different?",
    answer:
      "Active transport uses energy to move substances against a concentration gradient. Passive transport moves substances down the gradient without energy input.",
  },
];
export const quizQuestions = [
  {
    question: "Which organelle produces most of the ATP in a eukaryotic cell?",
    options: ["Golgi apparatus", "Mitochondrion", "Nucleus", "Lysosome"],
    answer: 1,
    explanation:
      "Mitochondria generate most ATP through oxidative phosphorylation at the inner mitochondrial membrane.",
  },
  {
    question: "Where does glycolysis occur?",
    options: ["Mitochondrial matrix", "Nucleus", "Cytoplasm", "Cell membrane"],
    answer: 2,
    explanation:
      "Glycolysis takes place in the cytoplasm and converts glucose into two pyruvate molecules.",
  },
  {
    question: "Which process requires cellular energy?",
    options: [
      "Simple diffusion",
      "Osmosis",
      "Facilitated diffusion",
      "Active transport",
    ],
    answer: 3,
    explanation:
      "Active transport uses ATP to move molecules against their concentration gradient.",
  },
  {
    question: "Which structure is responsible for protein synthesis?",
    options: ["Ribosome", "Lysosome", "Centriole", "Vacuole"],
    answer: 0,
    explanation: "Ribosomes read mRNA and assemble amino acids into proteins.",
  },
  {
    question: "What is the main structural component of the cell membrane?",
    options: ["Cellulose", "A phospholipid bilayer", "DNA", "Starch"],
    answer: 1,
    explanation:
      "The phospholipid bilayer creates a selectively permeable barrier around the cell.",
  },
];
export type StudyTask = {
  id: string;
  title: string;
  subject: string;
  time: string;
  duration: string;
  done: boolean;
  day: number;
  date?: string;
};
export const initialTasks: StudyTask[] = [
  {
    id: "t1",
    title: "Cell biology deep dive",
    subject: "Biology",
    time: "09:00",
    duration: "45 min",
    done: true,
    day: 0,
  },
  {
    id: "t2",
    title: "Review cellular respiration",
    subject: "Biology",
    time: "14:00",
    duration: "30 min",
    done: false,
    day: 0,
  },
  {
    id: "t3",
    title: "Cognitive psychology flashcards",
    subject: "Psychology",
    time: "16:30",
    duration: "20 min",
    done: false,
    day: 0,
  },
  {
    id: "t4",
    title: "Organic chemistry practice",
    subject: "Chemistry",
    time: "10:00",
    duration: "45 min",
    done: false,
    day: 1,
  },
  {
    id: "t5",
    title: "Genetics & inheritance",
    subject: "Biology",
    time: "14:00",
    duration: "30 min",
    done: false,
    day: 2,
  },
  {
    id: "t6",
    title: "Integration practice problems",
    subject: "Mathematics",
    time: "11:00",
    duration: "45 min",
    done: false,
    day: 3,
  },
  {
    id: "t7",
    title: "Weekly knowledge check",
    subject: "All subjects",
    time: "15:00",
    duration: "25 min",
    done: false,
    day: 4,
  },
];
export const subjects = [
  "All",
  "Biology",
  "Psychology",
  "Chemistry",
  "Mathematics",
];
export function demoAnswer(question: string, file?: StudyFile) {
  const q = question.toLowerCase();
  if (q.includes("summari") || q.includes("summary"))
    return {
      title: `The big picture${file ? `: ${file.title}` : ""}`,
      body: file?.summary || initialFiles[0].summary,
      points: [
        "Start with the core concepts, then connect them to a real example.",
        "Test your understanding with active recall instead of rereading.",
        "Revisit the material tomorrow to strengthen long-term memory.",
      ],
    };
  if (q.includes("plan"))
    return {
      title: "A little structure goes a long way.",
      body: "Here’s a focused 3-day plan for your cell biology revision. Aim for 45 minutes each day, with a short break halfway through.",
      points: [
        "Day 1 · Review cell structures and make a one-page summary.",
        "Day 2 · Study cellular respiration and review your flashcards.",
        "Day 3 · Complete a practice quiz and revisit any missed concepts.",
      ],
    };
  if (q.includes("memory") || q.includes("psychology"))
    return {
      title: "Think of memory as a well-worn path.",
      body: initialFiles[1].summary,
      points: [
        "Encoding: connect a new idea to something you already know.",
        "Storage: leave time between study sessions.",
        "Retrieval: close your notes and explain the concept in your own words.",
      ],
    };
  if (q.includes("chemistry") || q.includes("carbon"))
    return {
      title: "It starts with carbon’s four bonds.",
      body: initialFiles[2].summary,
      points: [
        "Identify the functional group first.",
        "Follow the electrons through each reaction step.",
        "Practice predicting products, then explain your reasoning.",
      ],
    };
  if (q.includes("integr") || q.includes("calculus"))
    return {
      title: "Integration is accumulation.",
      body: initialFiles[4].summary,
      points: [
        "For ∫ x² dx, raise the exponent and divide: x³/3 + C.",
        "Use substitution when you recognize a function and its derivative.",
        "Check an indefinite integral by differentiating your answer.",
      ],
    };
  return {
    title: "Let’s make cellular respiration click.",
    body: "Think of a cell as a small city. Mitochondria are its power stations: they turn the energy in glucose into ATP, a form the cell can actually use. This happens in three connected stages.",
    points: [
      "Glycolysis · In the cytoplasm, glucose splits into two pyruvate molecules. Net gain: 2 ATP.",
      "Krebs cycle · In the mitochondrial matrix, acetyl-CoA is broken down, releasing CO₂ and producing electron carriers.",
      "Oxidative phosphorylation · At the inner membrane, electrons power a proton gradient that drives ATP synthase.",
    ],
  };
}
