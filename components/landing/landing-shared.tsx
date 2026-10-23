export const disciplines = {
  Medicine: {
    index: "01",
    name: "From the lecture to the clinical picture.",
    description:
      "Tailored medical courses, from the foundations to residency revision.",
    topics: [
      "Anatomy & physiology",
      "Clinical reasoning",
      "Residency preparation",
    ],
    question: "Help me connect cardiac physiology to the clinical signs.",
    icon: "M37 22v30M22 37h30",
  },
  STEM: {
    index: "02",
    name: "Understand the method. Then make it yours.",
    description:
      "Tailored STEM courses to connect concepts and work through the method.",
    topics: ["Mathematics", "Science & engineering", "Problem solving"],
    question: "Walk me through the reasoning behind a differential equation.",
    icon: "M21 51l16-30 16 30H21Z",
  },
  Law: {
    index: "03",
    name: "Read closely. Reason clearly.",
    description:
      "Tailored law courses to connect principles, cases and arguments.",
    topics: ["Legal principles", "Case analysis", "Tunisian law"],
    question: "Help me structure an analysis of this legal principle.",
    icon: "M37 20v34M24 54h26M22 29h30M26 29l-8 14h16l-8-14ZM48 29l-8 14h16l-8-14Z",
  },
} as const;

export const faqs = [
  [
    "What is Alexis, and how does it help me study?",
    "Alexis brings your course materials, conversations, and study plans into one workspace. Ask for an explanation, turn notes into summaries, flashcards or quizzes, and organise what to study next.",
  ],
  [
    "Can I upload my own lecture notes and documents?",
    "Yes. Add documents to your library or attach them to a conversation. Choose which documents Alexis should use, then ask questions about them. You can also read a document with your notes and its summary alongside.",
  ],
  [
    "Is Alexis only for medicine, STEM and law students?",
    "No. You can work with your own materials across subjects. Medicine, STEM and law students also have tailored course libraries to start from, including clinical reasoning, problem solving and case analysis.",
  ],
  [
    "What’s included in Free, and what does Plus add?",
    "Free includes up to 20 documents and limited conversations. Plus is $12 per month and adds up to 200 documents, unlimited conversations, Google Calendar and Classroom sync, and personalised plans and progress tracking. Plus starts with a one-month free trial; cancel before it ends to avoid the monthly charge.",
  ],
  [
    "Can I connect my classes and calendar?",
    "Yes. Plus includes Google Classroom and Google Calendar sync, so you can bring course materials and your schedule into Alexis. Manage your study sessions in the planner alongside that context.",
  ],
  [
    "What happens when I turn on Focus mode?",
    "Focus simplifies the workspace so you can stay with one task. Choose a companion for your session; it gives you a gentle reminder to return when you leave your study flow. Focus is off until you turn it on.",
  ],
];

export type Discipline = keyof typeof disciplines;
