import { cn } from "@/lib/utils";
import React from "react";
import { SparklesCore } from "./particles";
import { QaContent } from "./qaFeature";
import QcmContent from "./qcmFeature";
import { HistoryContent } from "./historyFeature";
import { SuggestionContent } from "./suggestionFeature";
import WritingContent from "./writingFeature";
import { ProblemSolvingContent } from "./problemSolvingFeature";

export default function FeatureCard({
  main,
  title,
  description,
  icon,
  init,
  comingSoon = false,
}: {
  main: boolean;
  title: string;
  description: string;
  icon: React.ReactNode;
  init: boolean;
  comingSoon?: boolean;
}) {
  return (
    <div
      className={cn(
        "group relative w-full h-[400px] flex flex-col p-5 gap-1 justify-between focus:outline-none focus:border-none focus:ring-brand-600 focus:ring-2 focus:rounded-xl bg-sm bg-mauve-200 border border-mauve-400 rounded-xl",
        main ? "col-span-6" : "col-span-6 md:col-span-3"
      )}
    >
      {title == "Q&A Mode" && <QaContent />}
      {title == "MCQ mode" && <QcmContent />}
      {title == "History" && <HistoryContent items={CARDS} />}
      {title == "Suggestions" && <SuggestionContent />}
      {title == "Writing Mode" && <WritingContent />}
      {title == "Problem Solving Mode" && (
        <ProblemSolvingContent text="No correction? " revealText="Alexis is here !" />
      )}

      {comingSoon && (
        <span className="absolute top-4 right-4 ml-auto text-xs font-semibold px-2 py-1 rounded-full bg-purple-400 text-purple-1000">
          Coming soon
        </span>
      )}
      <div className="h-14 w-14 mx-auto mt-auto mb-4 rounded-lg border border-purple-600 bg-gradient-to-b from-purple-800 to-purple-900 flex justify-center items-center shadow-[0px_2px_8px_0px_#8E4EC625] absolute inset-0 bottom-20">
        <SparklesCore
          id={`tsparticlesfullpage-${title}`}
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={300}
          className="w-full h-full absolute"
          particleColor="#FFFFFF"
          init={init}
        />
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-semibold text-mauve-1200">{title}</h3>
        <p className="text-mauve-1100 text-sm max-w-sm">{description}</p>
      </div>
    </div>
  );
}

export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-700/[0.2] dark:text-emerald-500 px-1 py-0.5",
        className
      )}
    >
      {children}
    </span>
  );
};

const CARDS = [
  {
    id: 0,
    name: "May 8th, 2024",
    designation: "Senior Software Engineer",
    content: (
      <p>
        <Highlight>
        Essential diagnoses to evaluate in patients with  cephalalgia
        </Highlight>
      </p>
    ),
  },
  {
    id: 1,
    name: "Yesterday at 19h15",
    designation: "Senior Shitposter",
    content: <p>The study of the convergence and divergence of alternating series</p>,
  },
  {
    id: 2,
    name: "Today at 12h40",
    designation: "Manager Project Mayhem",
    content: (
      <p>
        <Highlight>
        The prescribed timeframes for filing an appeal.
        </Highlight>
      </p>
    ),
  },
];
