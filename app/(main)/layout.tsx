import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { Poppins } from "next/font/google";
import { Roboto } from "next/font/google";
import { Montserrat } from "next/font/google";
import "../globals.css";
import screenShort from "@/public/metadataImage.png";

import { ToastContainer } from "react-toastify";
import Navbar from "@/components/navbar";
import MobileNavBar from "@/components/mobile";
import Search from "../../components/search";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PROMPT VALUT",
  description:
    "A community-driven platform where AI image enthusiasts can share, explore, and save high-quality prompts along with their generated images.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "PROMPT VALUT",
    description:
      "A community-driven platform where AI image enthusiasts can share, explore, and save high-quality prompts along with their generated images.",
    images: [
      {
        url: screenShort.src,
        width: 1200,
        height: 630,
        alt: "Prompt Vault",
      },
    ],
    siteName: "Prompt Vault",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className}   antialiased bg-white`}
      >
        <div className="flex min-h-screen">
          {/* Fixed sidebar for desktop */}
          <aside className="hidden md:flex md:flex-col md:w-[80px] bg-white border-r border-gray-300 z-30 fixed top-0 left-0 h-screen sh">
            <Navbar />
          </aside>
          <div className="relative  w-full md:ml-[80px]">
            {/* Fixed search bar for desktop */}

            {/* Add padding top for main content to avoid overlap with fixed search bar */}
            <main className="">{children}</main>
          </div>
          <ToastContainer />
        </div>
        {/* Mobile search bar above mobile nav, fixed at top */}
        <div className="hidden fixed top-0 left-0 right-0 z-20 bg-white border-b border-gray-200 px-4 pt-4 pb-2">
          <Search />
        </div>
        {/* Add padding bottom for mobile content to avoid overlap with nav bar */}
        <div
          className="block md:hidden"
          style={{ paddingBottom: "70px" }}
        ></div>
        {/* Mobile bottom nav bar */}
        <MobileNavBar />
      </body>
    </html>
  );
}
