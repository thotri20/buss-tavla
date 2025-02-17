"use client";
import { useEffect, useState } from "react";
import { fetchDepartures } from "../utils/fetchDepartures"; // Importer fetchDepartures korrekt
import { fetchNearestStopPlace } from "../utils/fetchNearestStopPlace"; // Importer fetchNearestStopPlace

interface Departure {
  expectedDepartureTime: string;
  destinationDisplay: { frontText: string };
}

const Tavle = () => {
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stopPlaceId, setStopPlaceId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const getStopPlaceAndDepartures = async () => {
      try {
        setLoading(true);
        setError(null);

        // Koordinatene for Hamar Katedralskole
        const latitude = 60.804825;
        const longitude = 11.05453;

        // Hent stoppested ID basert på koordinater
        const stopPlace = await fetchNearestStopPlace(latitude, longitude);
        
        console.log("Fetched StopPlace:", stopPlace);

        if (stopPlace && stopPlace.id) {
          setStopPlaceId(stopPlace.id); // Sett stoppested-ID
          // Hent avganger for det funnet stoppestedet (ID)
          const data = await fetchDepartures(stopPlace.id);
          
          if (data && data.estimatedCalls) {
            setDepartures(data.estimatedCalls);
          }
        } else {
          throw new Error("Ingen stoppested funnet.");
        }
      } catch (err: unknown) {
        if (isMounted) {
          const errorMessage =
            err instanceof Error ? err.message : "Ukjent feil oppstod";
          setError(`Kunne ikke hente data: ${errorMessage}`);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getStopPlaceAndDepartures();

    // Oppdater hvert 60. sekund
    const intervalId = setInterval(getStopPlaceAndDepartures, 60000);

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
      <h2 className="text-lg font-bold mb-2">Avganger fra Stoppested {stopPlaceId}</h2>
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
