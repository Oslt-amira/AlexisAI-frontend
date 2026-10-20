interface LogoProps {
  color?: string;
  width: number | string;
  height: number | string;
  className?: string;
}
export const AlexisLogo = ({
  color = "#0F2F24",
  width,
  height,
  className,
}: LogoProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Alexis"
  >
    <path
      fill={color}
      fillRule="evenodd"
      d="M26 4H54C66.15 4 76 13.85 76 26V29.05A11 11 0 0 0 76 50.95V54C76 66.15 66.15 76 54 76H26C13.85 76 4 66.15 4 54V50.95A11 11 0 0 0 4 29.05V26C4 13.85 13.85 4 26 4ZM32.97 23.74C29.27 22.61 24.04 28.97 21.29 37.95C18.54 46.93 19.31 55.13 23.01 56.26C26.71 57.39 31.94 51.03 34.69 42.05C37.44 33.07 36.67 24.87 32.97 23.74ZM66.94 29.65C65.44 27.33 57.08 30.04 48.26 35.77C39.44 41.5 33.51 48.03 35.01 50.35C36.51 52.67 44.87 49.96 53.69 44.23C62.51 38.5 68.44 31.97 66.94 29.65Z"
    />
  </svg>
);
