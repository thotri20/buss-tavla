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

const CENTER_LAT = 60.807;
const CENTER_LNG = 11.058;
const RADIUS = 0.02; // ~2 km radius

const ALLOWED_LINES = [
  "B21", "B23", "B27",
  "674", "612", "671", "650",
  "637", "675", "646", "658",
  "692", "684", "697"
];

function isInArea(lat: number, lng: number): boolean {
  return (
    lat >= CENTER_LAT - RADIUS &&
    lat <= CENTER_LAT + RADIUS &&
    lng >= CENTER_LNG - RADIUS &&
    lng <= CENTER_LNG + RADIUS
  );
}

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
      .map((v) => ({
        lineRef: v.line.lineRef,
        publicCode: v.line.publicCode,
        latitude: v.location.latitude,
        longitude: v.location.longitude,
        lastUpdated: v.lastUpdated,
      }))
      .filter((v) => 
        ALLOWED_LINES.includes(v.publicCode) && isInArea(v.latitude, v.longitude)
      );
  } catch (error) {
    console.error('Feil ved henting av posisjoner:', error);
    return [];
  }
}
