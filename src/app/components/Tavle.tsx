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
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4 text-blue-700 text-center">
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

            return (
              <li
                key={idx}
                className="bg-gray-50 p-4 rounded-lg shadow-sm border-l-4 border-blue-500"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-blue-700 font-semibold text-lg">
                      🚌 {busNumber} → {destination}
                    </span>
                    <p className="text-sm text-gray-500">{stopPlace}</p>
                  </div>
                  <span className="font-medium text-blue-600 text-lg">
                    {departureTime}
                  </span>
                </div>
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
