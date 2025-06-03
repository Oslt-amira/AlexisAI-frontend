import ChatLogo from "@/components/chatUI/chatLogo";

export default function Loading() {
  return (
    <>
      <div className="h-screen w-screen place-content-center  bg-mauve-100 ">
        <div className="flex flex-col items-center content-center -mt-20 ">
          <div className=" content-center  -mb-4 transition-all animate-bounce-load ">

            <ChatLogo />
          </div>
        </div>
      </div>

    </>
  );
}
