import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function LandingActions() {
  return (
    <div className="lp-hero-actions lp-learning-actions">
      <Link href="/signIn" className="lp-learning-login">Log in</Link>
      <Link href="/demo" className="primary-button lp-button lp-learning-start">
        <span>Start learning</span>
        <span className="lp-learning-arrow" aria-hidden="true"><ArrowUpRight size={16} /></span>
      </Link>
    </div>
  );
}
