"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div>
      <div
        className="w-full h-20 flex items-center px-6 md:px-8 shadow-lg"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Lett svart farge for å mørkne navbaren
        }}
      >
        <div className="text-white text-4xl font-bold mr-12 font-roboto">
          <Link href="/">Logo</Link>
        </div>

        <div className="flex flex-grow justify-center space-x-12 hidden md:flex">
          <Link
            href="/"
            className="text-white hover:text-gray-300 transition duration-300 font-roboto text-xl font-semibold"
          >
            Hjem
          </Link>
          <Link
            href="/busstavle"
            className="text-white hover:text-gray-300 transition duration-300 font-roboto text-xl font-semibold"
          >
            Busstavle
          </Link>
          <Link
            href="/about"
            className="text-white hover:text-gray-300 transition duration-300 font-roboto text-xl font-semibold"
          >
            Om oss
          </Link>
        </div>

        {/* Mobilmeny */}
        <div className="md:hidden flex items-center ml-auto">
          <button
            className="text-white hover:text-gray-400"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobilmeny dropdown */}
      {isMenuOpen && (
        <div className="md:hidden flex flex-col items-center bg-black bg-opacity-70 py-4">
          <Link
            href="/"
            className="text-white py-3 text-xl hover:text-gray-300 transition duration-300 font-roboto font-semibold"
            onClick={() => setIsMenuOpen(false)}
          >
            Hjem
          </Link>
          <Link
            href="/busstavle"
            className="text-white py-3 text-xl hover:text-gray-300 transition duration-300 font-roboto font-semibold"
            onClick={() => setIsMenuOpen(false)}
          >
            Busstavle
          </Link>
          <Link
            href="/about"
            className="text-white py-3 text-xl hover:text-gray-300 transition duration-300 font-roboto font-semibold"
            onClick={() => setIsMenuOpen(false)}
          >
            Om oss
          </Link>
        </div>
      )}
    </div>
  );
}
