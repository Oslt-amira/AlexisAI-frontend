"use client";

import { cn } from "@/lib/utils";
import { AnimatedBeam } from "./animatedBeam";
import { IconProps } from "@radix-ui/react-icons/dist/types";
import React, { forwardRef, useRef } from "react";
import { useHover } from "@/lib/hooks/useHover";

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex w-fit items-center justify-center rounded-lg border border-purple-500 bg-white px-3 py-2 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        className
      )}
    >
      {children}
    </div>
  );
});

Circle.displayName = 'Circle';

export function QaContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);

  const isHover = useHover(containerRef);

  return (
    <div
      className="relative flex w-full max-w-[450px] items-center justify-center overflow-hidden mx-auto"
      ref={containerRef}
    >
      <div className="flex h-full w-full flex-col items-stretch justify-between gap-10">
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div1Ref}>
            {/* <Icons.googleDrive className="h-6 w-6" /> */}
            <span className="text-xs font-semibold text-purple-1000">
            Residency Courses
            </span>
          </Circle>
          <Circle ref={div5Ref}>
            <span className="text-xs font-semibold text-purple-1000 ">
           MP Preparatory Courses
            </span>
          </Circle>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div2Ref}>
            <span className="text-xs font-semibold text-purple-1000 ">
            Law Courses
            </span>
          </Circle>
          <Circle
            ref={div4Ref}
            className="h-16 w-16 bg-white border-2 border-mauve-500 rounded-full"
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 85 85"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="pl-1"
            >
              <path
                d="M63.3858 11.6523C57.2628 4.03079 47.436 0.169556 34.1842 0.169556C24.1313 0.169556 16.0897 2.7464 10.2817 7.82336C5.28554 12.1895 3.01161 17.4603 1.7353 21.0469C0.135877 25.5463 -0.247823 30.3041 0.628629 34.8076C1.54951 39.5331 3.8194 43.7619 7.2 47.0415C10.1242 49.8809 13.1615 51.3188 16.2311 51.3188H23.1054C25.2016 51.3188 26.8979 53.0151 26.8979 55.1114V72.9433C26.8979 75.6413 29.083 77.8264 31.781 77.8304H34.1882C54.4759 77.8304 70.979 60.1075 70.979 38.3215C70.979 26.7337 68.4951 18.0096 63.3858 11.6563V11.6523ZM33.7884 69.3002V55.1114C33.7884 49.2105 29.0063 44.4283 23.1054 44.4283H16.2311C14.7205 44.4283 13.0969 43.1601 11.9983 42.0979C9.5022 39.6745 7.91489 36.5645 7.31713 33.1597C7.14345 32.1661 7.91893 31.2573 8.92463 31.2573H34.6406C42.9487 31.2573 49.6817 37.9903 49.6817 46.2984V61.8645C49.6817 64.8372 47.9086 67.523 45.1742 68.6984C41.212 70.3988 37.5487 70.8309 35.4969 70.9319C34.5639 70.9763 33.7884 70.2372 33.7884 69.3042V69.3002ZM55.425 56.5169V46.2984C55.425 34.8197 46.1193 25.514 34.6406 25.514H9.74857C8.63382 25.514 7.85431 24.4113 8.22589 23.3572C10.7179 16.3617 16.118 7.06 34.1842 7.06C45.4004 7.06 53.1955 9.97208 58.014 15.9699C62.1014 21.0509 64.0845 28.3614 64.0845 38.3215C64.0845 45.4462 61.9803 52.0418 58.4139 57.4136C57.5172 58.7626 55.421 58.1325 55.421 56.5169H55.425Z"
                fill="url(#paint0_linear_1815_2)"
              />

              <defs>
                <linearGradient
                  id="paint0_linear_1815_2"
                  x1="35.5743"
                  y1="0.169556"
                  x2="35.5743"
                  y2="77.8304"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0.22" stopColor="#8E4EC6" stopOpacity="0.8" />
                  <stop offset="1" stopColor="#B08AD1" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_1815_2"
                  x1="61.4348"
                  y1="50.1304"
                  x2="61.4348"
                  y2="83"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#BD99DC" />
                  <stop offset="1" stopColor="#B08AD1" />
                </linearGradient>
                <linearGradient
                  id="paint2_linear_1815_2"
                  x1="76.2554"
                  y1="47"
                  x2="76.2554"
                  y2="57.9565"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#BD99DC" />
                  <stop offset="1" stopColor="#B08AD1" />
                </linearGradient>
              </defs>
            </svg>
          </Circle>
          <Circle ref={div6Ref}>
            <span className="text-xs font-semibold text-purple-900 ">
            Mock Exams
            </span>
          </Circle>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div3Ref}>
            <span className="text-xs font-semibold text-purple-900 ">
            PC Preparatory Courses 
            </span>
          </Circle>
          <Circle ref={div7Ref}>
            <span className="text-xs font-semibold text-purple-900 ">
           Practice MCQs
            </span>
          </Circle>
        </div>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div4Ref}
        curvature={-75}
        endYOffset={-10}
        duration={isHover ? 2 : undefined}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div4Ref}
        duration={isHover ? 2 : undefined}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div4Ref}
        curvature={75}
        endYOffset={10}
        duration={isHover ? 2 : undefined}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div4Ref}
        curvature={-75}
        reverse
        endYOffset={-10}
        duration={isHover ? 2 : undefined}
        
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div6Ref}
        toRef={div4Ref}
        reverse
        duration={isHover ? 2 : undefined}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div7Ref}
        toRef={div4Ref}
        curvature={75}
        reverse
        endYOffset={10}
        duration={isHover ? 2 : undefined}
      />
    </div>
  );
}
