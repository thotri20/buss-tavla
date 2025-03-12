"use client";

import { useEffect, useState } from "react";
import { fetchDepartures } from "../utils/fetchDepartures";

interface Departure {
  expectedDepartureTime: string;
  destinationDisplay: { frontText: string };
  serviceJourney?: {
    line?: {
      publicCode?: string;
    };
  };
  stopPlaceName?: string;
}

const getLineColor = (line: string): string => {
  const lineNumber = parseInt(line, 10);
  if (lineNumber >= 1 && lineNumber <= 10) return "bg-blue-700 text-white";
  if (lineNumber >= 11 && lineNumber <= 20) return "bg-orange-600 text-white";
  if (lineNumber >= 21 && lineNumber <= 30) return "bg-teal-600 text-white";
  return "bg-gray-700 text-white";
};

const Tavle = () => {
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStop, setSelectedStop] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const getDepartures = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchDepartures();
        if (!data || !Array.isArray(data.estimatedCalls)) {
          throw new Error("Ugyldig dataformat fra API");
        }
        const sortedDepartures = data.estimatedCalls.sort(
          (a, b) =>
            new Date(a.expectedDepartureTime).getTime() -
            new Date(b.expectedDepartureTime).getTime()
        );
        if (isMounted) setDepartures(sortedDepartures);
      } catch (err) {
        if (isMounted) {
          const errorMessage =
            err instanceof Error ? err.message : "Kunne ikke hente avganger";
          setError(errorMessage);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    getDepartures();
    const intervalId = setInterval(getDepartures, 60000);
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const stopPlaces = [
    ...new Set(departures.map((dep) => dep.stopPlaceName)),
  ].filter(Boolean) as string[];
  const filteredDepartures = selectedStop
    ? departures.filter((dep) => dep.stopPlaceName === selectedStop)
    : departures;

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4 text-indigo-800 text-center">
        Andre holdeplasser
      </h2>
      <div className="mb-4 flex space-x-2 overflow-x-auto p-2 bg-white shadow-md rounded-lg">
        {stopPlaces.map((stop) => (
          <button
            key={stop}
            onClick={() => setSelectedStop(selectedStop === stop ? null : stop)}
            className={`px-4 py-2 text-sm font-bold rounded-lg shadow-md transition-colors ${
              selectedStop === stop
                ? "bg-blue-700 text-white"
                : "bg-gray-300 text-indigo-800"
            }`}
          >
            {stop}
          </button>
        ))}
      </div>
      {loading ? (
        <p className="text-gray-500">Laster avganger...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filteredDepartures.length > 0 ? (
        <ul className="space-y-4">
          {filteredDepartures.map((dep, idx) => {
            const busNumber = dep.serviceJourney?.line?.publicCode || "??";
            const destination = dep.destinationDisplay.frontText || "Ukjent";
            const departureTime = new Date(
              dep.expectedDepartureTime
            ).toLocaleTimeString("nb-NO", {
              hour: "2-digit",
              minute: "2-digit",
            });
            return (
              <li
                key={idx}
                className={`p-4 rounded-lg shadow-sm border-l-4 border-indigo-800 flex justify-between items-center ${getLineColor(
                  busNumber
                )}`}
              >
                <div>
                  <h2 className="font-semibold text-lg">
                    🚌 {busNumber} → {destination}
                  </h2>
                  <div>
                    <p className="text-sm font-bold text-white  p-2 ">
                      {dep.stopPlaceName}
                    </p>
                  </div>
                </div>
                <span className="font-semibold text-xl text-white bg-red-500 p-2 rounded-lg shadow-lg">
                  {departureTime}
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-500 text-center">Ingen avganger tilgjengelig</p>
      )}
    </div>
  );
};

export default Tavle;
