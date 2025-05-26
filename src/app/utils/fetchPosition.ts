export type Vehicle = {
  lineRef: string;
  publicCode: string;
  latitude: number;
  longitude: number;
  lastUpdated: string;
};

type EnturVehicleResponse = {
  line: {
    lineRef: string;
    publicCode: string;
  };
  lastUpdated: string;
  location: {
    latitude: number;
    longitude: number;
  };
};

type GraphQLResponse = {
  data: {
    vehicles: EnturVehicleResponse[];
  };
};

const ALLOWED_LINES = ['21', '23', '27'];

export async function fetchPositions(): Promise<Vehicle[]> {
  try {
    const res = await fetch('/api/vehicles');
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} - ${res.statusText}`);
    }

    const json: GraphQLResponse = await res.json();

    const vehicles = json?.data?.vehicles;
    if (!vehicles || !Array.isArray(vehicles)) {
      throw new Error('Uventet responsformat: ' + JSON.stringify(json));
    }

    return vehicles
      .filter((v) => ALLOWED_LINES.includes(v.line.publicCode))
      .map((v) => ({
        lineRef: v.line.lineRef,
        publicCode: v.line.publicCode,
        latitude: v.location.latitude,
        longitude: v.location.longitude,
        lastUpdated: v.lastUpdated,
      }));
  } catch (error) {
    console.error('Feil ved henting av posisjoner:', error);
    return [];
  }
}
