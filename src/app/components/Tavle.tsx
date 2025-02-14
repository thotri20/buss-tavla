"use client";

import { useEffect, useState } from "react";
import { fetchDepartures } from "../utils/fetchDepartures";

// TypeScript-grensesnitt for avgangsdata
interface Departure {
  expectedDepartureTime: string;
  destinationDisplay: { frontText: string };
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

        const data = await fetchDepartures("58225");

        console.log("Fetched data:", data); // Debug API-data

        if (!data || !Array.isArray(data.estimatedCalls)) {
          throw new Error("Ugyldig dataformat fra API");
        }

        if (isMounted) {
          setDepartures(data.estimatedCalls);
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
    <div className="bg-gray-100 p-4 rounded shadow-md w-full max-w-md">
      <h2 className="text-lg font-bold mb-2">Avganger</h2>
      <ul>
        {departures.length > 0 ? (
          departures.map((dep, idx) => (
            <li key={idx} className="text-blue-600">
              {dep.destinationDisplay.frontText} -{" "}
              {dep.expectedDepartureTime ? (
                new Date(dep.expectedDepartureTime).toLocaleTimeString(
                  "nb-NO",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )
              ) : (
                <span className="text-red-500">Ugyldig tid</span>
              )}
            </li>
          ))
        ) : (
          <p>Ingen avganger tilgjengelig</p>
        )}
      </ul>
    </div>
  );
};

export default Tavle;
