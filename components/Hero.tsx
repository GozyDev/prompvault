"use client";

import { Rocket } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

import MobileVideo from "./MobileVideo";
import { PayLoad } from "@/lib/type";

export default function Hero({ user }:{user:PayLoad}) {
  const router = useRouter();
  return (
    <section className="relative max-w-6xl mx-auto  flex flex-col gap-5">
      {/* Gradient background decoration */}
      <div className="absolute inset-x-0 top-0 opacity-20 h-[50rem] pointer-events-none">
        <div className="fixed inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"></div>
        </div>
      </div>

      {/* Content Section */}
      <div className="">
        <div className="flex flex-col mx-auto  md:items-center w-full gap-2 ">
          <h1 className=" text-3xl text-center md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-800 ">
            All your favorite ai prompts, in one clean vault
          </h1>

          <p className="text-sm sm:text-lg text-gray-600  leading-relaxed text-center">
            Craft, remix, and save the prompts that matter.
            <span className="block mt text-indigo-600 font-medium md:text-center">
              <span className="inline-flex items-center ">
                <span className="h-1 w-1 border rounded-full bg-indigo-600 mr-2"></span>
                Zero clutter, zero noise
              </span>
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => router.push(`${user ? "/explore" : "/signIn"}`)}
              className="relative w-max mx-auto px-8 py-4  bg-gradient-to-r from-indigo-700 to-purple-700  text-white rounded-2xl cursor-pointer hover:scale-[1.02] group flex items-center"
            >
              Try Prompt Vault Now
              <span className="ml-2 group-hover:translate-x-1 transition-transform ">
                <Rocket />
              </span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Video Section */}
      <div className="hidden md:block">
        <div className="relative">
          <div className="absolute -inset-4 rounded-2xl bg-gradient-to-tr from-blue-400/20 to-purple-400/20 blur-lg"></div>
          <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl transform transition-transform hover:-translate-y-1 hiiden">
          <img src='/Macbook-Air-localhost.png' alt="" width={30} height={30} className="w-full h-full"/>
          </div>
        </div>
      </div>

      <MobileVideo></MobileVideo>
    </section>
  );
}
