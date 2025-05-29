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
  return "bg-[#B8C6E0] text-black";
};

const Tavle = () => {
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStop, setSelectedStop] = useState<string | null>(null);
  const [selectedDeparture, setSelectedDeparture] = useState<Departure | null>(null);

  useEffect(() => {
    let isMounted = true;

    const getDepartures = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchDepartures();
        const sorted = data.estimatedCalls.sort(
          (a, b) =>
            new Date(a.expectedDepartureTime).getTime() -
            new Date(b.expectedDepartureTime).getTime()
        );
        if (isMounted) setDepartures(sorted);
      } catch (err) {
        if (isMounted) setError("Kunne ikke hente avganger");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    getDepartures();
    const interval = setInterval(getDepartures, 60000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const stopPlaces = [...new Set(departures.map((dep) => dep.stopPlaceName))].filter(Boolean) as string[];

  const filteredDepartures = selectedStop
    ? departures.filter((dep) => dep.stopPlaceName === selectedStop)
    : departures;

  const limitedDepartures = filteredDepartures.slice(0, 15);

  return (
    <div className="rounded-t-lg rounded-b-2xl bg-[#807b7b] w-full sm:w-[28rem]">
      <h2 className="text-2xl font-bold mb-4 text-white text-center">Andre holdeplasser</h2>

      <div className="mb-2 flex space-x-2 overflow-x-auto p-1 bg-white shadow-md rounded-lg scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        {stopPlaces.map((stop) => (
          <button
            key={stop}
            onClick={() => setSelectedStop(selectedStop === stop ? null : stop)}
            className={`px-3 py-1 text-xs font-bold rounded-lg shadow-md transition-colors ${
              selectedStop === stop ? "bg-[#000080] text-white" : "bg-gray-300 text-[#000080]"
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
      ) : limitedDepartures.length > 0 ? (
        <ul className="space-y-4">
          {limitedDepartures.map((dep, idx) => {
            const busNumber = dep.serviceJourney?.line?.publicCode || "??";
            const destination = dep.destinationDisplay.frontText || "Ukjent";
            const departureTime = new Date(dep.expectedDepartureTime).toLocaleTimeString("nb-NO", {
              hour: "2-digit",
              minute: "2-digit",
            });
            return (
              <li
                key={idx}
                className={`p-6 w-full sm:w-[28rem] rounded-xl flex items-center justify-between cursor-pointer ${getLineColor(busNumber)}`}
                onClick={() => setSelectedDeparture(dep)}
              >
                <div className="flex flex-col min-w-0">
                  <h2 className="font-semibold text-[1.3rem] whitespace-normal">
                    🚌 {busNumber} → {destination}
                  </h2>
                  <p className="text-[1.13rem] mt-2 font-bold text-black p-2">
                    {dep.stopPlaceName}
                  </p>
                </div>
                <span className="font-semibold text-xl text-white bg-[#000080] px-3 py-1 rounded-lg shadow-lg ml-auto whitespace-nowrap">
                  {departureTime}
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-500 text-center">Ingen avganger tilgjengelig</p>
      )}

      {/* Popup Modal */}
      {selectedDeparture && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-2">
              Linje {selectedDeparture.serviceJourney?.line?.publicCode || "??"}
            </h2>
            <p className="mb-4">
              🚏 {selectedDeparture.stopPlaceName}
            </p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
              onClick={() => alert("Map popup coming soon...")}
            >
              Vis på kart
            </button>
            <button
              className="bg-gray-400 text-black px-4 py-2 rounded"
              onClick={() => setSelectedDeparture(null)}
            >
              Lukk
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tavle;
