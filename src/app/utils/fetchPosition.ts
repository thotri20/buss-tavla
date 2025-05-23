import fetch from 'node-fetch';

export type Vehicle = {
  lineRef: string;
  publicCode: string;
  latitude: number;
  longitude: number;
  lastUpdated: string;
};

const ENTUR_GRAPHQL_URL = 'https://api.entur.io/realtime/v1/graphql';
const ALLOWED_LINES = ['21', '23', '27'];
const CLIENT_NAME = 'fluktruter'; // Replace with your app's name or domain

export async function fetchPositions(): Promise<Vehicle[]> {
  const query = `
    {
      vehicles(codespaceId: "INN") {
        line {
          lineRef
          publicCode
        }
        lastUpdated
        location {
          latitude
          longitude
        }
      }
    }
  `;

  try {
    const res = await fetch(ENTUR_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ET-Client-Name': CLIENT_NAME,
      },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`HTTP ${res.status} - ${errorText}`);
    }

    const json = await res.json();

    if (!json?.data?.vehicles) {
      throw new Error('Unexpected response: ' + JSON.stringify(json));
    }

    const vehicles = json.data.vehicles as any[];

    return vehicles
      .filter((v) => ALLOWED_LINES.includes(v.line?.publicCode))
      .map((v) => ({
        lineRef: v.line.lineRef,
        publicCode: v.line.publicCode,
        latitude: v.location.latitude,
        longitude: v.location.longitude,
        lastUpdated: v.lastUpdated,
      }));
  } catch (error) {
    console.error('Failed to fetch vehicle positions:', error);
    return []; // Return an empty list to avoid crashing
  }
}
