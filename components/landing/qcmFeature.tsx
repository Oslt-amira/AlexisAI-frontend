import { cn } from "@/lib/utils";
import Marquee from "./marquee";
import { Check, X } from "@phosphor-icons/react";

const reviews = [
  {
    name: "Proposition 1",
    img: (
      <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center">
        <Check size={18} color="#fff" />
      </div>
    ),
  },
  {
    name: "Proposition 2",
    img: (
      <div className="w-8 h-8 rounded-full bg-red-400 flex items-center justify-center">
        <X size={18} color="#fff" />
      </div>
    ),
  },
  {
    name: "Proposition 3",
    img: (
      <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center">
        <Check size={18} color="#fff" />
      </div>
    ),
  },
  {
    name: "Proposition 4",
    img: (
      <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center">
        <Check size={18} color="#fff" />
      </div>
    ),
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({ img, name }: { img: any; name: string }) => {
  return (
    <figure
      className={cn(
        "relative w-52 cursor-pointer overflow-hidden rounded-xl border p-4 border-mauve-500",
        "bg-white  hover:bg-white/90"
      )}
    >
      <div className="flex flex-row items-center gap-2 ">
        {img}
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
        </div>
      </div>
    </figure>
  );
};

const QcmContent = () => {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden py-10 pt-2">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.name} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.name} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-mauve-200"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-mauve-200 dark:from-background"></div>
    </div>
  );
};

export default QcmContent;
