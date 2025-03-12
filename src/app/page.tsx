import Navbar from "./components/Navbar";
import Image from "next/image";
import Footer from "./components/footer";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative">
      <Navbar />
      <div
        className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center bg-fixed relative overflow-hidden"
        style={{
          backgroundImage: "url('/images/buss3.jpg')",
          backgroundPosition: "75% center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/70 z-0 animate-gradient"></div>

        <div className="absolute inset-0 z-0 opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent animate-pulse"></div>

        <div className="relative z-10 flex flex-col items-center gap-4 max-w-4xl mx-auto px-6">
          <div className="animate-float">
            <Image
              src="/images/fluktruter.png"
              alt="FluktRuter Logo"
              width={500}
              height={225}
              className="mx-auto transition-all duration-500 hover:scale-105 filter drop-shadow-lg"
              priority
            />
          </div>

          <h2
            className="text-white text-3xl md:text-4xl text-center font-semibold tracking-wider 
            bg-gradient-to-r from-white via-[#B8C6E0] to-white bg-clip-text text-transparent
            drop-shadow-[0_2px_8px_rgba(184,198,224,0.5)] animate-fadeIn
            [text-shadow:_0_1px_20px_rgb(255_255_255_/_20%)] transition-all duration-300
            hover:scale-105"
          >
            Avganger rett foran deg
          </h2>

          <div className="flex flex-col items-center gap-4 mt-8 -mb-2">
            <svg
              className="w-8 h-8 text-[#B8C6E0] animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
            <Link href="/tavle" passHref>
              <button
                className="px-12 py-3 bg-[#B8C6E0] text-gray-800 rounded-full 
                text-xl md:text-2xl font-bold transition-all duration-300 
                hover:bg-[#9DACD1] hover:scale-105 hover:shadow-xl
                active:scale-95 shadow-md animate-slideUp animate-pulse-slow"
              >
                Se Rømningsveier
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div id="omoss" className="min-h-screen bg-gray-900 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-900 z-0"></div>
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-20 relative z-10">
          <h2
            className="text-4xl md:text-5xl font-bold text-center mb-8 md:mb-12 
            bg-gradient-to-r from-white via-[#B8C6E0] to-white bg-clip-text text-transparent"
          >
            Om FluktRuter
          </h2>

          <div className="md:grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-4 md:space-y-6">
              <p className="text-white text-base md:text-lg leading-relaxed">
                Flukt Ruter er en løsning som viser rømningsveier – altså
                bussruter fra Katta og andre stoppesteder i nærheten. Prosjektet
                er laget av 2MED i samarbeid med 2INF for å gjøre det enklere å
                finne busstider og holde oversikt over kollektivtilbudet.
              </p>

              <div className="block md:hidden relative h-[250px] w-full rounded-lg overflow-hidden shadow-2xl my-6">
                <Image
                  src="/images/lilleajervegen.png"
                  alt="Oslo Bus"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <p className="text-white text-base md:text-lg leading-relaxed">
                2INF har stått for det tekniske, mens vi i 2MED har jobbet med
                design og brukervennlighet. Samarbeidet har vært viktig for å få
                en funksjonell og visuelt god løsning. Vi har lært mye, både om
                vårt eget arbeid og om å jobbe i et større prosjekt.
              </p>

              <p className="text-white text-base md:text-lg leading-relaxed italic">
                Håper du får nytte av Flukt Ruter like mye som vi har likt å
                lage det!
              </p>

              <div className="flex justify-between md:gap-4 mt-6 md:mt-8">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-[#B8C6E0]">
                    24/7
                  </div>
                  <div className="text-white text-sm md:text-base">
                    Tilgjengelig
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-[#B8C6E0]">
                    5+
                  </div>
                  <div className="text-white text-sm md:text-base">
                    Bussruter
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-[#B8C6E0]">
                    100+
                  </div>
                  <div className="text-white text-sm md:text-base">
                    Avganger daglig
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden md:block relative h-[400px] w-full rounded-lg overflow-hidden shadow-2xl">
              <Image
                src="/images/lilleajervegen.png"
                alt="Oslo Bus"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
