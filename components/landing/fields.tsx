import Link from "next/link";
import { ArrowUpRight, Scale, Sigma, Stethoscope } from "lucide-react";
import { disciplines } from "./landing-shared";

const courses = [
  { key: "Medicine", icon: Stethoscope, description: "From the foundations to residency revision." },
  { key: "STEM", icon: Sigma, description: "Connect the concepts. Understand the method." },
  { key: "Law", icon: Scale, description: "Read closely. Build a clearer argument." },
] as const;

export default function Fields() {
  return (
    <section id="Examples" className="lp-container lp-section lp-curriculum">
      <div className="lp-section-heading">
        <div><span className="eyebrow lp-eyebrow">TAILORED COURSES</span><h2>A familiar place<br /><span>to start.</span></h2></div>
      </div>
      <div className="lp-course-grid">
        {courses.map(course => (
          <Link key={course.key} href="/signIn" className="lp-course-card" aria-label={`Explore ${course.key} courses`}>
            <span className="lp-course-icon"><course.icon size={20} /></span>
            <h3>{course.key === "Medicine" ? "Medicine & residency" : course.key}</h3>
            <p>{course.description}</p>
            <ul>{disciplines[course.key].topics.map(topic => <li key={topic}>{topic}</li>)}</ul>
            <span className="lp-course-link">Explore courses <ArrowUpRight size={15} /></span>
          </Link>
        ))}
      </div>
    </section>
  );
}
