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
  stopPlace?: {
    name?: string;
  };
}

const stopPlaceIds = [
  "70115", // Opplands gate
  "10674", // Bellevue
  "10671", // Lilleajervegen
  "10689", // Vognvegen/Furubergvegen
  "10642", // Svartoldervegen
];

export const fetchDepartures = async (): Promise<{ estimatedCalls: EstimatedCall[] }> => {
  try {
    const queries = stopPlaceIds
      .map(
        (id) => `
      stop_${id}: stopPlace(id: "NSR:StopPlace:${id}") {
        name
        estimatedCalls(numberOfDepartures: 15) {
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
      }`
      )
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

    const allDepartures = stopPlaceIds.flatMap(
      (id) => data.data[`stop_${id}`]?.estimatedCalls.map((call: EstimatedCall) => ({
        ...call,
        stopPlaceName: data.data[`stop_${id}`]?.name,
        finalDestination: call.destinationDisplay.frontText || "Ukjent destinasjon"
      })) ?? []
    );

    return { estimatedCalls: allDepartures };
  } catch (error) {
    console.error("Fetch error:", error);
    return { estimatedCalls: [] };
  }
};
