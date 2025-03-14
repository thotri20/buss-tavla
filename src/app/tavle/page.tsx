"use client";
import { useState, useEffect } from "react";
import Tavle from "../components/Tavle";
import Tavle2 from "../components/Tavle2";
import Footer from "../components/footer";
import Image from "next/image";
import Navbar from "../components/Navbar";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTable, setActiveTable] = useState("Tavle");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 650);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="bg-black">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 mt-[4rem] text-[#ffffff]">
          Rømningsveier
        </h1>

        <div className="w-full sm:max-w-5xl rounded-2xl bg-[#807b7b] text-black p-2">
          {isMobile ? (
            <div className="flex flex-col items-center">
              <div className="mb-4 flex gap-4">
                <button
                  className={`px-4 py-2 rounded-lg font-bold ${
                    activeTable === "Tavle"
                      ? "bg-[#000080] text-white"
                      : "bg-gray-300"
                  }`}
                  onClick={() => setActiveTable("Tavle")}
                >
                  Andre holdeplasser
                </button>
                <button
                  className={`px-4 py-2 rounded-lg font-bold ${
                    activeTable === "Tavle2"
                      ? "bg-[#000080] text-white"
                      : "bg-gray-300"
                  }`}
                  onClick={() => setActiveTable("Tavle2")}
                >
                  Hamar katedralskole
                </button>
              </div>
              {activeTable === "Tavle" ? <Tavle /> : <Tavle2 />}
            </div>
          ) : (
            <div className="flex justify-center gap-4">
              
              <Tavle /><Tavle2 />
            </div>
          )}
        </div>
      </div>

      <div className="relative w-full h-[150px]">
        <Image
          src="/images/pil.png"
          alt="pil"
          width={400}
          height={550}
          className="absolute left-[-7rem] bottom-[-50px] rotate-180 
                     w-[22rem] sm:w-[30rem] h-auto"
        />
      </div>
      <Footer />
    </div>
  );
}
