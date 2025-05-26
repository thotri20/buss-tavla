import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'cross-fetch';

const ENTUR_GRAPHQL_URL = 'https://api.entur.io/realtime/v2/vehicles/graphql';
const CLIENT_NAME = 'fluktruter';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
    const response = await fetch(ENTUR_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ET-Client-Name': CLIENT_NAME,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Entur API-feil: ${response.status} - ${text}`);
    }

    const json = await response.json();
    res.status(200).json(json);
  } catch (error: unknown) {
    let message = 'Ukjent feil';
    if (error instanceof Error) {
      message = error.message;
    }
    console.error('Feil fra Entur API:', error);
    res.status(500).json({ error: 'Feil fra Entur API', details: message });
  }
}
