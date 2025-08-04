"use client";
import CallToAction from "@/components/Calltoaction";
import Feature from "@/components/Feature";
import Hero from "@/components/Hero";
import HomeNavbar from "@/components/HomeNavbar";
import MobileHomeNavBar from "@/components/MobileHomeNavBar";
import { PayLoad } from "@/lib/type";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function HomePage() {
  const [user, setUser] = useState<PayLoad>();
  useEffect(() => {
    async function getToken() {
      try {
        const response = await fetch("/api/auth/status", {
          credentials: "include",
        });

        const dataBody = await response.json();

        if (!response.ok) {
          return;
        }

        setUser(dataBody.user);
      } catch (err) {
        toast.error("Something went wrong.");
      }
    }

    getToken();
  }, []);

  return (
    <>
      <header>
        <HomeNavbar user={user}></HomeNavbar>
        <MobileHomeNavBar user={user} />
      </header>
      <main
        id="home"
        className="pt-[100px] md:pt-[150px] px-4 max-w-7xl  mx-auto "
      >
        <Hero user={user}></Hero>

        <section id="about" className="pb-0 pt-[70px] sm:pb-[100px] py-[100px]   ">
          <div>
            <h2 className="text-3xl sm:text-5xl text-center uppercase font-bold bg-gradient-to-r from-purple-700 to-blue-800 bg-clip-text text-transparent">
              What Is prompt vault?{" "}
            </h2>
            <p className="text-lg text-left sm:text-center w-full max-w-[900px] mx-auto mt-10 leading-9 text-gray-700">
              Handy is your go-to space for saving, remixing, and sharing AI
              prompts. Whether you're a creator, developer, or prompt junkie
              Handy keeps your ideas flowing, organized, and accessible
            </p>
          </div>
        </section>

        <Feature></Feature>

        <CallToAction user={user}></CallToAction>
      </main>
    </>
  );
}
