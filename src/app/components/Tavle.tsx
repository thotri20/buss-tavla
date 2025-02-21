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
  stopPlace?: { name?: string };
}

const getLineColor = (line: string): string => {
  const lineNumber = parseInt(line, 10);
  if (lineNumber >= 1 && lineNumber <= 10) {
    return "bg-blue-700 text-white";
  } else if (lineNumber >= 11 && lineNumber <= 20) {
    return "bg-orange-600 text-white";
  } else if (lineNumber >= 21 && lineNumber <= 30) {
    return "bg-teal-600 text-white";
  } else {
    return "bg-gray-700 text-white";
  }
};

const departureTimeStyle =
  "font-semibold text-xl text-white bg-red-500 p-2 rounded-lg shadow-lg";

const stopPlaceStyle =
  "text-sm font-bold text-white bg-indigo-700 p-2 rounded-lg shadow-md";

const Tavle = () => {
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStopPlace, setSelectedStopPlace] = useState<string | null>(
    null
  );

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

        const filteredDepartures = selectedStopPlace
          ? data.estimatedCalls.filter(
              (dep) => dep.stopPlace?.name === selectedStopPlace
            )
          : data.estimatedCalls;

        const sortedDepartures = filteredDepartures.sort(
          (a, b) =>
            new Date(a.expectedDepartureTime).getTime() -
            new Date(b.expectedDepartureTime).getTime()
        );

        if (isMounted) {
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
    const intervalId = setInterval(getDepartures, 60000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [selectedStopPlace]);

  if (loading) return <p className="text-gray-500">Laster avganger...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const stopPlaces = [
    "Opplands gate",
    "Bellevue",
    "Lilleajervegen",
    "Vognvegen/Furubergvegen",
    "Svartoldervegen",
  ];

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4 text-indigo-800 text-center">
        Bussavganger
      </h2>

      <div className="mb-4">
        <label
          htmlFor="stopPlace"
          className="block text-sm font-semibold text-indigo-800 mb-2"
        >
          Velg Stoppested:
        </label>
        <select
          id="stopPlace"
          value={selectedStopPlace || ""}
          className="w-full p-3 rounded-lg border-2 border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-indigo-800 transition-all ease-in-out duration-300 shadow-lg hover:bg-indigo-100"
          onChange={(e) => setSelectedStopPlace(e.target.value || null)}
        >
          <option value="">Alle Stopp</option>
          {stopPlaces.map((stopPlace, index) => (
            <option key={index} value={stopPlace}>
              {stopPlace}
            </option>
          ))}
        </select>
      </div>

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
            const stopPlace = dep.stopPlace?.name || "Ukjent Stoppested";
            const lineColor = getLineColor(busNumber);

            return (
              <li
                key={idx}
                className={`p-4 rounded-lg shadow-lg border-l-4 border-indigo-800 flex justify-between items-center ${lineColor} hover:scale-105 transition-all ease-in-out duration-200`}
              >
                <div>
                  <span className="font-semibold text-lg">
                    🚌 {busNumber} → {destination}
                  </span>
                  <p className={stopPlaceStyle}>{stopPlace}</p>
                </div>
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
