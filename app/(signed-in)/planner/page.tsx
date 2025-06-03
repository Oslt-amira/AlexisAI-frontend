"use client";

import { useState } from "react";
import { StudyPlanOutput } from "@/lib/planner";
import { PlannerForm } from "@/components/plannerForm";
import PlannerTimeline from "@/components/plannerTimeline";

export default function Planner() {
  const [planObject, setPlanObject] = useState<StudyPlanOutput | null>(null);
  const [error, setError] = useState<boolean>(false);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full h-1/2 flex p-12 flex-col gap-6 py-8">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-mauve-1200">Planner</h2>
          <p className="text-sm w-1/2 text-mauve-1000">
            This is a study planner that generates a study plan for you based on
            your study goals and the time you have available to study. Click the
            button below to get started.
          </p>
        </div>
        <PlannerForm
          setError={setError}
          planObject={planObject}
          setPlanObject={setPlanObject}
        />
      </div>
      <PlannerTimeline planObject={planObject} error={error} />
    </div>
  );
}
