import { useEffect, useState } from "react";
import { fetchPositions, Vehicle } from "../utils/fetchPosition";

export default function TestVehicleList() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchPositions();
        setVehicles(data);
        setError(null);
      } catch {
        setError("Feil ved henting av data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p>Laster posisjoner...</p>;
  if (error) return <p>{error}</p>;

  if (vehicles.length === 0) return <p>Ingen busser funnet.</p>;

  return (
    <div>
      <h2>Busser i området:</h2>
      <ul>
        {vehicles.map((v) => (
          <li key={v.lineRef}>
            Linje {v.publicCode}: ({v.latitude.toFixed(5)},{" "}
            {v.longitude.toFixed(5)}) - Sist oppdatert{" "}
            {new Date(v.lastUpdated).toLocaleTimeString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
