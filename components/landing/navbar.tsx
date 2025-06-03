"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  useMotionValueEvent,
  useScroll,
  motion,
  AnimatePresence,
} from "framer-motion";

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      let direction = current! - scrollYProgress.getPrevious()!;

      if (direction < 0) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    }
  });
  const sections = ["Features", "Examples", "Pricing", "FAQ"]; 

  const handleSectionClick = (sectionId: string) => {
    const element = document.getElementById(sectionId); 
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" }); 
    }
  };


  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.5,
          type: "spring",
          bounce: 0,
        }}
        className="fixed z-[5000] top-6 inset-x-0 mx-auto w-fit h-fit bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] rounded-full flex md:gap-14 items-center px-4 sm:px-6 py-[10px] pr-4"
      >
        <svg
          width="36"
          height="38"
          viewBox="0 0 83 85"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 sm:h-fit sm:w-fit"
        >
          <path
            d="M63.3858 11.6523C57.2628 4.03079 47.436 0.169556 34.1842 0.169556C24.1313 0.169556 16.0897 2.7464 10.2817 7.82336C5.28554 12.1895 3.01161 17.4603 1.7353 21.0469C0.135877 25.5463 -0.247823 30.3041 0.628629 34.8076C1.54951 39.5331 3.8194 43.7619 7.2 47.0415C10.1242 49.8809 13.1615 51.3188 16.2311 51.3188H23.1054C25.2016 51.3188 26.8979 53.0151 26.8979 55.1114V72.9433C26.8979 75.6413 29.083 77.8264 31.781 77.8304H34.1882C54.4759 77.8304 70.979 60.1075 70.979 38.3215C70.979 26.7337 68.4951 18.0096 63.3858 11.6563V11.6523ZM33.7884 69.3002V55.1114C33.7884 49.2105 29.0063 44.4283 23.1054 44.4283H16.2311C14.7205 44.4283 13.0969 43.1601 11.9983 42.0979C9.5022 39.6745 7.91489 36.5645 7.31713 33.1597C7.14345 32.1661 7.91893 31.2573 8.92463 31.2573H34.6406C42.9487 31.2573 49.6817 37.9903 49.6817 46.2984V61.8645C49.6817 64.8372 47.9086 67.523 45.1742 68.6984C41.212 70.3988 37.5487 70.8309 35.4969 70.9319C34.5639 70.9763 33.7884 70.2372 33.7884 69.3042V69.3002ZM55.425 56.5169V46.2984C55.425 34.8197 46.1193 25.514 34.6406 25.514H9.74857C8.63382 25.514 7.85431 24.4113 8.22589 23.3572C10.7179 16.3617 16.118 7.06 34.1842 7.06C45.4004 7.06 53.1955 9.97208 58.014 15.9699C62.1014 21.0509 64.0845 28.3614 64.0845 38.3215C64.0845 45.4462 61.9803 52.0418 58.4139 57.4136C57.5172 58.7626 55.421 58.1325 55.421 56.5169H55.425Z"
            fill="url(#paint0_linear_1815_2)"
          />
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
        <div className="flex">
        {sections.map((sectionId) => (
            <span
              key={sectionId}
              className=" text-xs sm:text-sm text-mauve-1200 font-medium select-none cursor-pointer py-2 px-2 sm:px-3 hover:bg-mauve-300 rounded-xl transition-all"
              onClick={() => handleSectionClick(sectionId)}
            >
              {sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}
            </span>
          ))}
          
        </div>
        <Button className="rounded-full  bg-purple-900 hover:bg-purple-900/90 text-xs sm:text-sm">
          <Link href="/signIn">Login</Link>
        </Button>
      </motion.div>
    </AnimatePresence>
  );
}
