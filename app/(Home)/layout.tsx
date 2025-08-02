import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { Poppins } from "next/font/google";
import { Roboto } from "next/font/google";
import { Montserrat } from "next/font/google";
import screenShort from "@/public/metadataImage.png";
import "../globals.css";

import { ToastContainer } from "react-toastify";

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
    url: "https://promptvault14.vercel.app/",
    images: [
      {
        url: screenShort.src,
        width: 1200,
        height: 630,
        alt: "Henry Gozy - Portfolio",
      },
    ],
    siteName: "Prompt Vault",
    type: "website",
  },
};

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${roboto.variable} ${montserrat.variable}  antialiased bg-white`}
      >
        <div className="min-h-screen w-full">
          <div>{children}</div>
          <ToastContainer />
        </div>
      </body>
    </html>
  );
}
