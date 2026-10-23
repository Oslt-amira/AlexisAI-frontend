import Image from "next/image";

interface LogoProps {
  /** Retained for callers; contrast follows the active appearance. */
  color?: string;
  width: number | string;
  height: number | string;
  className?: string;
}
export const AlexisLogo = ({ width, height, className }: LogoProps) => (
  <Image
    src="/brand/logo.svg"
    alt="Alexis"
    width={Number(width) || 32}
    height={Number(height) || 32}
    className={`alexis-logo ${className ?? ""}`}
    style={{ objectFit: "contain" }}
  />
);
