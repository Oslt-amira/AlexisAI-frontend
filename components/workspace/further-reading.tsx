import { ArrowUpRight, BookOpen, Play } from "lucide-react";

const sources = [
  {
    match: /respiration|mitochondri|atp|glycolysis/i,
    title: "Cellular respiration, explained visually",
    publisher: "Khan Academy · YouTube",
    href: "https://www.youtube.com/watch?v=2f7YwCtHcgk",
    video: true,
  },
  {
    match: /memory|psychology|recall|encoding/i,
    title: "How memory functions",
    publisher: "OpenStax · Article",
    href: "https://openstax.org/books/psychology-2e/pages/8-1-how-memory-functions",
  },
  {
    match: /chemistry|functional group|organic/i,
    title: "A closer look at functional groups",
    publisher: "OpenStax · Article",
    href: "https://openstax.org/books/organic-chemistry/pages/3-1-functional-groups",
  },
  {
    match: /calculus|integral|integration/i,
    title: "Understanding the definite integral",
    publisher: "OpenStax · Article",
    href: "https://openstax.org/books/calculus-volume-1/pages/5-2-the-definite-integral",
  },
  {
    match: /genetic|dna|transcription|translation/i,
    title: "From RNA to protein: translation",
    publisher: "National Human Genome Research Institute · Article",
    href: "https://www.genome.gov/genetics-glossary/Translation",
  },
  {
    match: /sun|solar|helium|fusion/i,
    title: "Explore our Sun",
    publisher: "NASA Science · Article",
    href: "https://science.nasa.gov/sun/",
  },
];

export default function FurtherReading({ topic }: { topic: string }) {
  const source = sources.find((item) => item.match.test(topic));
  if (!source) return null;
  return (
    <aside className="answer-further-reading p-3 rounded-md border-[1px] border-muted-foreground/20 bg-muted/10">
      <p className="italic pb-2 ">
        Curious about more?{" "}
        {source.video
          ? "Watch this explanation."
          : "Take a look at this article."}
      </p>
      <a href={source.href} target="_blank" rel="noopener noreferrer">
        <BookOpen size={16} />
        <span>
          <b>{source.title}</b>
          <small>{source.publisher}</small>
        </span>
      </a>
    </aside>
  );
}
