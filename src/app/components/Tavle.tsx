"use client";

import { useEffect, useState } from "react";
import { fetchDepartures } from "../utils/fetchDepartures";

// TypeScript-grensesnitt for avgangsdata
interface Departure {
  expectedDepartureTime: string;
  destinationDisplay: { frontText: string };
  serviceJourney?: {
    line?: {
      publicCode?: string;
    };
  };
  stopPlaceName?: string; // Stoppestednavn
}

const getLineColor = (line: string): string => {
  // Funksjon for å tildele kontrasterende farger basert på linjenummer
  const lineNumber = parseInt(line, 10);
  if (lineNumber >= 1 && lineNumber <= 10) {
    return "bg-blue-700 text-white"; // Blå bakgrunn, hvit tekst for linjer 1-10
  } else if (lineNumber >= 11 && lineNumber <= 20) {
    return "bg-orange-600 text-white"; // Oransje bakgrunn, hvit tekst for linjer 11-20
  } else if (lineNumber >= 21 && lineNumber <= 30) {
    return "bg-teal-600 text-white"; // Teal bakgrunn, hvit tekst for linjer 21-30
  } else {
    return "bg-gray-700 text-white"; // Mørk grå bakgrunn, hvit tekst for alle andre linjer
  }
};

// Oppdatert stil for tid
const departureTimeStyle =
  "font-semibold text-xl text-white bg-red-500 p-2 rounded-lg shadow-lg";

// For å gjøre stoppestedet mer synlig
const stopPlaceStyle =
  "text-sm font-bold text-white bg-indigo-700 p-2 rounded-lg shadow-md";

const Tavle = () => {
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const getDepartures = async () => {
      try {
        setLoading(true);
        setError(null);

        // Hent avganger fra ALLE stoppene
        const data = await fetchDepartures();

        console.log("Fetched data:", data); // Debug API-data

        if (!data || !Array.isArray(data.estimatedCalls)) {
          throw new Error("Ugyldig dataformat fra API");
        }

        // Sorter etter tid
        const sortedDepartures = data.estimatedCalls.sort(
          (a, b) =>
            new Date(a.expectedDepartureTime).getTime() -
            new Date(b.expectedDepartureTime).getTime()
        );

        if (isMounted) {
          // Bruk slice for å vise bare de første 5
          setDepartures(sortedDepartures.slice(0, 5));
        }
      } catch (err: unknown) {
        if (isMounted) {
          const errorMessage =
            err instanceof Error ? err.message : "Ukjent feil oppstod";
          setError(`Kunne ikke hente avganger: ${errorMessage}`);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getDepartures();

    // Oppdater hvert 60. sekund
    const intervalId = setInterval(getDepartures, 60000);

    // Cleanup når komponenten unmountes
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  if (loading) return <p className="text-gray-500">Laster avganger...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4 text-indigo-800 text-center">
        Bussavganger
      </h2>
      <ul className="space-y-4">
        {departures.length > 0 ? (
          departures.map((dep, idx) => {
            const busNumber = dep.serviceJourney?.line?.publicCode || "??";
            const destination = dep.destinationDisplay.frontText || "Ukjent";
            const departureTime = dep.expectedDepartureTime
              ? new Date(dep.expectedDepartureTime).toLocaleTimeString(
                  "nb-NO",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )
              : "Ugyldig tid";
            const stopPlace = dep.stopPlaceName || "Ukjent Stoppested";
            const lineColor = getLineColor(busNumber); // Hent fargen basert på linjenummer

            return (
              <li
                key={idx}
                className={`p-4 rounded-lg shadow-sm border-l-4 border-indigo-800 flex justify-between items-center ${lineColor}`}
              >
                <div>
                  <span className="font-semibold text-lg">
                    🚌 {busNumber} → {destination}
                  </span>
                  {/* Legg til hvit tekst og bakgrunn for stoppestedet */}
                  <p className={stopPlaceStyle}>{stopPlace}</p>
                </div>
                {/* Markér avgangstid med en sterk bakgrunnsfarge og tydelig tekst */}
                <span className={departureTimeStyle}>{departureTime}</span>
              </li>
            );
          })
        ) : (
          <p className="text-gray-500 text-center">
            Ingen avganger tilgjengelig
          </p>
        )}
      </ul>
    </div>
  );
};

export default Tavle;
