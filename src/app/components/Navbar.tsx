"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToOmOss = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById("omoss");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="fixed w-full backdrop-blur-md bg-black/30 border-b border-white/10 shadow-lg z-50">
      <div className="w-full pl-0 pr-1 sm:pr-2 lg:pr-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 ml-4">
            <Link
              href="/"
              className="text-white text-2xl font-bold tracking-wider pl-1 hover:text-gray-300 transition-colors duration-200"
            >
              FluktRuter
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-8 mr-8">
            <Link
              href="/"
              className="relative text-gray-300 hover:text-white px-4 py-2 text-lg font-medium transition-colors duration-200 
              before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-full before:h-0.5 
              before:bg-white before:scale-x-0 before:transition-transform before:duration-200 
              hover:before:scale-x-100 rounded-lg"
            >
              Hjem
            </Link>
            <Link
              href="/busstavle"
              className="relative text-gray-300 hover:text-white px-2 py-2 text-lg font-medium transition-colors duration-200 
              before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-full before:h-0.5 
              before:bg-white before:scale-x-0 before:transition-transform before:duration-200 hover:before:scale-x-100"
            >
              Busstavle
            </Link>
            <button
              onClick={scrollToOmOss}
              className="relative text-gray-300 hover:text-white px-2 py-2 text-lg font-medium transition-colors duration-200 
              before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-full before:h-0.5 
              before:bg-white before:scale-x-0 before:transition-transform before:duration-200 hover:before:scale-x-100"
            >
              Om Oss
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-10 h-10 text-gray-300 hover:text-white focus:outline-none mr-4"
          >
            <div className="flex flex-col justify-center items-center gap-1.5">
              <span
                className={`block h-0.5 w-6 bg-current transition-all duration-300 ease-out ${
                  isMenuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-current transition-all duration-300 ease-out ${
                  isMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-current transition-all duration-300 ease-out ${
                  isMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? "max-h-56 opacity-100"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 backdrop-blur-md bg-black/30">
          <Link
            href="/"
            className="block px-3 py-2 text-lg font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-md transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Hjem
          </Link>
          <Link
            href="/busstavle"
            className="block px-3 py-2 text-lg font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-md transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Busstavle
          </Link>
          <button
            onClick={scrollToOmOss}
            className="w-full text-left px-3 py-2 text-lg font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-md transition-colors duration-200"
          >
            Om Oss
          </button>
        </div>
      </div>
    </nav>
  );
}
