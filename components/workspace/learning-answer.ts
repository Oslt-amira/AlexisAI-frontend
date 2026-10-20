import { openReadingChapter } from "./open-reading";
import { type StudyFile } from "./demo-data";

export type SourceReference = {
  fileId: string;
  title: string;
  subject: string;
  page: string;
  excerpt: string;
  documentText: string;
  figure?: { src: string; caption: string };
};
export type DetailedAnswer = {
  title: string;
  introduction: string;
  takeaway: { label: string; text: string };
  sections: {
    title: string;
    body: string;
    bullets?: string[];
    citation: number;
  }[];
  references: SourceReference[];
  diagram?: { title: string; steps: { title: string; detail: string }[] };
  figure?: { src: string; caption: string; citation: number };
  scopeCount: number;
  scopeLabel: string;
  nextQuestion: string;
};

const chapters: Record<
  string,
  {
    page: string;
    excerpt: string;
    text: string;
    figure?: { src: string; caption: string };
  }
> = {
  "nasa-sun": openReadingChapter,
  "bio-1": {
    page: "pp. 10–12",
    excerpt:
      "Cellular respiration transfers energy stored in glucose into ATP. Glycolysis takes place in the cytoplasm and produces two pyruvate molecules. The Krebs cycle takes place in the mitochondrial matrix and generates electron carriers. At the inner mitochondrial membrane, the electron transport chain establishes a proton gradient. ATP synthase uses this gradient to produce ATP. Oxygen accepts electrons at the end of the chain, forming water.",
    text: "CELL BIOLOGY — CHAPTER 04\nSample course document\n\n10 · Energy for cellular work\nCells need a continuous supply of usable energy for transport, synthesis, and movement. ATP provides a transferable source of energy. During cellular respiration, energy from glucose is transferred into ATP rather than being created from nothing.\n\n11 · Glycolysis and the Krebs cycle\nGlycolysis takes place in the cytoplasm. A six-carbon glucose molecule is split into two three-carbon pyruvate molecules, with a net gain of two ATP and reduced electron carriers. In aerobic respiration, pyruvate is converted into acetyl-CoA before entering the Krebs cycle. The Krebs cycle occurs in the mitochondrial matrix, releases carbon dioxide, and generates electron carriers.\n\n12 · Oxidative phosphorylation\nAt the inner mitochondrial membrane, electrons move through the electron transport chain. This transfer powers the movement of protons across the membrane. Protons flow back through ATP synthase, which couples this movement to ATP production. Oxygen accepts electrons at the end of the chain, forming water. Without oxygen, aerobic electron transport cannot continue normally.\n\nFigure 4.2 · Energy transfer in a mitochondrion\nThe diagram identifies the matrix, folded inner membrane, proton gradient, and ATP synthase. It is an original illustration included in this sample chapter.\n\n13 · Membranes and homeostasis\nThe cell membrane consists primarily of a phospholipid bilayer. Its selective permeability controls exchange with the environment and helps maintain internal conditions.\n\nStudy check\nExplain how a proton gradient connects the electron transport chain to ATP synthesis.",
    figure: {
      src: "/brand/mitochondrion-study.svg",
      caption:
        "Figure 4.2 · Energy transfer in a mitochondrion · Sample chapter, p. 12",
    },
  },
  "psych-1": {
    page: "pp. 6–8",
    excerpt:
      "Memory involves encoding, storage, and retrieval. Encoding connects new material to existing knowledge. Storage preserves information over time, while retrieval makes stored information accessible. Active recall requires a learner to retrieve information without looking at the answer. Spaced repetition revisits material over increasing intervals and helps counter forgetting.",
    text: "COGNITIVE PSYCHOLOGY\nSample course document\n\n6 · Encoding, storage, and retrieval\nMemory involves three connected processes. Encoding transforms experiences into representations that can be stored. Storage maintains these representations over time. Retrieval makes stored information available when it is needed. A difficulty remembering may reflect a problem in any of these processes.\n\n7 · Working memory and long-term memory\nWorking memory temporarily holds and manipulates a limited amount of information. Long-term memory stores knowledge over extended periods. Connecting unfamiliar concepts to existing knowledge can make encoding more meaningful.\n\n8 · Retrieval practice\nActive recall asks the learner to retrieve an answer before checking the source. It differs from simply recognizing a familiar paragraph. Spaced repetition revisits material across separated study sessions. Combining retrieval practice with spacing can strengthen retention.\n\nApplication\nRead a short section, close the notes, explain it in your own words, check the gaps, and schedule another review.\n\nStudy check\nWhy can a passage feel familiar even when it is difficult to explain without looking?",
  },
  "bio-2": {
    page: "pp. 4–6",
    excerpt:
      "DNA stores genetic information in nucleotide sequences. During transcription, RNA polymerase produces messenger RNA from a DNA template. During translation, ribosomes read mRNA and assemble amino acids into a protein. Changes to a DNA sequence can affect the resulting RNA or protein, although not every change alters a protein's function.",
    text: "INTRODUCTION TO GENETICS\nSample course document\n\n4 · DNA and inherited information\nDNA stores genetic information in nucleotide sequences. A gene is a region of DNA associated with a functional product. Mendel's law of segregation describes the separation of allele pairs during gamete formation. Independent assortment applies to genes that assort independently.\n\n5 · Transcription\nRNA polymerase uses a DNA template to synthesize RNA. Messenger RNA carries a sequence that can be used in protein production. The sequence is read in the correct direction and processed before translation in eukaryotic cells.\n\n6 · Translation\nRibosomes read mRNA codons and assemble amino acids into a protein. Transfer RNA links codons to amino acids. Changes to DNA can affect RNA or protein, but not every sequence change has the same effect.\n\nStudy check\nDistinguish transcription from translation and identify the role of the ribosome.",
  },
  "chem-1": {
    page: "pp. 2–4",
    excerpt:
      "Carbon commonly forms four covalent bonds. Functional groups help determine the chemical properties and reactions of an organic molecule. Alcohols contain hydroxyl groups, carboxylic acids contain carboxyl groups, and amines contain amino groups. A reaction mechanism tracks changes in bonding by following electron movement.",
    text: "ORGANIC CHEMISTRY NOTES\nSample course document\n\n2 · Carbon and bonding\nCarbon commonly forms four covalent bonds, allowing it to form chains, branches, and rings. A structural formula shows how atoms connect; molecular shape and bond polarity affect behavior.\n\n3 · Functional groups\nFunctional groups are recurring arrangements of atoms associated with characteristic reactions. Alcohols contain hydroxyl groups. Carboxylic acids contain carboxyl groups. Amines contain amino groups. Recognizing the group helps predict important chemical properties.\n\n4 · Reaction mechanisms\nA mechanism describes how bonds change during a reaction. Curved arrows show the movement of electron pairs. Begin by identifying electron-rich and electron-poor sites, then check charge and bonding after each step.\n\nStudy check\nIdentify the functional group before predicting the reaction.",
  },
  "math-1": {
    page: "pp. 3–5",
    excerpt:
      "Integration describes accumulated change and signed area under a curve. The fundamental theorem of calculus connects differentiation and integration. An indefinite integral describes a family of antiderivatives and includes an arbitrary constant. Substitution is useful when an integrand contains a function and a related derivative.",
    text: "CALCULUS — INTEGRATION\nSample course document\n\n3 · Accumulated quantities\nAn integral can describe accumulated change. A definite integral gives signed area over an interval. Positive and negative contributions may cancel.\n\n4 · Antiderivatives\nAn indefinite integral describes a family of antiderivatives. For example, the integral of x squared with respect to x is x cubed divided by three, plus an arbitrary constant. Differentiating an antiderivative checks the result.\n\n5 · Choosing a method\nSubstitution is helpful when a function and a related derivative appear together. Integration by parts is based on the product rule. Partial fractions can simplify suitable rational functions.\n\nStudy check\nExplain the difference between a definite integral and an indefinite integral.",
  },
};

