import type { StudyTask } from "./demo-data";
export const DEMO_TODAY = "2026-10-20";
export function addDays(iso: string, days: number) {
  const date = new Date(iso + "T12:00:00Z");
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
export function taskDate(task: StudyTask) {
  return task.date || addDays("2026-10-19", task.day);
}
export function weekDay(iso: string) {
  return (new Date(iso + "T12:00:00Z").getUTCDay() + 6) % 7;
}
export function sessionConflict(
  tasks: StudyTask[],
  date: string,
  time: string,
  duration: string,
  excludedId: string | null = null,
) {
  const [hours, minutes] = time.split(":").map(Number);
  const start = hours * 60 + minutes;
  const end = start + (parseInt(duration) || 25);
  return tasks.find((task) => {
    if (task.id === excludedId || taskDate(task) !== date) return false;
    const [h, m] = task.time.split(":").map(Number);
    const otherStart = h * 60 + m;
    return (
      start < otherStart + (parseInt(task.duration) || 25) && end > otherStart
    );
  });
}
