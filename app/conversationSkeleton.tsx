import { ChatCircleText, DotsThree } from "@phosphor-icons/react";

export default function ConversationSkeleton() {
  const repetitions = 6;

  return (
    <>
      {Array(repetitions)
        .fill(null)
        .map((_, index) => (
          <div key={index} className="  flex flex-col gap-1 max-h-[60vh]">
            {(index === 0 || index === 2) && (
              <div className="h-2 rounded-xl mt-6 mb-2 animate-pulse w-20 justify-start bg-mauve-400"></div>
            )}

            <div className="flex flex-row group justify-between ">
              <div className="relative p-0 gap-1 h-fit max-w-[180px] bg-transparent content-center flex my-1 ">
                <ChatCircleText
                  size={26}
                  color="#cca7e8"
                  weight="fill"
                  className={`animate-pulse fill-mauve-400 w-6 h-6 `}
                />
                <div className="flex flex-col place-self-center gap-1">
                  <div
                    className={` h-[4px] rounded-xl animate-pulse bg-mauve-400 w-36 `}
                  />
                  <div
                    className={` h-[4px] rounded-xl animate-pulse bg-mauve-400 w-20 `}
                  />
                </div>
              </div>
              <div className=" bg-transparent group-hover:bg-transparent place-self-center">
                <DotsThree
                  size={20}
                  color="#cca7e8"
                  weight="bold"
                  className={` animate-pulse fill-mauve-400 `}
                />
              </div>
            </div>
          </div>
        ))}
    </>
  );
}