export function referenceFor(file: StudyFile): SourceReference {
  const chapter =
    chapters[file.id] ||
    (file.id === "classroom-bio"
      ? chapters["bio-1"]
      : file.id === "classroom-psych"
        ? chapters["psych-1"]
        : undefined);
  return {
    fileId: file.id,
    title: file.title,
    subject: file.subject,
    page: chapter?.page || "Document summary",
    excerpt: chapter?.excerpt || file.summary,
    documentText:
      chapter?.text ||
      `${file.title}\n\n${file.summary}\n\nThis library entry is a demo placeholder. The original file is not available in this preview.`,
    figure: chapter?.figure,
  };
}
const stop = new Set([
  "what",
  "this",
  "that",
  "with",
  "from",
  "about",
  "explain",
  "please",
  "does",
  "have",
  "your",
  "notes",
  "document",
  "documents",
  "summarize",
  "summary",
  "help",
  "work",
  "make",
  "more",
  "would",
  "like",
  "the",
  "and",
  "for",
  "how",
  "why",
  "are",
  "can",
  "all",
  "give",
  "does",
]);
export function createLearningAnswer(
  question: string,
  files: StudyFile[],
  selectedIds: string[] = [],
): DetailedAnswer {
  const scope = selectedIds.length
    ? files.filter((f) => selectedIds.includes(f.id))
    : files;
  const words = (question.toLowerCase().match(/[a-z]{3,}/g) || []).filter(
    (w) => !stop.has(w),
  );
  const ranked = scope
    .map((file, index) => {
      const text = (
        file.title +
        " " +
        file.subject +
        " " +
        referenceFor(file).excerpt
      ).toLowerCase();
      const score = words.reduce(
        (sum, w) => sum + (text.includes(w) ? 1 : 0),
        0,
      );
      return { file, index, score };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index);
  const matched = ranked.filter((r) => r.score > 0);
  let chosen = (matched.length ? matched : ranked).map((r) => r.file);
  if (selectedIds.length) chosen = scope;
  // A duplicate Classroom copy should not count as independent evidence.
  const seen = new Set<string>();
  chosen = chosen.filter((f) => {
    const excerpt = referenceFor(f).excerpt;
    if (seen.has(excerpt)) return false;
    seen.add(excerpt);
    return true;
  });
  const references = chosen
    .slice(0, selectedIds.length ? 4 : 3)
    .map(referenceFor);
  const biology = references.findIndex(
    (r) => r.fileId === "bio-1" || r.fileId === "classroom-bio",
  );
  const memory = references.findIndex((r) => r.subject === "Psychology");
  const genetics = references.findIndex((r) => r.fileId === "bio-2");
  const respiration =
    biology >= 0 &&
    /respir|mitochond|atp|energy|glycol|cell|oxygen/i.test(question);
  const retention =
    memory >= 0 &&
    /memor|recall|learn|study|retain|revis|repeat/i.test(question);
  let title = respiration
    ? "How cells turn glucose into usable energy"
    : retention
      ? "How to understand it—and remember it"
      : genetics >= 0 &&
          /dna|rna|protein|genetic|transcri|translat/i.test(question)
        ? "From genetic information to a working protein"
        : references.length > 1
          ? "Connecting the ideas in your materials"
          : references[0]
            ? `Understanding ${references[0].title.replace(/—.+/, "").trim()}`
            : "Let’s start with your question";
  const sections: DetailedAnswer["sections"] = respiration
    ? [
        {
          title: "1. Start in the cytoplasm",
          body: "Glycolysis splits glucose into two smaller pyruvate molecules. It produces a small amount of ATP directly and transfers energy to electron carriers. This first stage does not take place inside the mitochondrion.",
          bullets: [
            "Input: glucose",
            "Output: pyruvate, a net gain of two ATP, and electron carriers",
          ],
          citation: biology,
        },
        {
          title: "2. Transfer energy to electron carriers",
          body: "After conversion to acetyl-CoA, the products enter the Krebs cycle in the mitochondrial matrix. Carbon dioxide is released and electron carriers collect energy for the next stage. The cycle is important because of the electrons it supplies, not because it makes most of the ATP directly.",
          citation: biology,
        },
        {
          title: "3. Use a gradient to make ATP",
          body: "At the inner membrane, the electron transport chain helps build a proton gradient. When protons flow back through ATP synthase, that flow drives ATP production. Oxygen is the final electron acceptor, which allows aerobic electron transport to continue.",
          citation: biology,
        },
      ]
    : retention
      ? [
          {
            title: "Understand before you memorize",
            body: "Connect each new idea to something you already know. Explain the idea in your own words and identify an example. This gives encoding more meaning than copying the same sentence repeatedly.",
            citation: memory,
          },
          {
            title: "Retrieve, then check",
            body: "Close your notes and try to answer a question. Only then reopen the source and correct the gaps. This separates being familiar with a paragraph from being able to retrieve and explain it.",
            bullets: [
              "Read one small section.",
              "Explain it without looking.",
              "Check the source and fix what you missed.",
            ],
            citation: memory,
          },
          {
            title: "Space the next review",
            body: "Revisit the material in a later session and retrieve it again. Spacing and retrieval work together: the goal is repeated successful recall, rather than repeatedly recognizing the same page.",
            citation: memory,
          },
        ]
      : references.map((r, i) => ({
          title: r.title,
          body: r.excerpt,
          citation: i,
        }));
  if (respiration && genetics >= 0)
    sections.push({
      title: "Connect it to protein synthesis",
      body: "The genetics notes describe ribosomes reading mRNA to build proteins. This is one example of cellular work that requires energy. Keep the roles distinct: respiration supplies usable energy, while translation uses genetic instructions to assemble a protein.",
      citation: genetics,
    });
  if (retention && biology >= 0)
    sections.push({
      title: "Try it with your biology chapter",
      body: "Use the chapter’s three respiration stages as a retrieval exercise. Name each stage, say where it happens, then explain how the stages connect. Check your answer against the chapter instead of relying only on recognition.",
      citation: biology,
    });
  if (respiration && retention)
    sections.push({
      title: "Turn the explanation into retrieval practice",
      body: "Your psychology notes recommend retrieving an answer before checking it. Close this explanation, name the three stages of respiration, and say where each one happens. Reopen the chapter to correct any gaps, then schedule another review.",
      citation: memory,
    });
  const diagram = respiration
    ? {
        title: "The process at a glance",
        steps: [
          { title: "Glycolysis", detail: "Cytoplasm · glucose → pyruvate" },
          {
            title: "Krebs cycle",
            detail: "Matrix · energy to electron carriers",
          },
          {
            title: "Oxidative phosphorylation",
            detail: "Inner membrane · gradient → ATP",
          },
        ],
      }
    : retention
      ? {
          title: "A practical learning loop",
          steps: [
            {
              title: "Understand",
              detail: "Connect the idea to prior knowledge",
            },
            { title: "Recall", detail: "Explain it with your notes closed" },
            { title: "Review", detail: "Check gaps, then return later" },
          ],
        }
      : genetics >= 0
        ? {
            title: "The flow of genetic information",
            steps: [
              { title: "DNA", detail: "Stores the sequence" },
              {
                title: "mRNA",
                detail: "Transcription copies the instructions",
              },
              { title: "Protein", detail: "Translation assembles amino acids" },
            ],
          }
        : undefined;
  const figure =
    respiration && references[biology]?.figure
      ? { ...references[biology].figure!, citation: biology }
      : undefined;
  return {
    title,
    introduction: respiration
      ? "Cellular respiration is a connected series of energy transfers. The useful way to understand it is to follow where each stage happens and what it passes to the next stage."
      : retention
        ? "Your material points to three connected habits: meaningful encoding, active retrieval, and spaced review. Here is how to apply them in a study session."
        : references.length
          ? `Here is an explanation grounded in ${references.length === 1 ? "the relevant material" : "the relevant passages across your materials"}. You can open each citation to inspect the exact reference text.`
          : "Your library is empty. Add a document to explore a source-grounded answer, or try one of the included sample courses.",
    takeaway: {
      label: "Key idea",
      text: respiration
        ? "The electron transport chain builds the gradient. ATP synthase uses the gradient to make ATP."
        : retention
          ? "Being able to recognize a page is different from being able to explain it without looking."
          : references[0]
            ? references[0].excerpt.split(". ")[0] + "."
            : "Start with a course document to make the explanation specific.",
    },
    sections,
    references,
    diagram,
    figure,
    scopeCount: scope.length,
    scopeLabel: selectedIds.length
      ? `${scope.length} selected ${scope.length === 1 ? "document" : "documents"}`
      : `Your library · ${scope.length} documents`,
    nextQuestion: respiration
      ? "Why does oxygen matter if glycolysis can happen without it?"
      : retention
        ? "Can you explain the topic in three sentences without checking your notes?"
        : "Which of these ideas would you like to work through in more detail?",
  };
}
