"use client";

import React, { useRef } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { useInView } from "framer-motion";
import { BorderBeam } from "./borderBeam";

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="section"
      className="relative mx-auto mt-32 max-w-[80rem] px-6 text-center md:px-8 pb-24"
    >
      <div className="flex flex-col items-center relative">
        <div className="absolute top-[-40%] -z-10 hidden lg:block">
          <svg
            width="1007"
            height="975"
            viewBox="0 0 1007 975"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_f_1793_571)">
              <circle
                cx="503.5"
                cy="471.5"
                r="502.5"
                fill="url(#paint0_radial_1793_571)"
                fillOpacity="0.7"
              />
              <circle
                cx="503.5"
                cy="471.5"
                r="502"
                stroke="url(#paint1_linear_1793_571)"
                strokeOpacity="0.7"
              />
              <circle
                cx="503.016"
                cy="421.25"
                r="452.25"
                fill="url(#paint2_radial_1793_571)"
                fillOpacity="0.7"
              />
              <circle
                cx="503.016"
                cy="421.25"
                r="451.75"
                stroke="url(#paint3_linear_1793_571)"
                strokeOpacity="0.6"
              />
              <circle
                cx="504.793"
                cy="376.025"
                r="407.025"
                fill="url(#paint4_radial_1793_571)"
              />
              <circle
                cx="504.793"
                cy="376.025"
                r="406.525"
                stroke="url(#paint5_linear_1793_571)"
                strokeOpacity="0.4"
              />
            </g>
            <defs>
              <filter
                id="filter0_f_1793_571"
                x="0"
                y="-32"
                width="1007"
                height="1007"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feGaussianBlur
                  stdDeviation="0.5"
                  result="effect1_foregroundBlur_1793_571"
                />
              </filter>
              <radialGradient
                id="paint0_radial_1793_571"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(503.5 471.5) rotate(90.0788) scale(502.501)"
              >
                <stop offset="0.87" stopColor="#FCFCFC" stopOpacity="0.3" />
                <stop offset="1" stopColor="#BE93E4" stopOpacity="0.05" />
              </radialGradient>
              <linearGradient
                id="paint1_linear_1793_571"
                x1="503.5"
                y1="-31"
                x2="503.5"
                y2="974"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#BE93E4" />
                <stop offset="1" stopColor="#8445BC" />
              </linearGradient>
              <radialGradient
                id="paint2_radial_1793_571"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(503.016 421.25) rotate(90) scale(452.25)"
              >
                <stop offset="0.895" stopColor="#FCFCFC" stopOpacity="0.2" />
                <stop offset="1" stopColor="#BE93E4" stopOpacity="0.05" />
              </radialGradient>
              <linearGradient
                id="paint3_linear_1793_571"
                x1="503.016"
                y1="-31"
                x2="503.016"
                y2="873.5"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#BE93E4" />
                <stop offset="1" stopColor="#8445BC" />
              </linearGradient>
              <radialGradient
                id="paint4_radial_1793_571"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(504.793 376.025) rotate(90) scale(407.025)"
              >
                <stop offset="0.765" stopColor="white" stopOpacity="0.1" />
                <stop offset="1" stopColor="#BE93E4" stopOpacity="0.02" />
              </radialGradient>
              <linearGradient
                id="paint5_linear_1793_571"
                x1="504.793"
                y1="-31"
                x2="504.793"
                y2="783.05"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#BE93E4" />
                <stop offset="1" stopColor="#8445BC" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <svg
          width="83"
          height="85"
          viewBox="0 0 83 85"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-16 md:w-20 lg:w-24"
        >
          <path
            d="M63.3858 11.6523C57.2628 4.03079 47.436 0.169556 34.1842 0.169556C24.1313 0.169556 16.0897 2.7464 10.2817 7.82336C5.28554 12.1895 3.01161 17.4603 1.7353 21.0469C0.135877 25.5463 -0.247823 30.3041 0.628629 34.8076C1.54951 39.5331 3.8194 43.7619 7.2 47.0415C10.1242 49.8809 13.1615 51.3188 16.2311 51.3188H23.1054C25.2016 51.3188 26.8979 53.0151 26.8979 55.1114V72.9433C26.8979 75.6413 29.083 77.8264 31.781 77.8304H34.1882C54.4759 77.8304 70.979 60.1075 70.979 38.3215C70.979 26.7337 68.4951 18.0096 63.3858 11.6563V11.6523ZM33.7884 69.3002V55.1114C33.7884 49.2105 29.0063 44.4283 23.1054 44.4283H16.2311C14.7205 44.4283 13.0969 43.1601 11.9983 42.0979C9.5022 39.6745 7.91489 36.5645 7.31713 33.1597C7.14345 32.1661 7.91893 31.2573 8.92463 31.2573H34.6406C42.9487 31.2573 49.6817 37.9903 49.6817 46.2984V61.8645C49.6817 64.8372 47.9086 67.523 45.1742 68.6984C41.212 70.3988 37.5487 70.8309 35.4969 70.9319C34.5639 70.9763 33.7884 70.2372 33.7884 69.3042V69.3002ZM55.425 56.5169V46.2984C55.425 34.8197 46.1193 25.514 34.6406 25.514H9.74857C8.63382 25.514 7.85431 24.4113 8.22589 23.3572C10.7179 16.3617 16.118 7.06 34.1842 7.06C45.4004 7.06 53.1955 9.97208 58.014 15.9699C62.1014 21.0509 64.0845 28.3614 64.0845 38.3215C64.0845 45.4462 61.9803 52.0418 58.4139 57.4136C57.5172 58.7626 55.421 58.1325 55.421 56.5169H55.425Z"
            fill="url(#paint0_linear_1815_2)"
          />
          {/* <path
            d="M46.4379 70.068L46.4379 70.0679C45.7226 69.8044 45.1054 69.3277 44.6695 68.7023L45.4899 68.1305L44.6695 68.7023C44.2336 68.0768 44 67.3327 44 66.5704C44 65.808 44.2336 65.0639 44.6695 64.4384C45.1054 63.813 45.7226 63.3363 46.4379 63.0728L46.4381 63.0727L54.8449 59.9776L57.9374 51.5703C58.2006 50.8548 58.6768 50.2372 59.3018 49.8008C59.9269 49.3645 60.6708 49.1304 61.4331 49.1304C62.1954 49.1304 62.9393 49.3645 63.5644 49.8008C64.1894 50.2372 64.6656 50.8548 64.9288 51.5703L64.9288 51.5705L68.0215 59.9846L76.4171 63.078C77.1334 63.3348 77.7531 63.8063 78.1919 64.4282C78.6313 65.0509 78.8679 65.7941 78.8695 66.5562M46.4379 70.068L77.8695 66.5601M46.4379 70.068L54.8405 73.1633L57.9409 81.5601C58.204 82.2756 58.6802 82.8933 59.3053 83.3296C59.9304 83.766 60.6742 84 61.4365 84C62.1988 84 62.9427 83.766 63.5678 83.3296C64.1928 82.8933 64.669 82.2756 64.9322 81.5601C64.9322 81.5601 64.9322 81.5601 64.9322 81.5601M46.4379 70.068L64.9322 81.5601M78.8695 66.5562C78.8695 66.557 78.8695 66.5578 78.8695 66.5586L77.8695 66.5601M78.8695 66.5562C78.8695 66.5554 78.8695 66.5547 78.8695 66.5539L77.8695 66.5601M78.8695 66.5562C78.8738 67.3207 78.6415 68.0678 78.2044 68.695C77.7675 69.3219 77.1474 69.7983 76.4291 70.0587L76.4315 70.0577L76.086 69.1193C76.6111 68.9295 77.0646 68.5815 77.384 68.1232C77.7034 67.6649 77.873 67.1188 77.8695 66.5601M68.0247 73.1529L76.4259 70.0598L68.1842 72.7193L68.0247 73.1529ZM68.0247 73.1529L64.9322 81.5601M68.0247 73.1529L64.9322 81.5601"
            fill="url(#paint1_linear_1815_2)"
            stroke="#FDFCFD"
            strokeWidth="2"
          /> */}
          <path
            d="M82.0837 52.4752C82.0831 52.2177 82.0032 51.9667 81.8548 51.7563C81.7065 51.5463 81.4972 51.387 81.2553 51.3002L78.464 50.2718L77.4358 47.4743L77.4357 47.4742C77.3468 47.2325 77.186 47.0239 76.9748 46.8765C76.7637 46.7291 76.5124 46.65 76.2549 46.65C75.9974 46.65 75.7461 46.7291 75.5349 46.8765C75.3238 47.0239 75.1629 47.2325 75.074 47.4742C75.074 47.4742 75.074 47.4742 75.074 47.4742L74.0458 50.2694L71.2508 51.2984L71.2507 51.2985C71.0091 51.3875 70.8006 51.5485 70.6533 51.7598C70.5061 51.9711 70.4272 52.2224 70.4272 52.48C70.4272 52.7375 70.5061 52.9889 70.6533 53.2001C70.8006 53.4114 71.0091 53.5725 71.2507 53.6615L71.2507 53.6615L74.0444 54.6906L75.0752 57.4823C75.0752 57.4824 75.0752 57.4824 75.0752 57.4825C75.1641 57.7241 75.325 57.9327 75.5361 58.0801C75.7472 58.2275 75.9985 58.3065 76.256 58.3065C76.5135 58.3065 76.7648 58.2275 76.976 58.0801C77.1871 57.9327 77.348 57.724 77.4369 57.4823C77.4369 57.4823 77.4369 57.4823 77.4369 57.4823L78.4651 54.6871L81.2582 53.6588C81.2585 53.6587 81.2589 53.6585 81.2593 53.6584C81.5019 53.5704 81.7114 53.4095 81.859 53.1977C82.0066 52.9858 82.0851 52.7334 82.0837 52.4752ZM82.0837 52.4752C82.0837 52.4755 82.0837 52.4758 82.0837 52.476L81.7337 52.4765L82.0837 52.4744C82.0837 52.4746 82.0837 52.4749 82.0837 52.4752Z"
            fill="url(#paint2_linear_1815_2)"
            stroke="#FDFCFD"
            strokeWidth="0.7"
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
              <stop offset="0.22" stopColor="#8E4EC6" stopOpacity="0.4" />
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

        <h1 className="py-6 text-5xl font-medium text-mauve-1200 leading-none tracking-tighter sm:text-6xl md:text-7xl capitalize translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
        Master Your Studies
        </h1>
        <p className="max-w-xs text-mauve-1100 text-base sm:max-w-lg sm:text-xl md:text-2xl md:max-w-xl lg:text-lg lg:max-w-2xl translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:30ms]">
        Overwhelmed by a sea of coursework? Alexis is your guiding light through the storm of studies, leading aspiring doctors, lawyers, and engineers towards success.
        </p>
        <Link href="/signIn">
          <Button className="animate-fade-in gap-1 rounded-lg mt-10 bg-purple-900 hover:bg-purple-900/90">
            <span>Start for Free </span>

            <ArrowRightIcon className="ml-1 size-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
      <div
        ref={ref}
        className="relative mt-[5rem] animate-fade-up opacity-0 [--animation-delay:400ms] [perspective:2000px] after:absolute after:inset-0 after:z-50 after:[background:linear-gradient(to_top,hsl(var(--background))_-100%,transparent)]  w-11/12 mx-auto "
      >
        <div
          className={`rounded-xl border border-mauve-400 bg-white bg-opacity-[0.01] before:absolute before:bottom-1/2 before:left-0 before:top-0 before:h-full before:w-full before:opacity-0 before:[filter:blur(180px)] before:[background-image:linear-gradient(to_bottom,var(--color-one),var(--color-one),transparent_40%)] shadow-[0px_6px_30px_0px_#3E215807]${
            inView ? "before:animate-image-glow" : ""
          }`}
        >
          <BorderBeam
            size={200}
            duration={12}
            delay={11}
            colorFrom="#8E8C99"
            colorTo="#817F8B"
          />

          <img
            src="/hero.png"
            alt="Hero Image"
            className="relative w-full h-full rounded-[inherit] object-contain"
          />
        </div>
      </div>
    </section>
  );
}
