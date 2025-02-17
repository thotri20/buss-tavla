const ENTUR_API = "https://api.entur.io/journey-planner/v3/graphql";

interface EstimatedCall {
  expectedDepartureTime: string;
  destinationDisplay: {
    frontText: string;
  };
  serviceJourney?: {
    line?: {
      publicCode?: string;
    };
  };
}

export const fetchDepartures = async (stopPlaceId: string): Promise<{ estimatedCalls: EstimatedCall[] }> => {
  try {
    const query = `
      query {
        stopPlace(id: "NSR:StopPlace:${stopPlaceId}") {
          estimatedCalls(numberOfDepartures: 5) {
            expectedDepartureTime
            destinationDisplay {
              frontText
            }
            serviceJourney {
              line {
                publicCode
              }
            }
          }
        }
      }
    `;

    const response = await fetch(ENTUR_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "ET-Client-Name": "my-entur-tavle",
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();

    if (data.errors) {
      console.error("GraphQL errors:", data.errors);
      throw new Error(`API returnerte en GraphQL-feil: ${JSON.stringify(data.errors)}`);
    }

    return { estimatedCalls: data.data?.stopPlace?.estimatedCalls ?? [] };
  } catch (error) {
    console.error("Fetch error:", error);
    return { estimatedCalls: [] };
  }
};
