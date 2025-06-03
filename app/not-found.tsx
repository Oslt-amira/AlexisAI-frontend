import ChatLogo from "@/components/chatUI/chatLogo";

export default function NotFound() {
  return (
    <>
      <div className="h-screen w-screen place-content-center  bg-mauve-100 ">
        <div className="flex flex-col items-center content-center -mt-20 ">
          <div className=" content-center  -mb-4">
            <ChatLogo />
          </div>

          <h1 className="text-3xl text-mauve-1100 text-center mx-2 text-balance ">
            Page not found .
          </h1>
          <h2 className="text-xl text-mauve-1000 text-center mx-2 text-balance">
            Sorry , we cannot find the page you are looking for .
          </h2>
        </div>
      </div>
    </>
  );
}
