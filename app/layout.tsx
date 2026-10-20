import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Alexis — Your study companion",
  description:
    "A calmer space to learn deeper. Turn your notes, documents, and questions into clear understanding with Alexis.",
  icons: {
    icon: "/brand/favicon.svg",
    shortcut: "/brand/favicon.svg",
    apple: "/brand/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`} suppressHydrationWarning>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("alexis-theme");document.documentElement.dataset.theme=t==="dark"||t==="light"?t:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");var a=localStorage.getItem("alexis-accent");document.documentElement.dataset.accent=["green","purple","chrome","amber"].indexOf(a)>-1?a:"green"}catch(e){}})()`,
          }}
        />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
