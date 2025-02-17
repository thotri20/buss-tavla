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
          setDepartures(sortedDepartures);
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
      <h2 className="text-xl font-bold mb-4 text-blue-700">Avganger</h2>
      <ul className="space-y-3">
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

            return (
              <li
                key={idx}
                className="flex justify-between items-center bg-gray-100 p-3 rounded-md"
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-lg text-gray-800">
                    🚌 {busNumber}
                  </span>
                </div>
                <span className="text-gray-600">{destination}</span>
                <span className="font-medium text-blue-600">
                  {departureTime}
                </span>
              </li>
            );
          })
        ) : (
          <p>Ingen avganger tilgjengelig</p>
        )}
      </ul>
    </div>
  );
};

export default Tavle;
