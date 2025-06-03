"use client";
import { DailySchedule, StudyPlanOutput, StudySession } from "@/lib/planner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useRouter } from "next/navigation";

interface PlannerTimelineProps {
  planObject: StudyPlanOutput | null;
  error: boolean;
}

export default function PlannerTimeline({
  planObject,
  error,
}: PlannerTimelineProps) {
  const router = useRouter();

  return (
    <div className="w-full h-1/2 p-4 flex gap-12 flex-wrap px-16 overflow-y-auto">
      {error && <p>There was an error generating the study plan</p>}
      {planObject && (
        <Table>
          <TableCaption>A study plan prepared just for you ! </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Day</TableHead>
              <TableHead>Focus topic</TableHead>
              <TableHead className="text-right">Time slot</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {planObject &&
              planObject.study_plan.daily_schedule.map(
                (day: DailySchedule, _) => {
                  return day.study_sessions.map(
                    (session: StudySession, index) => {
                      return (
                        <TableRow
                          key={index + _}
                          className="cursor-pointer"
                          onClick={() => {
                            router.push(
                              `/discussion?topic=${session.focus_topic.replace(/\s+/g, "-")}`,
                            );
                          }}
                        >
                          <TableCell className="font-medium">
                            {index == 0 ? day.day : ""}
                          </TableCell>
                          <TableCell>{session.focus_topic}</TableCell>
                          <TableCell className="text-right">
                            {session.time_slot}
                          </TableCell>
                        </TableRow>
                      );
                    },
                  );
                },
              )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
