// src/components/Tavle.tsx
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

        if (!data || !data.estimatedCalls) {
          throw new Error("Ugyldig dataformat");
        }

        if (isMounted) {
          setDepartures(data.estimatedCalls);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        if (isMounted) {
          setError("Kunne ikke hente avganger. Sjekk API-kallet.");
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
              {new Date(dep.expectedDepartureTime).toLocaleTimeString("nb-NO", {
                hour: "2-digit",
                minute: "2-digit",
              })}
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
