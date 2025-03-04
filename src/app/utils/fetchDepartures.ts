export const ENTUR_API = "https://api.entur.io/journey-planner/v3/graphql";

export interface EstimatedCall {
  expectedDepartureTime: string;
  destinationDisplay: {
    frontText: string;
  };
  serviceJourney?: {
    line?: {
      publicCode?: string;
    };
  };
  stopPlaceName?: string;
  finalDestination?: string;
}

export const stopPlaceIds: string[] = [
  "70115", // Opplands gate
  "10674", // Bellevue
  "10671", // Lilleajervegen
  "10689", // Vognvegen/Furubergvegen
  "10642", // Svartoldervegen
];

export const fetchDepartures = async (): Promise<{ estimatedCalls: EstimatedCall[] }> => {
  try {
    const queries = stopPlaceIds
      .map((id: string) => `
      stop_${id}: stopPlace(id: "NSR:StopPlace:${id}") {
        name
        estimatedCalls(numberOfDepartures: 10) {
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
      }`)
      .join("\n");

    const query = `query { ${queries} }`;

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

    const allDepartures: EstimatedCall[] = stopPlaceIds.flatMap((id: string) =>
      data.data[`stop_${id}`]?.estimatedCalls.map((call: EstimatedCall) => ({
        ...call,
        stopPlaceName: data.data[`stop_${id}`]?.name,
        finalDestination: call.destinationDisplay.frontText || "Ukjent destinasjon",
      })) ?? []
    );

    // Sorter etter avgangstid og ta kun de første 10
    const sortedDepartures = allDepartures
      .sort((a: EstimatedCall, b: EstimatedCall) => 
        new Date(a.expectedDepartureTime).getTime() - new Date(b.expectedDepartureTime).getTime()
      )
      .slice(0, 11);

    return { estimatedCalls: sortedDepartures };
  } catch (error) {
    console.error("Fetch error:", error);
    return { estimatedCalls: [] };
  }
};
