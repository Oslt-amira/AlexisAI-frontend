"use client";
import { useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MoreHorizontal,
  MoreVertical,
  Pencil,
  Play,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import type { StudyTask } from "./demo-data";
import PlatformSelect from "./platform-select";

import { DEMO_TODAY, addDays, taskDate, weekDay } from "./planner-dates";
function format(iso: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-GB", {
    ...options,
    timeZone: "UTC",
  }).format(new Date(iso + "T12:00:00Z"));
}

export default function StudyPlanner({
  tasks,
  selectedDate,
  onDateChange,
  onAdd,
  onEdit,
  onToggle,
  onRemove,
  onSync,
  onStudy,
}: {
  tasks: StudyTask[];
  selectedDate: string;
  onDateChange: (date: string) => void;
  onAdd: (date: string) => void;
  onEdit: (task: StudyTask) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onSync: () => void;
  onStudy: (task: StudyTask) => void;
}) {
  const [layout, setLayout] = useState("day");
  const [menu, setMenu] = useState<string | null>(null);
  const weekStart = addDays(selectedDate, -weekDay(selectedDate));
  const dates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const weekTasks = tasks.filter((task) => dates.includes(taskDate(task)));
  const completed = weekTasks.filter((task) => task.done).length;
  const minutes = weekTasks.reduce(
    (sum, t) => sum + (parseInt(t.duration) || 0),
    0,
  );
  const days =
    layout === "agenda"
      ? dates.filter((date) =>
          weekTasks.some((task) => taskDate(task) === date),
        )
      : [selectedDate];
  function row(task: StudyTask) {
    return (
      <div
        key={task.id}
        className={`planner-session-row ${task.done ? "completed" : ""}`}
      >
        <span className="planner-session-time">{task.time}</span>
        <button
          className="task-check"
          aria-label={`${task.done ? "Mark incomplete" : "Complete"}: ${task.title}`}
          aria-pressed={task.done}
          onClick={() => onToggle(task.id)}
        >
          {task.done && <Check size={13} />}
        </button>
        <button
          className="planner-session-description"
          onClick={() => onEdit(task)}
        >
          <small>{task.subject}</small>
          <b>{task.title}</b>
          <span>
            <Clock3 size={12} />
            {task.duration}
          </span>
        </button>
        <button
          className="planner-session-start"
          aria-label={`Start study: ${task.title}`}
          onClick={() => onStudy(task)}
        >
          <Play size={14} />
          <span>Study</span>
        </button>
        <div className="planner-session-options">
          <button
            className="icon-button"
            aria-label={`Session options: ${task.title}`}
            aria-expanded={menu === task.id}
            onClick={() => setMenu(menu === task.id ? null : task.id)}
          >
            <MoreVertical size={17} />
          </button>
          {menu === task.id && (
            <div
              className="planner-session-menu"
              role="menu"
              onKeyDown={(e) => {
                if (e.key === "Escape") setMenu(null);
              }}
            >
              <button
                role="menuitem"
                autoFocus
                onClick={() => {
                  onEdit(task);
                  setMenu(null);
                }}
              >
                <Pencil size={14} />
                Edit session
              </button>
              <button
                role="menuitem"
                onClick={() => {
                  onRemove(task.id);
                  setMenu(null);
                }}
              >
                <Trash2 size={14} />
                Remove session
              </button>
              <button role="menuitem" onClick={() => setMenu(null)}>
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="study-planner">
      <header className="screen-heading planner-page-heading">
        <div>
          <h1>Planner</h1>
          <p>Make time for your courses. Keep the next step clear.</p>
        </div>
        <div className="screen-heading-actions">
          <button className="secondary-button" onClick={onSync}>
            <RefreshCw size={15} />
            Sync calendar
          </button>
          <button
            className="primary-button"
            onClick={() => onAdd(selectedDate)}
          >
            <Plus size={16} />
            Plan a session
          </button>
        </div>
      </header>
      <div className="planner-calendar-sticky">
        <div className="planner-calendar-toolbar">
          <div className="planner-week-navigation">
            <button
              className="icon-button"
              aria-label="Previous week"
              onClick={() => onDateChange(addDays(selectedDate, -7))}
            >
              <ChevronLeft size={17} />
            </button>
            <button
              className="icon-button"
              aria-label="Next week"
              onClick={() => onDateChange(addDays(selectedDate, 7))}
            >
              <ChevronRight size={17} />
            </button>
            <h2>
              {format(weekStart, { day: "numeric", month: "short" })} –{" "}
              {format(dates[6], {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </h2>
            <button
              className="planner-today"
              onClick={() => onDateChange(DEMO_TODAY)}
            >
              Today
            </button>
          </div>
          <PlatformSelect
            aria-label="Planner view"
            value={layout}
            onChange={(e) => setLayout(e.target.value)}
          >
            <option value="day">Day view</option>
            <option value="agenda">Week agenda</option>
          </PlatformSelect>
        </div>
        <div className="planner-week-strip">
          {dates.map((date) => {
            const sessions = weekTasks.filter(
              (task) => taskDate(task) === date,
            );
            return (
              <button
                key={date}
                className={`${date === selectedDate ? "selected" : ""} ${date === DEMO_TODAY ? "is-today" : ""}`}
                aria-pressed={date === selectedDate}
                aria-label={`${format(date, { weekday: "long", day: "numeric", month: "long" })}, ${sessions.length} sessions`}
                onClick={() => onDateChange(date)}
              >
                <span>{format(date, { weekday: "short" })}</span>
                <b>{format(date, { day: "numeric" })}</b>
                <small>
                  {sessions.length
                    ? `${sessions.length} ${sessions.length === 1 ? "session" : "sessions"}`
                    : "—"}
                </small>
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-6 w-full">
        <section className="planner-agenda-panel">
          {days.length ? (
            days.map((date) => {
              const sessions = weekTasks
                .filter((task) => taskDate(task) === date)
                .sort((a, b) => a.time.localeCompare(b.time));
              return (
                <section className="planner-day-agenda" key={date}>
                  <header>
                    <div>
                      <h2>
                        {format(date, {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })}
                        {date === DEMO_TODAY && <span>Today</span>}
                      </h2>
                      <p>
                        {sessions.length}{" "}
                        {sessions.length === 1 ? "session" : "sessions"} ·{" "}
                        {sessions.reduce(
                          (sum, t) => sum + (parseInt(t.duration) || 0),
                          0,
                        )}{" "}
                        minutes planned
                      </p>
                    </div>
               
                  </header>
                  {sessions.map(row)}
                  {!sessions.length && (
                    <div className="planner-empty-day">
                      <CalendarDays size={27} />
                      <h3>No sessions planned</h3>
                      <p>Choose a subject and set aside some study time.</p>
                      <button
                        className="secondary-button"
                        onClick={() => onAdd(date)}
                      >
                        <Plus size={15} />
                        Add a session
                      </button>
                    </div>
                  )}
                </section>
              );
            })
          ) : (
            <div className="planner-empty-day">
              <CalendarDays size={27} />
              <h3>A clear week</h3>
              <p>Add your first session for this week.</p>
              <button
                className="secondary-button"
                onClick={() => onAdd(selectedDate)}
              >
                Plan a session
              </button>
            </div>
          )}
        </section>
        {/* <aside className="planner-week-summary">
          <h2>This week</h2>
          <div className="planner-week-stats">
            <div>
              <strong>{weekTasks.length}</strong>
              <span>sessions</span>
            </div>
            <div>
              <strong>
                {minutes < 60 ? minutes : Math.round((minutes / 60) * 10) / 10}
              </strong>
              <span>{minutes < 60 ? "minutes planned" : "hours planned"}</span>
            </div>
          </div>
          <div className="planner-completion-label">
            <span>
              {completed} of {weekTasks.length} complete
            </span>
            <b>
              {weekTasks.length
                ? Math.round((completed / weekTasks.length) * 100)
                : 0}
              %
            </b>
          </div>
          <div className="thin-progress">
            <span
              style={{
                width: `${(completed / Math.max(weekTasks.length, 1)) * 100}%`,
              }}
            />
          </div>
    
        
        </aside> */}
      </div>
    </div>
  );
}
